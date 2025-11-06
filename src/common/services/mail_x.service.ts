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
                <h1>Verification code</h1>
                <p>Your verification code is: <b>${code}</b></p>
            `;

    return this.sendMail({
      to,
      template,
      subject: 'Verification code',
    })
      .then(() => {
        console.log(`Verification code sent to ${to}`);
      })
      .catch((error) => {
        console.error(`Error sending verification code to ${to}`);
        console.error(error.message);
      });
  }

  async sendResetPasswordLink({ to, code }) {
    const appUrl = process.env.APP_URL;
    const url = `${appUrl}/restablecer-contrasena?token=${code}`;
    const template = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; padding: 20px 0;">
            <img src="https://forotis.perumin.com/logo.png" alt="PERUMIN 37" style="max-width: 150px;">
        </div>
        <h1 style="color: #333; text-align: center;">🔒 Recover your password</h1>
        <p style="font-size: 16px; color: #555; text-align: center;">
            To recover your password, click on the following link:
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${url}" target="_blank"
               style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007BFF; 
                      text-decoration: none; border-radius: 5px; font-weight: bold;">
               Reset password
            </a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">
            If the button doesn't work, copy and paste the following link into your browser:
        </p>
        <p style="font-size: 14px; color: #007BFF; word-break: break-word; text-align: center;">
            <a href="${url}" style="color: #007BFF; text-decoration: none;">${url}</a>
        </p>
    </div>
    `;

    return this.sendMail({
      to,
      template,
      subject: '[World Mining Congress] - RECUPERACIÓN DE CONTRASEÑA',
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
          src="https://forotis.perumin.com/logo.png"
          alt="PERUMIN 37"
          style="max-width: 150px"
        />
      </div>
      <h1 style="color: #333; text-align: center">
        [WMC] - REGISTRATION CONFIRMATION
      </h1>

      <p style="font-size: 16px; color: #555; text-align: center">
        Welcome to the platform for submitting Technical Papers for the
        <strong>WMC</strong>
        en
        <strong>WORLD MINING CONGRESS</strong>
        .
      </p>

      <p style="font-size: 16px; color: #555; text-align: center">
        To confirm your registration and access the platform, click on the following button:
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
          Confirm Registration
        </a>
      </div>

      <p style="font-size: 14px; color: #777; text-align: center">
        If the button doesn't work, copy and paste the following link into your browser:
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
      subject: '[WMC] - REGISTRATION CONFIRMATION',
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
          src="https://forotis.perumin.com/logo.png"
          alt="PERUMIN 37"
          style="max-width: 150px"
        />
      </div>
      <h1 style="color: #333; text-align: center">📩 Contact</h1>

      <p style="font-size: 16px; color: #555">
        <strong>Name:</strong>
        <span style="color: #000">${name}</span>
      </p>
      <p style="font-size: 16px; color: #555">
        <strong>Email:</strong>
        <a href="mailto:${email}" style="color: #007bff; text-decoration: none">
          ${email}
        </a>
      </p>
      <p style="font-size: 16px; color: #555">
        <strong>Phone:</strong>
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
          <strong>Message:</strong>
        </p>
        <p style="font-size: 16px; color: #000; margin: 5px 0">${message}</p>
      </div>
    </div>
        `;
    return this.sendMail({
      to: email,
      template,
      subject: '[WMC] - Contact',
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
          src="https://forotis.perumin.com/logo.png"
          alt="PERUMIN 37"
          style="max-width: 150px"
        />
      </div>
      <h1 style="color: #333; text-align: center">🔑 Intranet access</h1>
      <p style="font-size: 16px; color: #555; text-align: center">
        Welcome! We have generated a password for you to access our
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
          <strong>Your new password:</strong>
        </p>
        <p
          style="font-size: 20px; color: #000; font-weight: bold; margin: 5px 0"
        >
          ${password}
        </p>
      </div>
      <p style="font-size: 16px; color: #555; text-align: center">
        You can access the Intranet by clicking on the following button:
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
          Access the Intranet
        </a>
      </div>
    </div>
        `;

    return this.sendMail({
      to: email,
      template,
      subject: '[WMC] - Intranet access',
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
          src="https://forotis.perumin.com/logo.png"
          alt="PERUMIN 37"
          style="max-width: 150px"
        />
      </div>
      <h1 style="color: #333; text-align: center">
        📢 Status Update
      </h1>

      <p style="font-size: 16px; color: #555; text-align: center">
        The status of your technical work
        <strong style="color: #007bff">${title}</strong>
        has been updated to:
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
        For more details, please check your account on the platform.
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
          src="https://forotis.perumin.com/logo.png"
          alt="PERUMIN 37"
          style="max-width: 150px"
        />
      </div>

      <p style="font-size: 16px; color: #555">Dear participant,</p>

      <p style="font-size: 16px; color: #555">
        We confirm the receipt of your summary with which you are entering to compete in the call for technical papers of the
        <strong>National Mining Award</strong>
        . The committee will be evaluating until June 13 and you can follow up on your participation through the same portal by entering your username and password.
      </p>

      <p style="font-size: 16px; color: #555">
        For any inquiries, you can contact
        <strong>WhatsApp</strong>
        at
        <a
          href="https://wa.me/51973855242"
          style="color: #007bff; text-decoration: none"
        >
          973855242
        </a>
        .
      </p>

      <p style="font-size: 16px; color: #555">Best regards,</p>

      <p style="font-size: 16px; color: #000">
        <strong>Carolina Galarza</strong>
        <br />
        Coordinadora Foro TIS
        <br />
        <span style="color: #007bff">World Mining Congress</span>
      </p>
    </div>
            `;
    }

    return this.sendMail({
      to,
      template,
      subject: '[WMC] - Technical work status update',
    })
      .then(() => {
        console.log(
          `Status update email sent to ${to}`,
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
