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
    // const template = `
    //             <h1>Código de verificación</h1>
    //             <p>Your Código de verificación is: <b>${code}</b></p>
    //         `;
    const template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(90deg, #004d58, #003540); padding:25px 0; text-align:center;">
              <img src="https://forotis.perumin.com/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td style="padding: 30px 40px 10px; text-align:center;">
              <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                Código de verificación
              </h1>
            </td>
          </tr>

          <!-- BODY TEXT -->
          <tr>
            <td style="padding: 10px 40px; text-align:center; color:#444; font-size:15px; line-height:1.5;">
              Usa el siguiente código para continuar con tu proceso:
            </td>
          </tr>

          <!-- CODE BOX -->
          <tr>
            <td style="padding: 20px 40px 30px; text-align:center;">
              <div style="
                display:inline-block;
                background:#ffffff;
                border-left:4px solid #004d58;
                padding:14px 24px;
                font-size:22px;
                font-weight:bold;
                color:#000;
                font-family:Consolas,'Courier New',monospace;
                border-radius:6px;
              ">
                ${code}
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:18px; font-size:12px; color:#666;">
              © ${new Date().getFullYear() + 1} World Mining Congress. Todos los derechos reservados.<br>
              Lima, Perú
            </td>
          </tr>

        </table>
      </div>
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
    // const template = `
    // <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    //     <div style="text-align: center; padding: 20px 0;">
    //         <img src="https://forotis.perumin.com/logo-wmc.png" alt="WORLD MINING CONGRESS 26" style="max-width: 150px;">
    //     </div>
    //     <h1 style="color: #333; text-align: center;">🔒 Recupera tu contraseña</h1>
    //     <p style="font-size: 16px; color: #555; text-align: center;">
    //         Para restablecer tu contraseña, haz clic en el siguiente enlace:
    //     </p>
    //     <div style="text-align: center; margin: 20px 0;">
    //         <a href="${url}" target="_blank"
    //            style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007BFF;
    //                   text-decoration: none; border-radius: 5px; font-weight: bold;">
    //            Restablecer contraseña
    //         </a>
    //     </div>
    //     <p style="font-size: 14px; color: #777; text-align: center;">
    //         Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
    //     </p>
    //     <p style="font-size: 14px; color: #007BFF; word-break: break-word; text-align: center;">
    //         <a href="${url}" style="color: #007BFF; text-decoration: none;">${url}</a>
    //     </p>
    // </div>
    // `;
    const template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(90deg, #004d58, #003540); padding:25px 0; text-align:center;">
              <img src="https://forotis.perumin.com/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td style="padding: 30px 40px 10px; text-align:center;">
              <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                Recupera tu contraseña
              </h1>
            </td>
          </tr>

          <!-- BODY TEXT -->
          <tr>
            <td style="padding: 10px 40px 20px; text-align:center; color:#444; font-size:15px; line-height:1.5;">
              Para restablecer tu contraseña, haz clic en el siguiente botón:
            </td>
          </tr>

          <!-- BUTTON -->
          <tr>
            <td style="text-align:center; padding:10px 0 25px;">
              <a href="${url}" target="_blank"
                style="background:#004d58; color:white; text-decoration:none; padding:14px 28px; border-radius:6px; font-size:16px; display:inline-block; font-weight:bold;">
                Restablecer contraseña
              </a>
            </td>
          </tr>

          <!-- URL FALLBACK -->
          <tr>
            <td style="padding:10px 40px 5px; font-size:13px; color:#666; text-align:center;">
              Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 30px; text-align:center; word-break:break-word;">
              <a href="${url}" style="color:#004d58; font-size:13px; text-decoration:none;">${url}</a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:18px; font-size:12px; color:#666;">
              © ${new Date().getFullYear() + 1} World Mining Congress. Todos los derechos reservados.<br>
              Lima, Perú
            </td>
          </tr>

        </table>
      </div>
      `;

    return this.sendMail({
      to,
      template,
      subject: '[WORLD MINING CONGRESS 26] - RECUPERACIÓN DE CONTRASEÑA',
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
    // const template = `
    //             <div
    //   style="
    //     font-family: Arial, sans-serif;
    //     max-width: 600px;
    //     margin: 0 auto;
    //     padding: 20px;
    //     border: 1px solid #ddd;
    //     border-radius: 10px;
    //     background-color: #f9f9f9;
    //   "
    // >
    //   <div style="text-align: center; padding: 20px 0">
    //     <img
    //       src="https://forotis.perumin.com/logo-wmc.png"
    //       alt="WORLD MINING CONGRESS 26"
    //       style="max-width: 150px"
    //     />
    //   </div>
    //   <h1 style="color: #333; text-align: center">
    //     [WORLD MINING CONGRESS 26] - CONFIRMACIÓN DE REGISTRO
    //   </h1>

    //   <p style="font-size: 16px; color: #555; text-align: center">
    //     Bienvenido a la plataforma de presentación de Trabajos Técnicos para el
    //     <strong>WORLD MINING CONRESS 26 - WMC</strong>
    //   </p>

    //   <p style="font-size: 16px; color: #555; text-align: center">
    //     Para confirmar su registro y acceder a la plataforma, haga clic en el
    //     siguiente botón:
    //   </p>

    //   <div style="text-align: center; margin: 20px 0">
    //     <a
    //       href="${url}"
    //       style="
    //         display: inline-block;
    //         background-color: #007bff;
    //         color: #fff;
    //         text-decoration: none;
    //         font-size: 18px;
    //         padding: 12px 24px;
    //         border-radius: 5px;
    //       "
    //     >
    //       Confirmar Registro
    //     </a>
    //   </div>

    //   <p style="font-size: 14px; color: #777; text-align: center">
    //     Si el botón no funciona, copie y pegue el siguiente enlace en su
    //     navegador:
    //   </p>
    //   <p
    //     style="
    //       font-size: 14px;
    //       color: #007bff;
    //       word-break: break-word;
    //       text-align: center;
    //     "
    //   >
    //     <a href="${url}" style="color: #007bff; text-decoration: none">
    //       ${url}
    //     </a>
    //   </p>
    // </div>`;

    const template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(90deg, #004d58, #003540); padding:25px 0; text-align:center;">
              <img src="https://forotis.perumin.com/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td style="padding: 30px 40px 10px; text-align:center;">
              <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                CONFIRMACIÓN DE REGISTRO
              </h1>
            </td>
          </tr>

          <!-- BODY TEXT -->
          <tr>
            <td style="padding: 10px 40px; text-align:center; color:#444; font-size:15px;">
              Bienvenido a la plataforma de presentación de Trabajos Técnicos para el
              <strong>WORLD MINING CONGRESS 2026</strong>.
            </td>
          </tr>

          <tr>
            <td style="padding: 5px 40px 20px; text-align:center; color:#444; font-size:15px;">
              Para confirmar su registro y acceder a la plataforma, haga clic en el siguiente botón:
            </td>
          </tr>

          <!-- BUTTON -->
          <tr>
            <td style="text-align:center; padding:20px;">
              <a href="${url}"
                style="background:#004d58; color:white; text-decoration:none; padding:14px 28px; border-radius:6px; font-size:16px; display:inline-block;">
                Confirmar Registro
              </a>
            </td>
          </tr>

          <!-- URL FALLBACK -->
          <tr>
            <td style="padding:10px 40px; font-size:13px; color:#555; text-align:center;">
              Si el botón no funciona, copie y pegue el siguiente enlace en su navegador:
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 30px; text-align:center; word-break:break-word;">
              <a href="${url}" style="color:#004d58; font-size:13px;">${url}</a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:18px; font-size:12px; color:#666;">
              © ${new Date().getFullYear() + 1} World Mining Congress. Todos los derechos reservados.<br>
              Lima, Perú
            </td>
          </tr>

        </table>
      </div>
      `;

    return this.sendMail({
      to,
      template,
      subject: '[WORLD MINING CONRESS 26] - CONFIRMACIÓN DE REGISTRO',
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
    // const template = `
    //         <div
    //   style="
    //     font-family: Arial, sans-serif;
    //     max-width: 600px;
    //     margin: 0 auto;
    //     padding: 20px;
    //     border: 1px solid #ddd;
    //     border-radius: 10px;
    //     background-color: #f9f9f9;
    //   "
    // >
    //   <div style="text-align: center; padding: 20px 0">
    //     <img
    //       src="https://forotis.perumin.com/logo-wmc.png"
    //       alt="WORLD MINING CONGRESS 26"
    //       style="max-width: 150px"
    //     />
    //   </div>
    //   <h1 style="color: #333; text-align: center">📩 Contacto</h1>

    //   <p style="font-size: 16px; color: #555">
    //     <strong>Nombre:</strong>
    //     <span style="color: #000">${name}</span>
    //   </p>
    //   <p style="font-size: 16px; color: #555">
    //     <strong>Email:</strong>
    //     <a href="mailto:${email}" style="color: #007bff; text-decoration: none">
    //       ${email}
    //     </a>
    //   </p>
    //   <p style="font-size: 16px; color: #555">
    //     <strong>Teléfono:</strong>
    //     <span style="color: #000">${phone}</span>
    //   </p>

    //   <div
    //     style="
    //       margin-top: 15px;
    //       padding: 10px;
    //       background-color: #fff;
    //       border-left: 4px solid #007bff;
    //     "
    //   >
    //     <p style="font-size: 16px; color: #555; margin: 0">
    //       <strong>Mensaje:</strong>
    //     </p>
    //     <p style="font-size: 16px; color: #000; margin: 5px 0">${message}</p>
    //   </div>
    // </div>
    //     `;
    const template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(90deg, #004d58, #003540); padding:25px 0; text-align:center;">
              <img src="https://forotis.perumin.com/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td style="padding: 30px 40px 10px; text-align:center;">
              <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                Nuevo Mensaje de Contacto
              </h1>
            </td>
          </tr>

          <!-- DATA FIELDS -->
          <tr>
            <td style="padding: 10px 40px; color:#444; font-size:15px; line-height:1.6;">
              
              <p><strong>Nombre:</strong> <span style="color:#000;">${name}</span></p>

              <p><strong>Email:</strong>
                <a href="mailto:${email}" style="color:#004d58; text-decoration:none; font-weight:bold;">
                  ${email}
                </a>
              </p>

              <p><strong>Teléfono:</strong> <span style="color:#000;">${phone}</span></p>

            </td>
          </tr>

          <!-- MESSAGE BOX -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;">
                <tr>
                  <td style="padding:16px; background:#ffffff; border-left:4px solid #004d58; border-radius:6px; color:#333; font-size:15px; line-height:1.5;">
                    <strong style="color:#004d58;">Mensaje:</strong>
                    <br>
                    <span style="color:#000;">${message}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:18px; font-size:12px; color:#666;">
              © ${new Date().getFullYear() + 1} World Mining Congress. Todos los derechos reservados.<br>
              Lima, Perú
            </td>
          </tr>

        </table>
      </div>
      `;

    return this.sendMail({
      to: email,
      template,
      subject: '[WORLD MINING CONGRESS 26] - Contacto',
      bcc: true,
    });
  }

  async sendPasswordGenerated({ email, password }) {
    // const template = `
    //         <div
    //   style="
    //     font-family: Arial, sans-serif;
    //     max-width: 600px;
    //     margin: 0 auto;
    //     padding: 20px;
    //     border: 1px solid #ddd;
    //     border-radius: 10px;
    //     background-color: #f9f9f9;
    //   "
    // >
    //   <div style="text-align: center; padding: 20px 0">
    //     <img
    //       src="https://forotis.perumin.com/logo-wmc.png"
    //       alt="WORLD MINING CONGRESS 26"
    //       style="max-width: 150px"
    //     />
    //   </div>
    //   <h1 style="color: #333; text-align: center">🔑 Acceso a Intranet</h1>
    //   <p style="font-size: 16px; color: #555; text-align: center">
    //     ¡Bienvenido! Hemos generado una contraseña para que puedas acceder a
    //     nuestra
    //     <strong>Intranet</strong>
    //     .
    //   </p>
    //   <div
    //     style="
    //       margin: 20px 0;
    //       padding: 15px;
    //       background-color: #fff;
    //       border-left: 4px solid #007bff;
    //       text-align: center;
    //     "
    //   >
    //     <p style="font-size: 16px; color: #555; margin: 0">
    //       <strong>Tu nueva contraseña:</strong>
    //     </p>
    //     <p
    //       style="font-size: 20px; color: #000; font-weight: bold; margin: 5px 0"
    //     >
    //       ${password}
    //     </p>
    //   </div>
    //   <p style="font-size: 16px; color: #555; text-align: center">
    //     Puedes ingresar a la Intranet haciendo clic en el siguiente botón:
    //   </p>
    //   <div style="text-align: center; margin-top: 15px">
    //     <a
    //       href="https://forotis.perumin.com"
    //       target="_blank"
    //       style="
    //         display: inline-block;
    //         padding: 12px 20px;
    //         font-size: 16px;
    //         color: #fff;
    //         background-color: #007bff;
    //         text-decoration: none;
    //         border-radius: 5px;
    //         font-weight: bold;
    //       "
    //     >
    //       Acceder a la Intranet
    //     </a>
    //   </div>
    // </div>
    //     `;

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
          src="https://forotis.perumin.com/logo-wmc.png"
          alt="WORLD MINING CONGRESS 26"
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
      subject: '[WORLD MINING CONGRESS 26] - Acceso a la Intranet',
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
    // let template = `
    //         <div
    //   style="
    //     font-family: Arial, sans-serif;
    //     max-width: 600px;
    //     margin: 0 auto;
    //     padding: 20px;
    //     border: 1px solid #ddd;
    //     border-radius: 10px;
    //     background-color: #f9f9f9;
    //   "
    // >
    //   <div style="text-align: center; padding: 20px 0">
    //     <img
    //       src="https://forotis.perumin.com/logo-wmc.png"
    //       alt="WORLD MINING CONGRESS 26"
    //       style="max-width: 150px"
    //     />
    //   </div>
    //   <h1 style="color: #333; text-align: center">
    //     📢 Actualización de Estado
    //   </h1>

    //   <p style="font-size: 16px; color: #555; text-align: center">
    //     El estado de tu trabajo técnico
    //     <strong style="color: #007bff">${title}</strong>
    //     ha sido actualizado a:
    //   </p>

    //   <div style="text-align: center; margin: 20px 0">
    //     <span
    //       style="
    //         display: inline-block;
    //         background-color: #007bff;
    //         color: #fff;
    //         font-size: 18px;
    //         padding: 8px 16px;
    //         border-radius: 5px;
    //       "
    //     >
    //       <strong>${paperStateMap[state]}</strong>
    //     </span>
    //   </div>

    //   <p
    //     style="
    //       font-size: 14px;
    //       color: #777;
    //       text-align: center;
    //       margin-top: 20px;
    //     "
    //   >
    //     Para más detalles, por favor revisa tu cuenta en la plataforma.
    //   </p>
    // </div>
    //     `;

    let template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(90deg, #004d58, #003540); padding:25px 0; text-align:center;">
              <img src="https://forotis.perumin.com/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td style="padding: 30px 40px 10px; text-align:center;">
              <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                Actualización de Estado
              </h1>
            </td>
          </tr>

          <!-- BODY TEXT -->
          <tr>
            <td style="padding: 10px 40px; text-align:center; color:#444; font-size:15px; line-height:1.5;">
              El estado de tu trabajo técnico
              <strong style="color:#004d58;">${title}</strong>
              ha sido actualizado a:
            </td>
          </tr>

          <!-- STATUS BADGE -->
          <tr>
            <td style="padding: 10px 40px; text-align:center;">
              <span style="
                display:inline-block;
                background:#004d58;
                color:white;
                font-size:18px;
                padding:10px 20px;
                border-radius:6px;
                font-weight:bold;
              ">
                ${paperStateMap[state]}
              </span>
            </td>
          </tr>

          <!-- CTA TEXT -->
          <tr>
            <td style="padding: 20px 40px 30px; text-align:center; color:#666; font-size:14px;">
              Para más detalles, por favor ingresa a tu cuenta en la plataforma.
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1f1f1; text-align:center; padding:18px; font-size:12px; color:#666;">
              © ${new Date().getFullYear() + 1} World Mining Congress. Todos los derechos reservados.<br>
              Lima, Perú
            </td>
          </tr>

        </table>
      </div>
      `;

    if (state === PaperState.RECEIVED) {
      //   template = `
      //        <div
      //   style="
      //     font-family: Arial, sans-serif;
      //     max-width: 600px;
      //     margin: 0 auto;
      //     padding: 20px;
      //     border: 1px solid #ddd;
      //     border-radius: 10px;
      //     background-color: #f9f9f9;
      //   "
      // >
      //   <div style="text-align: center; padding: 20px 0">
      //     <img
      //       src="https://forotis.perumin.com/logo-wmc.png"
      //       alt="WORLD MINING CONGRESS 26"
      //       style="max-width: 150px"
      //     />
      //   </div>

      //   <p style="font-size: 16px; color: #555">Estimado/a participante,</p>

      //   <p style="font-size: 16px; color: #555">
      //     Confirmamos la recepción de su resumen con el cual está ingresando a competir en la convocatoria de trabajos tecnicos del
      //     <strong>Premio Nacional de Minería</strong>
      //     . El comité estará realizando las evaluaciones hasta el 13 de junio y puede hacer seguimiento de su participación por el mismo portal ingresando su usuario y contraseña.
      //   </p>

      //   <p style="font-size: 16px; color: #555">
      //     Para cualquier consulta, puede contactarse al
      //     <strong>WhatsApp</strong>
      //     al
      //     <a
      //       href="https://wa.me/51973855242"
      //       style="color: #007bff; text-decoration: none"
      //     >
      //       973855242
      //     </a>
      //     .
      //   </p>

      //   <p style="font-size: 16px; color: #555">Saludos cordiales,</p>

      //   <p style="font-size: 16px; color: #000">
      //     <strong>Carolina Galarza</strong>
      //     <br />
      //     Coordinadora Foro TIS
      //     <br />
      //     <span style="color: #007bff">WORLD MINING CONGRESS 26 Convención Minera</span>
      //   </p>
      // </div>
      //         `;
      template = `
        <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
          <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

            <!-- HEADER -->
            <tr>
              <td style="background: linear-gradient(90deg, #004d58, #003540); padding:25px 0; text-align:center;">
                <img src="https://forotis.perumin.com/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding: 30px 40px; color:#444; font-size:15px; line-height:1.6; text-align:left;">

                <p style="margin:0 0 18px;">
                  Estimado/a participante,
                </p>

                <p style="margin:0 0 18px;">
                  Confirmamos la recepción de su resumen con el cual está ingresando a competir en la convocatoria de Trabajos Técnicos del
                  <strong>Premio Nacional de Minería</strong>.
                </p>

                <p style="margin:0 0 18px;">
                  El comité estará realizando las evaluaciones hasta el <strong>13 de junio</strong>. Puede hacer seguimiento de su participación ingresando al portal con su usuario y contraseña.
                </p>

                <p style="margin:0 0 18px;">
                  Para cualquier consulta, puede contactarse vía <strong>WhatsApp</strong> al:
                  <br>
                  <a href="https://wa.me/51973855242" style="color:#004d58; text-decoration:none; font-weight:bold;">
                    +51 973 855 242
                  </a>
                </p>

                <p style="margin:0 0 24px;">
                  Saludos cordiales,
                </p>

                <p style="margin:0;">
                  <strong style="color:#000;">Carolina Galarza</strong><br>
                  Coordinadora Foro TIS<br>
                  <span style="color:#004d58; font-weight:bold;">WORLD MINING CONGRESS 26 – Convención Minera</span>
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background:#f1f1f1; text-align:center; padding:18px; font-size:12px; color:#666;">
                © ${new Date().getFullYear() + 1} World Mining Congress. Todos los derechos reservados.<br>
                Lima, Perú
              </td>
            </tr>

          </table>
        </div>
        `;
    }

    return this.sendMail({
      to,
      template,
      subject:
        '[WORLD MINING CONGRESS 26] - Actualización de estado de trabajo técnico',
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
