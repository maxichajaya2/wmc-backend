import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DashboardSignInDto } from './dto/dashboard-sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DashbaordLoginResponse, LoginResponse } from './types/login-response';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersRepository } from '../domain/repositories/users.repository';
import { APP_ERRORS, ERROR_CODES } from '../common/constants/errors.constants';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../common/services/mail.service';
import { CreateWebUserDto } from '../web-users/dto/create-web-user.dto';
import { WebUsersRepository } from '../domain/repositories/web-users.repository';
import { RolesRepository } from '../domain/repositories/roles.repository';
import { DocumentType, WebUser } from '../domain/entities/web-user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { IimpService } from '../domain/services/iimp.service';
import * as bcrypt from 'bcrypt';
import { AbstractRepository } from '../domain/repositories/abstract.repository';

enum LoginErrors {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  PASSWORD_INVALID = 'PASSWORD_INVALID',
  PASSWORD_NOT_SET = 'PASSWORD_NOT_SET',
}

export const VERIFICATION_USER_TTL = 1000 * 60 * 10; // 24 hours
export const VERIFICATION_USER_CACHE = {};

export enum LoginOrigin {
  BACKOFFICE,
  FRONTEND,
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly webUsersRepository: WebUsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly rolesRepository: RolesRepository,
    private readonly iimpService: IimpService,
    private readonly AbstractRepository: AbstractRepository,
  ) {}

  private generateJWT(payload: {
    sub: number;
    email: string;
    origin: LoginOrigin;
  }) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  // LOGIN
  // ==============================
  // async signIn({
  //   documentType,
  //   documentNumber,
  //   password: passwordPayload,
  // }: SignInDto): Promise<LoginResponse> {
  //   try {
  //     console.debug(
  //       `Sign in web user attempt for ${documentType} ${documentNumber}`,
  //     );

  //     // 1. Buscar usuario en Base de Datos Local
  //     const user = await this.webUsersRepository.findByDocument({
  //       documentType,
  //       documentNumber,
  //     });
  //     if (!user) {
  //       throw new UnauthorizedException({
  //         code: LoginErrors.USER_NOT_FOUND,
  //         message: 'User not found',
  //       });
  //     }

  //     // 2. Validar contraseña contra la Base de Datos Local
  //     // Asumimos que iimpDecryptedPassword tiene la contraseña correcta guardada
  //     const isPasswordValid =
  //       user.iimpDecryptedPassword.trim() === passwordPayload.trim();

  //     if (!isPasswordValid) {
  //       // AQUI PODRIAS AGREGAR UN "FALLBACK":
  //       // Si falla localmente, intentar con el servicio IIMP por si el usuario cambió su clave allá recientemente.
  //       // Pero por ahora, si falla local, lanzamos error.
  //       throw new UnauthorizedException({
  //         code: LoginErrors.PASSWORD_INVALID,
  //         message: 'Invalid password',
  //       });
  //     }

  //     if (!user.isActive) {
  //       throw new UnauthorizedException({
  //         code: LoginErrors.USER_NOT_FOUND,
  //         message: 'User is blocked',
  //       });
  //     }

  //     // --- CAMBIO PRINCIPAL AQUÍ ---
  //     // Antes este bloque lanzaba error si IIMP fallaba. Ahora lo hacemos opcional o informativo.

  //     try {
  //       const verifiedIimpResponse =
  //         await this.iimpService.verifyCredentials(user);
  //       if (!verifiedIimpResponse.ok) {
  //         console.warn(
  //           'Advertencia: Credenciales válidas localmente, pero IIMP retornó error o rechazo.',
  //         );
  //         // YA NO lanzamos el throw new UnauthorizedException
  //       }
  //     } catch (iimpError) {
  //       // Si el servicio IIMP está caído (timeout, error 500), capturamos el error
  //       // y permitimos que el flujo continúe porque la validación local fue exitosa.
  //       console.error(
  //         'El servicio IIMP no responde, permitiendo acceso por validación local.',
  //         iimpError.message,
  //       );
  //     }
  //     // -----------------------------

  //     const payload = {
  //       sub: user.id,
  //       email: user.email,
  //       origin: LoginOrigin.FRONTEND,
  //     };
  //     try {
  //       const token = await this.generateJWT(payload);
  //       return {
  //         user,
  //         token,
  //       };
  //     } catch (error) {
  //       console.debug(`Error getting token ${error.message}`);
  //       throw error;
  //     }
  //   } catch (error) {
  //     console.debug(error.message);
  //     throw error;
  //   }
  // }

  async signIn({
    documentType,
    documentNumber,
    password: passwordPayload,
  }: SignInDto): Promise<LoginResponse> {
    try {
      // 1. Buscar usuario ÚNICAMENTE en Base de Datos Local
      const user = await this.webUsersRepository.findByDocument({
        documentType,
        documentNumber,
      });

      if (!user) {
        throw new UnauthorizedException({
          code: LoginErrors.USER_NOT_FOUND,
          message: 'User not found',
        });
      }

      // 2. Validar contra la contraseña local (texto plano según tu lógica actual)
      const isPasswordValid =
        user.iimpDecryptedPassword.trim() === passwordPayload.trim();

      if (!isPasswordValid) {
        throw new UnauthorizedException({
          code: LoginErrors.PASSWORD_INVALID,
          message: 'Invalid password',
        });
      }

      // 3. Validar si el usuario está activo
      if (!user.isActive) {
        throw new UnauthorizedException({
          code: LoginErrors.USER_NOT_FOUND, // O crear un código USER_BLOCKED
          message: 'User is blocked',
        });
      }

      // 4. Generar JWT y retornar
      const payload = {
        sub: user.id,
        email: user.email,
        origin: LoginOrigin.FRONTEND,
      };

      const token = await this.generateJWT(payload);
      return {
        user,
        token,
      };
    } catch (error) {
      console.error(`Login error: ${error.message}`);
      throw error;
    }
  }
  async dashboardSignIn({
    email,
    password: passwordPayload,
  }: DashboardSignInDto): Promise<DashbaordLoginResponse> {
    try {
      console.debug(`Sign in attempt for ${email}`);
      const user = await this.usersRepository.findByEmail(email);
      const role = await this.rolesRepository.findById(user.role.id);
      user.role = role;
      if (!user) {
        throw new UnauthorizedException({
          code: LoginErrors.USER_NOT_FOUND,
          message: 'User not found',
        });
      }
      const isPasswordValid = user.password.trim() === passwordPayload.trim();
      if (!isPasswordValid) {
        throw new UnauthorizedException({
          code: LoginErrors.PASSWORD_INVALID,
          message: 'Invalid password',
        });
      }
      const payload = {
        sub: user.id,
        email: user.email,
        origin: LoginOrigin.BACKOFFICE,
      };
      try {
        const token = await this.generateJWT(payload);
        return {
          user,
          token,
        };
      } catch (error) {
        console.debug(`Error getting token ${error.message}`);
        throw error;
      }
    } catch (error) {
      console.debug(error.message);
      throw error;
    }
  }

  async getAuthenticatedUser(req: any) {
    const user = req['loggedUser'];
    return user;
  }

  //  PREREGISTER
  // ==============================
  // async preRegister(preRegisterDto: CreateWebUserDto) {
  //   const emailRegex = new RegExp(
  //     '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  //   );
  //   if (!emailRegex.test(preRegisterDto.email)) {
  //     throw new BadRequestException('Email no válido');
  //   }
  //   const { email, documentType, documentNumber } = preRegisterDto;
  //   const userByDocument = await this.webUsersRepository.findByDocument({
  //     documentType,
  //     documentNumber,
  //   });
  //   // const emailExists = await this.webUserEmailAlreadyExists(email);
  //   // if (emailExists || !!userByDocument) {
  //   //   throw new BadRequestException(APP_ERRORS[ERROR_CODES.USER_ALREADY_EXISTS]);
  //   // }
  //   const token = uuidv4();
  //   await this.mailService.sendRegisterLink({ to: email, code: token });
  //   const value = {
  //     payload: { ...preRegisterDto, password: 'not-needed' },
  //     expiresAt: new Date().getTime() + VERIFICATION_USER_TTL,
  //   };
  //   VERIFICATION_USER_CACHE[token] = JSON.stringify(value);
  //   return {
  //     token: process.env.SEND_MAIL_NOTIFICATIONS === 'false' ? token : null,
  //   };
  // }

  async preRegister(preRegisterDto: CreateWebUserDto) {
    const emailRegex = new RegExp(
      '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    );
    if (!emailRegex.test(preRegisterDto.email)) {
      throw new BadRequestException('Email no válido');
    }

    const { email, documentType, documentNumber } = preRegisterDto;

    // ============================================================
    // VALIDACIÓN: DNI Y CORREO
    // ============================================================
    const userByDocument = await this.webUsersRepository.findByDocument({
      documentType,
      documentNumber,
    });
    const emailExists = await this.webUserEmailAlreadyExists(email);

    if (emailExists || !!userByDocument) {
      throw new BadRequestException(
        'The email or document number is already registered.',
      );
    }

    // ============================================================
    // VALIDACIÓN: SOLO AUTORES DE ABSTRACTS
    // ============================================================
    // Buscamos si el correo existe en la tabla de abstracts
    const isAuthorInAbstract =
      await this.AbstractRepository.findByEmailRegister(email);

    if (!isAuthorInAbstract) {
      throw new BadRequestException(
        'The registered email does not match any existing abstract. Only authors of accepted abstracts are allowed to register in the system.',
      );
    }

    const token = uuidv4();

    // Enviamos el link de confirmación al correo
    await this.mailService.sendRegisterLink({ to: email, code: token });

    // --- CAMBIO CLAVE AQUÍ ---
    // Guardamos TODO el DTO (incluyendo la password real del usuario) en el caché
    const value = {
      payload: { ...preRegisterDto },
      expiresAt: new Date().getTime() + VERIFICATION_USER_TTL,
    };

    VERIFICATION_USER_CACHE[token] = JSON.stringify(value);

    return {
      token: process.env.SEND_MAIL_NOTIFICATIONS === 'false' ? token : null,
    };
  }

  //  REGISTER
  // ==============================

  // async register(token: string) {
  //   const value = VERIFICATION_USER_CACHE[token];
  //   if (!value) {
  //     throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
  //   }
  //   const { payload, expiresAt } = JSON.parse(value);
  //   if (new Date().getTime() > expiresAt) {
  //     throw new BadRequestException('Token expired');
  //   }
  //   const emailExists = await this.webUserEmailAlreadyExists(payload.email);
  //   const userByDocument = await this.webUsersRepository.findByDocument({
  //     documentType: payload.documentType,
  //     documentNumber: payload.documentNumber,
  //   });
  //   if (emailExists || !!userByDocument) {
  //     throw new BadRequestException(
  //       APP_ERRORS[ERROR_CODES.USER_ALREADY_EXISTS],
  //     );
  //   }
  //   const userModel: WebUser = payload;
  //   //handle error
  //   const iimpUser = await this.iimpService.register(userModel);
  //   if (!iimpUser.ok) {
  //     console.log('Error al registrar en IIMP');
  //     throw new BadRequestException('Error al registrar en IIMP');
  //   }
  //   const credentials = await this.iimpService.credentialCreate(userModel);
  //   if (!credentials.ok) {
  //     console.log('Error al crear credenciales en IIMP');
  //     throw new BadRequestException('Error al crear credenciales en IIMP');
  //   }
  //   const { password, decrypted_password } = credentials.payload;
  //   userModel.iimpPassword = password;
  //   userModel.iimpDecryptedPassword = decrypted_password;
  //   const user = await this.webUsersRepository.create(payload);
  //   // Enviar correo de bienvenida
  //   await this.mailService.sendPasswordGenerated({
  //     email: payload.email,
  //     password: decrypted_password,
  //   });
  //   delete VERIFICATION_USER_CACHE[token];
  //   const jwt = await this.generateJWT({
  //     sub: user.id,
  //     email: user.email,
  //     origin: LoginOrigin.FRONTEND,
  //   });
  //   return {
  //     user,
  //     token: jwt,
  //   };
  // }

  async register(token: string) {
    // 1. Recuperar los datos del caché
    const value = VERIFICATION_USER_CACHE[token];
    if (!value) {
      throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
    }

    const { payload, expiresAt } = JSON.parse(value);

    // 2. Validar expiración
    if (new Date().getTime() > expiresAt) {
      throw new BadRequestException('Token expired');
    }

    // 3. Verificación de existencia (Email/DNI)
    const emailExists = await this.webUserEmailAlreadyExists(payload.email);
    const userByDocument = await this.webUsersRepository.findByDocument({
      documentType: payload.documentType,
      documentNumber: payload.documentNumber,
    });

    if (emailExists || !!userByDocument) {
      throw new BadRequestException(
        APP_ERRORS[ERROR_CODES.USER_ALREADY_EXISTS],
      );
    }

    // --- NUEVA LÓGICA DE ENCRIPTACIÓN ---
    // Generamos el Hash (la versión "biologia01" -> "$2b$10$...")
    // El número 10 es el "salt rounds", el estándar de seguridad.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    // 4. PREPARACIÓN DEL OBJETO PARA LA BD
    const userToCreate: any = {
      ...payload,
      // Campo principal: Encriptado
      password: hashedPassword,

      // Campo iimpPassword: ENCRIPTADO (Como debe ser en producción)
      iimpPassword: hashedPassword,

      // Campo iimpDecryptedPassword: TEXTO PLANO (biologia01)
      // Se guarda así solo por compatibilidad con tu sistema de producción actual
      iimpDecryptedPassword: payload.password,

      webUserType: payload.webUserType || 'STANDARD',
    };

    // 5. GUARDAR EN BD
    const user = await this.webUsersRepository.create(userToCreate);

    // 6. ENVIAR CORREO DE BIENVENIDA
    // Al usuario le enviamos su clave original (payload.password), no el hash
    await this.mailService.sendPasswordGenerated({
      email: payload.email,
      password: payload.password,
    });

    // 7. LIMPIEZA
    delete VERIFICATION_USER_CACHE[token];

    // 8. GENERAR JWT
    const jwt = await this.generateJWT({
      sub: user.id,
      email: user.email,
      origin: LoginOrigin.FRONTEND,
    });

    return {
      user,
      token: jwt,
    };
  }

  private async webUserEmailAlreadyExists(email: string) {
    const user = await this.webUsersRepository.findByEmail(email);
    return !!user;
  }

  //  RECUPERAR PASSWORD
  // ==============================
  async sendResetPasswordOtp(email: string) {
    // 1. VALIDACIÓN: Buscar usuario en la base de datos local
    const user = await this.webUsersRepository.findByEmail(email);

    // Si no existe, lanzamos el error ANTES de hacer cualquier otra cosa
    if (!user) {
      throw new NotFoundException(
        'The email address provided is not registered in our system.',
      );
    }

    // 2. Si existe, procedemos con el token y el envío del correo
    const token = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + VERIFICATION_USER_TTL);

    VERIFICATION_USER_CACHE[token] = JSON.stringify({
      payload: { email },
      expiresAt: expiresAt.getTime(),
    });

    await this.mailService.sendResetPasswordLink({ to: email, code: token });

    return {
      message: 'OTP sent successfully',
      token,
    };
  }

  //  RESETEAR PASSWORD
  // ==============================
  // async resetPassword(resetPasswordDto: ResetPasswordDto) {
  //   const { token, password } = resetPasswordDto;
  //   const value = VERIFICATION_USER_CACHE[token];
  //   if (!value) {
  //     throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
  //   }

  //   delete VERIFICATION_USER_CACHE[token];
  //   const { payload, expiresAt } = JSON.parse(value);
  //   const { email } = payload;
  //   if (new Date().getTime() > expiresAt) {
  //     throw new BadRequestException('Token expired');
  //   }
  //   const user = await this.webUsersRepository.findByEmail(email);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   await this.iimpService.authCredentialUpdate(user, password);
  //   const updatedUser = await this.webUsersRepository.update(user.id, {
  //     iimpDecryptedPassword: password,
  //   });
  //   const jwt = await this.generateJWT({
  //     sub: user.id,
  //     email: user.email,
  //     origin: LoginOrigin.FRONTEND,
  //   });
  //   return {
  //     user: updatedUser,
  //     token: jwt,
  //   };
  // }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    const value = VERIFICATION_USER_CACHE[token];
    if (!value) {
      throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
    }

    const { payload, expiresAt } = JSON.parse(value);
    const { email } = payload;

    if (new Date().getTime() > expiresAt) {
      delete VERIFICATION_USER_CACHE[token];
      throw new BadRequestException('Token expired');
    }

    const user = await this.webUsersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 4. Encriptar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. ACTUALIZAR (Usamos 'as any' para evitar el error del DTO que mencionaste)
    const updatedUser = await this.webUsersRepository.update(user.id, {
      password: hashedPassword, // AHORA SÍ: Guardamos el HASH
      iimpPassword: hashedPassword, // HASH por compatibilidad
      iimpDecryptedPassword: password, // PLANO por compatibilidad
    } as any);

    delete VERIFICATION_USER_CACHE[token];

    const jwt = await this.generateJWT({
      sub: user.id,
      email: user.email,
      origin: LoginOrigin.FRONTEND,
    });

    return {
      user: updatedUser,
      token: jwt,
    };
  }
}
