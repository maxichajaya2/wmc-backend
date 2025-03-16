import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
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

enum LoginErrors{
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  PASSWORD_INVALID = 'PASSWORD_INVALID',
  PASSWORD_NOT_SET = 'PASSWORD_NOT_SET',
}

export const VERIFICATION_USER_TTL = 1000 * 60 * 10; // 24 hours
export const VERIFICATION_USER_CACHE = {};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly webUsersRepository: WebUsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly rolesRepository: RolesRepository,
  ) { }

  private generateJWT(payload: {sub: number, email: string}){
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    })
  }

  async signIn({ email, password: passwordPayload }: SignInDto): Promise<LoginResponse> {
    try {
      console.debug(`Sign in attempt for ${email}`);
      const user = await this.webUsersRepository.findByEmail(email);
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
      const payload = { sub: user.id, email: user.email };
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

  async dashboardSignIn({ email, password: passwordPayload }: SignInDto): Promise<DashbaordLoginResponse> {
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
      const payload = { sub: user.id, email: user.email };
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

  async preRegister(preRegisterDto: CreateWebUserDto){
    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if(!emailRegex.test(preRegisterDto.email)){
      throw new BadRequestException('Email no válido');
    }
    const { email } = preRegisterDto;
    // if(![1,2].includes(idioma)){
    //   throw new BadRequestException('Idioma no válido');
    // }
   if(await this.webUserAlreadyExists(email)){
     throw new BadRequestException(APP_ERRORS[ERROR_CODES.USER_ALREADY_EXISTS]);
   } 
   const token = uuidv4();
   await this.mailService.sendRegisterLink({ to: email, code: token });
   const value = {
    payload: preRegisterDto,
    expiresAt: (new Date()).getTime() + VERIFICATION_USER_TTL,
   }
    VERIFICATION_USER_CACHE[token] = JSON.stringify(value);
    return {
      token
    }
  }

  async register(token: string){
    const value = VERIFICATION_USER_CACHE[token];
    if(!value){
      throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
    }
    const { payload, expiresAt } = JSON.parse(value);
    if((new Date()).getTime() > expiresAt){
      throw new BadRequestException('Token expired');
    }
    if(await this.webUserAlreadyExists(payload.email)){
      throw new BadRequestException(APP_ERRORS[ERROR_CODES.USER_ALREADY_EXISTS]);
    }
    const user = await this.webUsersRepository.create(payload);
    delete VERIFICATION_USER_CACHE[token];
    const jwt = await this.generateJWT({ sub: user.id, email: user.email });
    return {
      user,
      token: jwt,
    }
  }

  private async webUserAlreadyExists(email: string) {
    const user = await this.webUsersRepository.findByEmail(email);
    return !!user;
  }

  // generateToken(user: Partial<User>) {
  //   const payload = { sub: user.id, email: user.email };
  //   return this.jwtService.sign(payload, {
  //     secret: this.configService.get<string>('JWT_SECRET'),
  //   });
  // }

  async sendResetPasswordOtp(email: string) {
    const user = await this.webUsersRepository.findByEmail(email);
    if(!user){
      throw new NotFoundException('User not found');
    }
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
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;
    const value = VERIFICATION_USER_CACHE[token];
    if(!value){
      throw new BadRequestException(APP_ERRORS[ERROR_CODES.INVALID_OTP]);
    }
    console.log({value});
    delete VERIFICATION_USER_CACHE[token];
    const { payload, expiresAt } = JSON.parse(value);
    const { email } = payload;
    if((new Date()).getTime() > expiresAt){
      throw new BadRequestException('Token expired');
    }
    const user = await this.webUsersRepository.findByEmail(email);
    if(!user){
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.webUsersRepository.update(user.id, { password });
    const jwt = await this.generateJWT({ sub: user.id, email: user.email });
    return {
      user: updatedUser,
      token: jwt,
    }
  }
}
