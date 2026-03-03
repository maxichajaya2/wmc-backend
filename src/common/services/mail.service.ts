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
        <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
          <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

            <!-- HEADER -->
            <tr>
              <td style="background: linear-gradient(90deg, #004d58, #003540); padding:25px 0; text-align:center;">
                <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
              </td>
            </tr>

            <!-- TITLE -->
            <tr>
              <td style="padding: 30px 40px 10px; text-align:center;">
                <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                  Verification Code
                </h1>
              </td>
            </tr>

            <!-- BODY TEXT -->
            <tr>
              <td style="padding: 10px 40px; text-align:center; color:#444; font-size:15px; line-height:1.5;">
                Use the following code to continue your process:
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
              <td style="background:#f1f1f1; text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
                © ${new Date().getFullYear() + 1} World Mining Congress. All rights reserved.<br>
                Lima, Peru
              </td>
            </tr>

          </table>
        </div>
      `;

    return this.sendMail({
      to,
      template,
      subject: 'Verification Code',
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
        <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
          <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

            <!-- HEADER -->
            <tr>
              <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
                <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
              </td>
            </tr>

            <!-- TITLE -->
            <tr>
              <td style="padding: 30px 40px 10px; text-align:center;">
                <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                  Reset your password
                </h1>
              </td>
            </tr>

            <!-- BODY TEXT -->
            <tr>
              <td style="padding: 10px 40px 20px; text-align:center; color:#444; font-size:15px; line-height:1.5;">
                To reset your password, click the button below:
              </td>
            </tr>

            <!-- BUTTON -->
            <tr>
              <td style="text-align:center; padding:10px 0 25px;">
                <a href="${url}" target="_blank"
                  style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); color:white; text-decoration:none; padding:14px 28px; border-radius:6px; font-size:16px; display:inline-block; font-weight:bold;">
                  Reset password
                </a>
              </td>
            </tr>

            <!-- URL FALLBACK -->
            <tr>
              <td style="padding:10px 40px 5px; font-size:13px; color:#666; text-align:center;">
                If the button doesn’t work, copy and paste the following link into your browser:
              </td>
            </tr>

            <tr>
              <td style="padding: 0 40px 30px; text-align:center; word-break:break-word;">
                <a href="${url}" style="color:#004d58; font-size:13px; text-decoration:none;>${url}</a>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style=" background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
                © ${new Date().getFullYear() + 1} World Mining Congress. All rights reserved.<br>
                Lima, Peru
              </td>
            </tr>

          </table>
        </div>
          `;

    return this.sendMail({
      to,
      template,
      subject: '[WORLD MINING CONGRESS 26] - Reset Your Password',
    })
      .then(() => {
        console.log(`Password reset link sent to ${to}`);
      })
      .catch((error) => {
        console.error(`Error sending password reset link to ${to}`);
        console.error(error.message);
      });
  }

  async sendRegisterLink({ to, code }) {
    const appUrl = process.env.APP_URL;
    console.log({ code });
    const url = `${appUrl}/confirmar-registro?token=${code}`;
    const template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
              <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td style="padding: 30px 40px 10px; text-align:center;">
              <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                REGISTRATION CONFIRMATION
              </h1>
            </td>
          </tr>

          <!-- BODY TEXT -->
          <tr>
            <td style="padding: 10px 40px; text-align:center; color:#444; font-size:15px;">
              Welcome to the Technical Paper Submission Platform for the
              <strong>WORLD MINING CONGRESS 2026</strong>.
            </td>
          </tr>

          <tr>
            <td style="padding: 5px 40px 20px; text-align:center; color:#444; font-size:15px;">
              To confirm your registration and access the platform, click the button below:
            </td>
          </tr>

          <!-- BUTTON -->
          <tr>
            <td style="text-align:center; padding:20px;">
              <a href="${url}"
                style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); color:white; text-decoration:none; padding:14px 28px; border-radius:6px; font-size:16px; display:inline-block;">
                Confirm Registration
              </a>
            </td>
          </tr>

          <!-- URL FALLBACK -->
          <tr>
            <td style="padding:10px 40px; font-size:13px; color:#555; text-align:center;">
              If the button doesn't work, copy and paste the following link into your browser:
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 30px; text-align:center; word-break:break-word;">
              <a href="${url}" style="color:#004d58; font-size:13px;">${url}</a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
              © ${new Date().getFullYear() + 1} World Mining Congress. All rights reserved.<br>
              Lima, Peru
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
    const template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
              <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
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
            <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
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
            src="https://papers.wmc2026.org/logo-wmc.png"
            alt="WORLD MINING CONGRESS 26"
            style="max-width: 150px"
          />
        </div>
        <h1 style="color: #333; text-align: center">🔑 Intranet Access</h1>
        <p style="font-size: 16px; color: #555; text-align: center">
          Welcome! We have generated a password for you to access our
          <strong>Intranet</strong>.
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
          You can access the Intranet by clicking the button below:
        </p>
        <div style="text-align: center; margin-top: 15px">
          <a
            href="https://papers.wmc2026.org"
            target="_blank"
            style="
              display: inline-block;
              padding: 12px 20px;
              font-size: 16px;
              color: #fff;
               background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f);
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            "
          >
            Access Intranet
          </a>
        </div>
      </div>
    `;

    return this.sendMail({
      to: email,
      template,
      subject: '[WORLD MINING CONGRESS 26] - Intranet Access',
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
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <tr>
            <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
              <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px 10px; text-align:center;">
              <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                Status Update
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 40px; text-align:center; color:#444; font-size:15px; line-height:1.5;">
              The status of your technical paper 
              <strong style="color:#004d58;">${title}</strong>
              has been updated to: REVISIONS REQUIRED – Preliminary Evaluation Phase
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 40px; text-align:center;">
              <span style="
                display:inline-block;
                color:white;
                font-size:15px;
                padding:10px 20px;
                border-radius:6px;
                font-weight:bold;
                background:linear-gradient(90deg,#00b3dc,#0124e0,#00023f);
              ">
                PRESELECTED
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px 5px; text-align:justify; color:#444; font-size:14px; line-height:1.6;">
              Your paper has been reviewed. Please note that this is not a final approval. Authors are required to carefully review the evaluators’ comments, make the necessary corrections, and upload a revised version of the paper through the platform.
              <br><br>
              Final approval will be granted only after the revised submission has been reviewed and accepted.
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px 30px; text-align:center; color:#666; font-size:14px;">
              For more details, please log in to your account on the platform.
            </td>
          </tr>

          <tr>
            <td style=" background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
              © ${new Date().getFullYear()} World Mining Congress. All rights reserved.<br>
              Lima, Peru
            </td>
          </tr>

        </table>
      </div>
      `;

    if (state === PaperState.RECEIVED) {
      template = `
        <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
          <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

            <!-- HEADER -->
            <tr>
              <td style=" background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
                <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding: 30px 40px; color:#444; font-size:15px; line-height:1.6; text-align:left;">

                <p style="margin:0 0 18px;">
                  Dear participant,
                </p>

                <p style="margin:0 0 18px;">
                  Thank you for completing your registration to submit a technical paper for the
                  <strong>World Mining Congress 2026</strong>. Your submission has been successfully received and is
                  currently under review.
                </p>

                <p style="margin:0 0 18px;">
                  The Technical Committee will evaluate all submissions through <strong>January 22</strong>.
                  You can check the status of your submission by logging into the platform with your user credentials.
                </p>

                <p style="margin:0 0 18px;">
                  If you have any questions or need assistance, our team is available via <strong>Email address</strong>:
                  <br>
                  <a href="mailto:wmc2026authors@iimp.org.pe" style="color:#004d58; text-decoration:none; font-weight:bold;">
                    wmc2026authors@iimp.org.pe
                  </a>
                </p>

                <p style="margin:0 0 24px;">
                  We appreciate your contribution and commitment to promoting knowledge exchange
                  within the global mining community.
                </p>

                <p style="margin:0;">
                  <strong style="color:#000;">Doris Hiam-Galvez</strong><br>
                  Program Chair, WMC 2026<br>
                  <span style="color:#004d58; font-weight:bold;">WORLD MINING CONGRESS 2026 – WMC</span>
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style=" background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
                © ${new Date().getFullYear() + 1} World Mining Congress. All rights reserved.<br>
                Lima, Peru
              </td>
            </tr>

          </table>
        </div>
          `;
    }

    return this.sendMail({
      to,
      template,
      subject: '[WORLD MINING CONGRESS 26] - Technical Paper Status Update',
    })
      .then(() => {
        console.log(`Technical paper status update email sent to ${to}`);
      })
      .catch((error) => {
        console.error(
          `Error sending technical paper status update email to ${to}`,
        );
        console.error(error.message);
      });
  }

  async sendPaperApprovedEmail({ to, paper }: { to: string; paper: Paper }) {
    const { state, title } = paper;
    let template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

          <tr>
            <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
              <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 40px 10px; text-align:center;">
              <h1 style="margin:0; color:#004d58; font-size:22px; font-weight:bold;">
                Status Update
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 40px; text-align:center; color:#444; font-size:15px; line-height:1.5;">
              The status of your technical paper 
              <strong style="color:#004d58;">${title}</strong>
              has been updated to: REVISIONS REQUIRED – Preliminary Evaluation Phase
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 40px; text-align:center;">
              <span style="
                display:inline-block;
                color:white;
                font-size:15px;
                padding:10px 20px;
                border-radius:6px;
                font-weight:bold;
                background:linear-gradient(90deg,#00b3dc,#0124e0,#00023f);
              ">
                PRESELECTED
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px 5px; text-align:justify; color:#444; font-size:14px; line-height:1.6;">
              Your paper has been reviewed. Please note that this is not a final approval. Authors are required to carefully review the evaluators’ comments, make the necessary corrections, and upload a revised version of the paper through the platform.
              <br><br>
              Final approval will be granted only after the revised submission has been reviewed and accepted.
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px 30px; text-align:center; color:#666; font-size:14px;">
              For more details, please log in to your account on the platform.
            </td>
          </tr>

          <tr>
            <td style=" background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
              © ${new Date().getFullYear()} World Mining Congress. All rights reserved.<br>
              Lima, Peru
            </td>
          </tr>

        </table>
      </div>
      `;

    template = `
    <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
      <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">

        <tr>
          <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
            <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
          </td>
        </tr>

        <tr>
          <td style="padding: 30px 40px 10px; color:#444; font-size:15px; line-height:1.6; text-align:center;">
            <h1 style="margin:0 0 10px; color:#004d58; font-size:22px; font-weight:bold;">
              Congratulations!
            </h1>
            <p style="margin:0;">
              The status of your technical paper 
              <strong style="color:#004d58;">"${title}"</strong>
              has been updated to:
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding: 10px 40px; text-align:center;">
            <span style="
              display:inline-block;
              color:white;
              font-size:15px;
              padding:10px 25px;
              border-radius:6px;
              font-weight:bold;
              text-transform: uppercase;
              background:linear-gradient(90deg,#00b3dc,#0124e0,#00023f);
            ">
              SELECTED
            </span>
          </td>
        </tr>

        <tr>
          <td style="padding: 20px 40px; color:#444; font-size:15px; line-height:1.6; text-align:left;">
            <p style="margin:0 0 18px;">
              Dear participant, we are pleased to inform you that your submission was selected based on its technical quality and relevance to the global mining industry. We are excited to have your contribution at this world-class event in Lima, Peru.
            </p>

            <div style="background:#f9f9f9; border-left:4px solid #00b3dc; padding:15px; margin-bottom:20px;">
              <p style="margin:0; font-weight:bold; color:#333;">Next Steps:</p>
              <ul style="margin:10px 0 0; padding-left:20px;">
                <li>Log in to the platform to review any final remarks.</li>
                <li>Stay tuned for upcoming emails regarding presentation schedules and final formats.</li>
              </ul>
            </div>

            <p style="margin:0 0 24px;">
              Thank you for your valuable contribution and commitment to the global mining community.
            </p>

            <p style="margin:0;">
              <strong style="color:#000;">Doris Hiam-Galvez</strong><br>
              Program Chair, WMC 2026<br>
              <span style="color:#004d58; font-weight:bold;">WORLD MINING CONGRESS 2026 – WMC</span>
            </p>
          </td>
        </tr>

        <tr>
          <td style=" background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
            © ${new Date().getFullYear()} World Mining Congress. All rights reserved.<br>
            Lima, Peru
          </td>
        </tr>

      </table>
    </div>
  `;

    // Definimos el asunto por defecto
    let subject = '[WORLD MINING CONGRESS 26] - Technical Paper Status Update';

    // Si el estado es aprobado, personalizamos el asunto para que sea más impactante
    if (state === PaperState.APPROVED) {
      subject =
        '[WORLD MINING CONGRESS 26] - Congratulations! Your technical paper has been approved - WMC 2026';
    }
    return this.sendMail({
      to,
      template,
      subject, // Usamos la variable dinámica
    })
      .then(() => {
        // Log personalizado si es aprobado
        const logMsg =
          state === PaperState.APPROVED
            ? `CONGRATULATIONS email sent to ${to}`
            : `Technical paper status update email sent to ${to}`;
        console.log(logMsg);
      })
      .catch((error) => {
        console.error(
          `Error sending technical paper status update email to ${to}`,
        );
        console.error(error.message);
      });
  }

  async sendPaperObservedEmail({ to, paper }: { to: string; paper: Paper }) {
    const { title } = paper;
    const year = new Date().getFullYear();

    // El texto de estado que pediste específicamente
    const statusText = 'REVISIONS REQUIRED – Preliminary Evaluation Phase';
    const subject = `[WORLD MINING CONGRESS 26] - Observation: Your technical paper requires revisions - WMC 2026`;
    const platformUrl = 'https://papers.wmc2026.org/login';

    const template = `
  <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
    <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <tr>
        <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
          <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WMC 2026" style="max-width:160px;">
        </td>
      </tr>

      <tr>
        <td style="padding: 30px 40px;">
          <h1 style="margin:0 0 15px; color:#004d58; font-size:22px; font-weight:bold; text-align:center;">
            Status Update
          </h1>
          
          <p style="color:#444; font-size:15px; line-height:1.6; margin:0 0 20px;">
            Dear author, we inform you that the status of your technical paper titled <strong style="color:#004d58;">"${title}"</strong> has been updated to:
          </p>

        

          <p style="color:#444; font-size:14px; line-height:1.6; margin:0 0 20px;">
            Your paper has been reviewed and has observations that must be addressed to continue with the selection process.
          </p>

          <div style="background:#f9f9f9; border-left:4px solid #00b3dc; padding:20px; margin-bottom:25px;">
            <p style="margin:0 0 10px; font-weight:bold; color:#333; font-size:15px;">Instructions for Subsanated Process:</p>
            <p style="margin:0 0 10px; color:#555; font-size:14px; line-height:1.6;">
              You must log in to the platform, carefully review the comments from the assigned evaluator, and make the necessary corrections to your document. 
              <strong>Once you have addressed all observations, you must upload the revised version of your paper</strong> through your dashboard to proceed with a new evaluation.
            </p>
          </div>

          <p style="color:#666; font-size:13px; font-style:italic; margin-bottom:25px; text-align:center;">
            Please note that final approval is subject to the validation of these corrections by the evaluation committee.
          </p>

          <div style="text-align:center; margin-bottom:30px;">
            <a href="${platformUrl}" style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); color:white; padding:12px 30px; text-decoration:none; border-radius:5px; font-weight:bold; font-size:15px; display:inline-block;">
              Log in to the platform
            </a>
          </div>

          <div style="border-top:1px solid #eee; padding-top:20px; color:#444; font-size:14px;">
            <strong style="color:#000;">Doris Hiam-Galvez</strong><br>
            Program Chair, WMC 2026<br>
            <span style="color:#004d58; font-weight:bold;">WORLD MINING CONGRESS 2026 – WMC</span>
          </div>
        </td>
      </tr>

      <tr>
        <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
          © ${year} World Mining Congress. All rights reserved.<br>
          Lima, Peru
        </td>
      </tr>

    </table>
  </div>
  `;

    return this.sendMail({ to, template, subject })
      .then(() => {
        console.log(`Email de observación (OBSERVED) enviado a: ${to}`);
      })
      .catch((error) => {
        console.error(`Error enviando email a ${to}: ${error.message}`);
      });
  }

  async sendPaperDismissEmail({ to, paper }: { to: string; paper: Paper }) {
    const { title } = paper;
    const template = `
      <div style="width:100%; background:#f4f4f4; padding:30px 0; font-family:Arial, sans-serif;">
        <table align="center" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:white; border-radius:10px; overflow:hidden;">
          <tr>
            <td style="background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); padding:25px 0; text-align:center;">
              <img src="https://papers.wmc2026.org/logo-wmc.png" alt="WORLD MINING CONGRESS" style="max-width:160px;">
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px 10px; color:#444; font-size:15px; line-height:1.6; text-align:center;">
              <h1 style="margin:0 0 10px; color:#d9534f; font-size:22px; font-weight:bold;">
                Status Update
              </h1>
              <p style="margin:0;">
                The status of your technical paper 
                <strong style="color:#004d58;">"${title}"</strong>
                has been updated to:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 40px; text-align:center;">
              <span style="
                display:inline-block;
                color:white;
                font-size:15px;
                padding:10px 25px;
                border-radius:6px;
                font-weight:bold;
                text-transform: uppercase;
                background:#d9534f;
              ">
                DISMISSED
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 40px; color:#444; font-size:15px; line-height:1.6; text-align:left;">
              <p style="margin:0 0 18px;">
                Dear participant, we inform you that after a thorough review by our evaluation committee, your submission has been dismissed for this edition of the World Mining Congress.
              </p>
              <p style="margin:0 0 24px;">
                We appreciate your interest and the effort put into your submission. We encourage you to continue participating in future events.
              </p>
              <p style="margin:0;">
                <strong style="color:#000;">Doris Hiam-Galvez</strong><br>
                Program Chair, WMC 2026<br>
                <span style="color:#004d58; font-weight:bold;">WORLD MINING CONGRESS 2026 – WMC</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style=" background: linear-gradient(90deg, #00b3dc, #0124e0, #00023f); text-align:center; padding:18px; font-size:12px; color:#FFFFFF;">
              © ${new Date().getFullYear()} World Mining Congress. All rights reserved.<br>
              Lima, Peru
            </td>
          </tr>
        </table>
      </div>
    `;

    return this.sendMail({
      to,
      template,
      subject: '[WORLD MINING CONGRESS 26] - Technical Paper Status Update',
    })
      .then(() => {
        console.log(`Dismissal email sent to ${to}`);
      })
      .catch((error) => {
        console.error(`Error sending dismissal email to ${to}`);
        console.error(error.message);
      });
  }
}
