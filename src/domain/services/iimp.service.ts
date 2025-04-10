import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DocumentType, WebUser } from '../entities/web-user.entity';
import { ParametersRepository } from '../repositories/parameters.repository';

const REGISTER_API = 'https://services.iimp.org.pe/api.php';
const CREDENTIAL_API = 'https://services.iimp.org.pe/auth.php';

export interface ValidateSieResponse {
  response: Response;
}

export interface Response {
  Code: string;
  Message: string;
}

export interface ServiceResponse<T> {
  ok: boolean;
  payload: T;
}

@Injectable()
export class IimpService {
  constructor(private readonly parametersRepository: ParametersRepository) {}

  async register(
    webUser: WebUser,
  ): Promise<ServiceResponse<{ personId: number } | null>> {
    console.log('IimpService - register :: Registering web user', webUser);
    const { id_event, siecode_event } =
      await this.parametersRepository.getEventParameters();

    const {
      documentNumber,
      name,
      lastName,
      maternalLastName,
      email,
      documentType,
    } = webUser;
    const body = {
      ipAddress: '200.37.185.4',
      event: 'perumin',
      accessKey: '$2y$10EoqWZuIEQ4vnwtm2IU3bruqmBD9yDiLrdIGNTHnSIRgAAatpBE9YK',
      serviceKey: 'api_iimp',
      id_event,
      siecode_event,
      data: {
        service: 'api_persona_register_update',
        id_tipo_documento: documentType,
        documento: documentNumber,
        nombres: name,
        apellido_paterno: lastName,
        apellido_materno: maternalLastName ?? '',
        correo: email,
        fecha_nacimiento: '',
        celular: '',
        id_nacionalidad: '',
        id_tipo_documento_empresa: '',
        numero_documento_empresa: '',
        sexo: '',
        sie_code: '',
        id_pais: '',
        id_departamento: '',
        id_provincia: '',
        id_distrito: '',
        direccion: '',
        id_ocupacion: '',
        evento_nombre: 'perumin 37',
      },
    };

    const { data, status } = await axios.post<{
      message: string;
      status: boolean;
      id_persona: number;
    }>(REGISTER_API, body);

    console.log(`IimpService - register :: ${JSON.stringify({ status })}`);
    console.log(`IimpService - register :: ${JSON.stringify({ data })}`);
    const { id_persona, status: bodyStatus } = data;
    if (bodyStatus) {
      return {
        ok: true,
        payload: {
          personId: id_persona,
        },
      };
    }
    return {
      ok: false,
      payload: null,
    };
  }

  async credentialCreate(
    webUser: WebUser,
  ): Promise<
    ServiceResponse<{ password: string; decrypted_password: string } | null>
  > {
    console.log('IimpService - creadentialCreate :: webUser', webUser);
    const { id_event, siecode_event } =
      await this.parametersRepository.getEventParameters();
    const { documentNumber, documentType } = webUser;
    const body = {
      ipAddress: '200.37.185.4',
      event: 'perumin',
      accessKey: '$2y$10EoqWZuIEQ4vnwtm2IU3bruqmBD9yDiLrdIGNTHnSIRgAAatpBE9YK',
      serviceKey: 'auth_events',
      id_event,
      siecode_event,
      data: {
        service: 'auth_credential_create',
        id_tipo_documento: documentType,
        documento: documentNumber,
        auth_datos: '1',
        lun: 1,
        mar: 1,
        mie: 1,
        jue: 1,
        vie: 1,
        qr: '',
        web_access: 'false',
        evento_nombre: 'perumin 37',
      },
    };
    const { data, status } = await axios.post<{
      message: string;
      status: boolean;
      id_persona: number;
      password: string;
      decrypted_password: string;
    }>(CREDENTIAL_API, body);
    console.log(
      `IimpService - credentialCreate :: ${JSON.stringify({ status })}`,
    );
    console.log(
      `IimpService - credentialCreate :: ${JSON.stringify({ data })}`,
    );
    const { password, decrypted_password, status: bodyStatus } = data;
    if (bodyStatus) {
      return {
        ok: true,
        payload: {
          password,
          decrypted_password,
        },
      };
    }
    return {
      ok: false,
      payload: null,
    };
  }

  async verifyCredentials(
    webUser: WebUser,
  ): Promise<ServiceResponse<ValidateSieResponse>> {
    console.log('IimpService - verifyCredentials :: webUser', webUser);
    const { id_event, siecode_event } =
      await this.parametersRepository.getEventParameters();
    const { documentNumber, documentType, iimpDecryptedPassword } = webUser;
    if (!iimpDecryptedPassword) {
      return {
        ok: false,
        payload: {
          response: {
            Code: '400',
            Message: 'No credentials found',
          },
        },
      };
    }
    const body = {
      ipAddress: '200.37.185.4',
      event: 'perumin',
      accessKey: '$2y$10EoqWZuIEQ4vnwtm2IU3bruqmBD9yDiLrdIGNTHnSIRgAAatpBE9YK',
      serviceKey: 'auth_events',
      id_event,
      siecode_event,
      data: {
        service: 'auth_credential_verify',
        id_tipo_documento: documentType,
        documento: documentNumber,
        password: iimpDecryptedPassword,
        evento_nombre: 'perumin 37',
      },
    };
    const { data, status } = await axios.post<{
      message: string;
      usuario: {
        id: number;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        fecha_nacimiento: Date;
        correo: string;
        celular: string;
        sexo: string;
        sie_code: string;
        qr: string;
        dias: string;
        autorizacion_datos: boolean;
        web_access: boolean;
      };
      status: boolean;
    }>(CREDENTIAL_API, body);
    console.log(
      `IimpService - verifyCredentials :: ${JSON.stringify({ status })}`,
    );
    console.log(
      `IimpService - verifyCredentials :: ${JSON.stringify({ data })}`,
    );
    const { usuario: bodyStatus } = data;
    if (bodyStatus.web_access || bodyStatus.autorizacion_datos) {
      console.log('Credentials verified');
      return {
        ok: true,
        payload: {
          response: {
            Code: '200',
            Message: 'Credentials verified',
          },
        },
      };
    }
    console.log('Credentials not verified');
    return {
      ok: false,
      payload: {
        response: {
          Code: '400',
          Message: 'Credentials not verified',
        },
      },
    };
  }

  // auth_credential_update
  async authCredentialUpdate(
    webUser: WebUser,
    newPassword: string,
  ): Promise<ServiceResponse<ValidateSieResponse>> {
    console.log('IimpService - updateCredentials :: webUser', webUser);
    const { id_event, siecode_event } =
      await this.parametersRepository.getEventParameters();
    const { documentNumber, documentType } = webUser;

    const body = {
      ipAddress: '200.37.185.4',
      event: 'perumin',
      accessKey: '$2y$10EoqWZuIEQ4vnwtm2IU3bruqmBD9yDiLrdIGNTHnSIRgAAatpBE9YK',
      serviceKey: 'auth_events',
      id_event,
      siecode_event,
      data: {
        service: 'auth_credential_update',
        id_tipo_documento: documentType,
        documento: documentNumber,
        auth_datos: '1',
        lun: 0,
        mar: 0,
        mie: 0,
        jue: 0,
        vie: 1,
        qr: '',
        web_access: 'false',
        password: newPassword,
        evento_nombre: 'perumin 37',
      },
    };
    const { data, status } = await axios.post<{
      message: string;
      usuario: {
        id: number;
        nombres: string;
        apellido_paterno: string;
        apellido_materno: string;
        fecha_nacimiento: Date;
        correo: string;
        celular: string;
        sexo: string;
        sie_code: string;
        qr: string;
        dias: string;
        autorizacion_datos: boolean;
        web_access: boolean;
      };
      status: boolean;
    }>(CREDENTIAL_API, body);
    console.log(
      `IimpService - updateCredentials :: ${JSON.stringify({ status })}`,
    );
    console.log(
      `IimpService - updateCredentials :: ${JSON.stringify({ data })}`,
    );
    const { status: statusResponse } = data;
    if (statusResponse) {
      console.log('Credentials updated');
      return {
        ok: true,
        payload: {
          response: {
            Code: '200',
            Message: 'Credentials updated',
          },
        },
      };
    }
    console.log('Credentials not updated');
    return {
      ok: false,
      payload: {
        response: {
          Code: '400',
          Message: 'Credentials not updated',
        },
      },
    };
  }
}
