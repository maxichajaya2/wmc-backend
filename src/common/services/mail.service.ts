import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendContactEmailDto } from '../dtos/send-contact-email.dto';
import {
  Paper,
  PaperState,
  paperStateMap,
} from '../../domain/entities/paper.entity';

@Injectable()
export class MailService {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendMail({ to, template, subject, bcc = false }) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: template,
      bcc: bcc ? process.env.EMAIL_USER : undefined,
    };

    const sendMailIsActive =
      (process.env.SEND_MAIL_NOTIFICATIONS || 'true') === 'true';
    if (!sendMailIsActive) {
      console.debug('Email sending is DISABLED. Returning success response.');
      return Promise.resolve({
        to: mailOptions.to,
      });
    }

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }

  async sendVerificationCode({ to, code }) {
    const template = `
                <h1>Código de verificación</h1>
                <p>Your Código de verificación is: <b>${code}</b></p>
            `;

    return this.sendMail({
      to,
      template,
      subject: 'Código de verificación',
    })
      .then(() => {
        console.log(`Código de verificación sent to ${to}`);
      })
      .catch((error) => {
        console.error(`Error sending código de verificación to ${to}`);
        console.error(error.message);
      });
  }

  async sendResetPasswordLink({ to, code }) {
    const appUrl = process.env.APP_URL;
    const url = `${appUrl}/restablecer-contrasena?token=${code}`;
    const template = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; padding: 20px 0;">
            <img src="https://forotis.perumin.com/img/logo-proexplo.png" alt="PROEXPLO2025" style="max-width: 150px;">
        </div>
        <h1 style="color: #333; text-align: center;">🔒 Recupera tu contraseña</h1>
        <p style="font-size: 16px; color: #555; text-align: center;">
            Para restablecer tu contraseña, haz clic en el siguiente enlace:
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${url}" target="_blank"
               style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007BFF; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
               Restablecer contraseña
            </a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">
            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
        </p>
        <p style="font-size: 14px; color: #007BFF; word-break: break-word; text-align: center;">
            <a href="${url}" style="color: #007BFF; text-decoration: none;">${url}</a>
        </p>
    </div>
    `;

    return this.sendMail({
      to,
      template,
      subject: '[PROEXPLO 2025] - RECUPERACIÓN DE CONTRASEÑA',
    })
      .then(() => {
        console.log(`Link de reset password enviado a ${to}`);
      })
      .catch((error) => {
        console.error(`Error sending reseta password to ${to}`);
        console.error(error.message);
      });
  }

  async sendRegisterLink({ to, code }) {
    const appUrl = process.env.APP_URL;
    console.log({ code });
    const url = `${appUrl}/confirmar-registro?token=${code}`;
    const template = `
                <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #f9f9f9;
      "
    >
      <div style="text-align: center; padding: 20px 0">
        <img
          src="https://forotis.perumin.com/img/logo-proexplo.png"
          alt="PROEXPLO 2025"
          style="max-width: 150px"
        />
      </div>
      <h1 style="color: #333; text-align: center">
        [PROEXPLO 2025] - CONFIRMACIÓN DE REGISTRO
      </h1>

      <p style="font-size: 16px; color: #555; text-align: center">
        Bienvenido a la plataforma de presentación de Trabajos Técnicos para
        <strong>PROEXPLO 2025</strong>.
      </p>

      <p style="font-size: 16px; color: #555; text-align: center">
        Para confirmar su registro y acceder a la plataforma, haga clic en el
        siguiente botón:
      </p>

      <div style="text-align: center; margin: 20px 0">
        <a
          href="${url}"
          style="
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            font-size: 18px;
            padding: 12px 24px;
            border-radius: 5px;
          "
        >
          Confirmar Registro
        </a>
      </div>

      <p style="font-size: 14px; color: #777; text-align: center">
        Si el botón no funciona, copie y pegue el siguiente enlace en su
        navegador:
      </p>
      <p
        style="
          font-size: 14px;
          color: #007bff;
          word-break: break-word;
          text-align: center;
        "
      >
        <a href="${url}" style="color: #007bff; text-decoration: none">
          ${url}
        </a>
      </p>
    </div>`;

    return this.sendMail({
      to,
      template,
      subject: '[PROEXPLO2025] - CONFIRMACIÓN DE REGISTRO',
    })
      .then(() => {
        console.log(`Link de registro enviado a ${to}`);
      })
      .catch((error) => {
        console.error(`Error sending link register to ${to}`);
        console.error(error.message);
      });
  }

  async sendContactEmail(sendContactEmailDto: SendContactEmailDto) {
    const { name, email, phone, message } = sendContactEmailDto;
    const template = `
            <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #f9f9f9;
      "
    >
      <div style="text-align: center; padding: 20px 0">
        <img
          src="https://forotis.perumin.com/img/logo-proexplo.png"
          alt="PROEXPLO2025"
          style="max-width: 150px"
        />
      </div>
      <h1 style="color: #333; text-align: center">📩 Contacto</h1>

      <p style="font-size: 16px; color: #555">
        <strong>Nombre:</strong>
        <span style="color: #000">${name}</span>
      </p>
      <p style="font-size: 16px; color: #555">
        <strong>Email:</strong>
        <a href="mailto:${email}" style="color: #007bff; text-decoration: none">
          ${email}
        </a>
      </p>
      <p style="font-size: 16px; color: #555">
        <strong>Teléfono:</strong>
        <span style="color: #000">${phone}</span>
      </p>

      <div
        style="
          margin-top: 15px;
          padding: 10px;
          background-color: #fff;
          border-left: 4px solid #007bff;
        "
      >
        <p style="font-size: 16px; color: #555; margin: 0">
          <strong>Mensaje:</strong>
        </p>
        <p style="font-size: 16px; color: #000; margin: 5px 0">${message}</p>
      </div>
    </div>
        `;
    return this.sendMail({
      to: email,
      template,
      subject: '[PROEXPLO2025] - Contacto',
      bcc: true,
    });
  }

  async sendPasswordGenerated({ email, password }) {
    const template = `
            <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #f9f9f9;
      "
    >
      <div style="text-align: center; padding: 20px 0">
        <img
          src="https://forotis.perumin.com/img/logo-proexplo.png"
          alt="PROEXPLO 2025"
          style="max-width: 150px"
        />
      </div>
      <h1 style="color: #333; text-align: center">🔑 Acceso a Intranet</h1>
      <p style="font-size: 16px; color: #555; text-align: center">
        ¡Bienvenido! Hemos generado una contraseña para que puedas acceder a
        nuestra
        <strong>Intranet</strong>
        .
      </p>
      <div
        style="
          margin: 20px 0;
          padding: 15px;
          background-color: #fff;
          border-left: 4px solid #007bff;
          text-align: center;
        "
      >
        <p style="font-size: 16px; color: #555; margin: 0">
          <strong>Tu nueva contraseña:</strong>
        </p>
        <p
          style="font-size: 20px; color: #000; font-weight: bold; margin: 5px 0"
        >
          ${password}
        </p>
      </div>
      <p style="font-size: 16px; color: #555; text-align: center">
        Puedes ingresar a la Intranet haciendo clic en el siguiente botón:
      </p>
      <div style="text-align: center; margin-top: 15px">
        <a
          href="https://forotis.perumin.com"
          target="_blank"
          style="
            display: inline-block;
            padding: 12px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          "
        >
          Acceder a la Intranet
        </a>
      </div>
    </div>
        `;

    return this.sendMail({
      to: email,
      template,
      subject: '[PROEXPLO2025] - Acceso a la Intranet',
      bcc: true,
    });
  }

  async sendPaperUpdateStatusEmail({
    to,
    paper,
  }: {
    to: string;
    paper: Paper;
  }) {
    const { state, title } = paper;
    let template = `
            <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #f9f9f9;
      "
    >
      <div style="text-align: center; padding: 20px 0">
        <img
          src="https://forotis.perumin.com/img/logo-proexplo.png"
          alt="PROEXPLO 2025"
          style="max-width: 150px"
        />
      </div>
      <h1 style="color: #333; text-align: center">
        📢 Actualización de Estado
      </h1>

      <p style="font-size: 16px; color: #555; text-align: center">
        El estado de tu trabajo técnico
        <strong style="color: #007bff">${title}</strong>
        ha sido actualizado a:
      </p>

      <div style="text-align: center; margin: 20px 0">
        <span
          style="
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            font-size: 18px;
            padding: 8px 16px;
            border-radius: 5px;
          "
        >
          <strong>${paperStateMap[state]}</strong>
        </span>
      </div>

      <p
        style="
          font-size: 14px;
          color: #777;
          text-align: center;
          margin-top: 20px;
        "
      >
        Para más detalles, por favor revisa tu cuenta en la plataforma.
      </p>
    </div>
        `;

    if (state === PaperState.RECEIVED) {
      template = `
           <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #f9f9f9;
      "
    >
      <div style="text-align: center; padding: 20px 0">
        <img
          src="https://forotis.perumin.com/img/logo-proexplo.png"
          alt="PROEXPLO 2025"
          style="max-width: 150px"
        />
      </div>

      <p style="font-size: 16px; color: #555">Estimado/a participante,</p>

      <p style="font-size: 16px; color: #555">
        Confirmamos la recepción de su resumen con el cual está ingresando a competir en la convocatoria de trabajos tecnicos del
        <strong>Premio Nacional de Minería</strong>
        . El comité estará realizando las evaluaciones hasta el 13 de junio y puede hacer seguimiento de su participación por el mismo portal ingresando su usuario y contraseña.
      </p>

      <p style="font-size: 16px; color: #555">
        Para cualquier consulta, puede contactarse al
        <strong>WhatsApp</strong>
        al
        <a
          href="https://wa.me/51973855242"
          style="color: #007bff; text-decoration: none"
        >
          973855242
        </a>
        .
      </p>

      <p style="font-size: 16px; color: #555">Saludos cordiales,</p>

      <p style="font-size: 16px; color: #000">
        <strong>Carolina Galarza</strong>
        <br />
        Coordinadora PROEXPLO 2025
        <br />
        <span style="color: #007bff">PROEXPLO 2025</span>
      </p>
    </div>
            `;
    }

    return this.sendMail({
      to,
      template,
      subject: '[PROEXPLO 2025] - Actualización de estado de trabajo técnico',
    })
      .then(() => {
        console.log(
          `Email de actualización de estado de paper enviado a ${to}`,
        );
      })
      .catch((error) => {
        console.error(
          `Error sending email de actualización de estado de paper to ${to}`,
        );
        console.error(error.message);
      });
  }
}
