import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendContactEmailDto } from '../dtos/send-contact-email.dto';
import { Paper, PaperState, paperStateMap } from '../../domain/entities/paper.entity';

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

    async sendMail({
        to,
        template,
        subject,
        bcc = false,
    }) {
        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: template,
            bcc: bcc ? process.env.EMAIL_USER : undefined,
        };

        const sendMailIsActive = (process.env.SEND_MAIL_NOTIFICATIONS || 'true') === 'true';
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
        const url = `${appUrl}/en/reset-password?token=${code}`;
        const template = `
                <h1>Recupera tu contraseña</h1>
                <p>Clic <a href="${url}">aquí</a> para resetear tu contraseña</p>
            `;

        return this.sendMail({
            to,
            template,
            subject: 'Recuperación de contraseña',
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
        console.log({code});
        const url = `${appUrl}/confirmar-registro?token=${code}`;
        const template = `
                <h1>Confirmación de registro</h1>
                <p>Clic <a href="${url}">aquí</a> para su registro.</p>
            `;

        return this.sendMail({
            to,
            template,
            subject: 'Registro',
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
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                <h1 style="color: #333; text-align: center;">📩 Contacto</h1>
                <p style="font-size: 16px; color: #555;"><strong>Nombre:</strong> <span style="color: #000;">${name}</span></p>
                <p style="font-size: 16px; color: #555;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007BFF; text-decoration: none;">${email}</a></p>
                <p style="font-size: 16px; color: #555;"><strong>Teléfono:</strong> <span style="color: #000;">${phone}</span></p>
                <div style="margin-top: 15px; padding: 10px; background-color: #fff; border-left: 4px solid #007BFF;">
                    <p style="font-size: 16px; color: #555; margin: 0;"><strong>Mensaje:</strong></p>
                    <p style="font-size: 16px; color: #000; margin: 5px 0;">${message}</p>
                </div>
            </div>
        `;
        return this.sendMail({
            to: email,
            template,
            subject: 'Contacto',
            bcc: true,
        });
    }

    async sendPaperUpdateStatusEmail({ to, paper }: {
        to: string;
        paper: Paper
    }) {
        const { state, title } = paper;
        let template = `
            <h1>Actualización de estado de trabajo técnico</h1>
            <p>El estado de tu trabajo técnico <b>${title}</b> ha sido actualizado a <b>${paperStateMap[state]}</b></p>
        `;

        if (state === PaperState.RECEIVED) {
            template = `
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Estimado participante,</p>
                
                <p>Agradecemos su participación en el <strong>Premio Nacional de Minería</strong> y por medio de esta comunicación confirmamos la recepción de su resumen.</p>
                
                <p>Estaremos en contacto para darle el resultado de la evaluación.</p>
                
                <p>Por favor, cualquier consulta sírvase contactarse por <strong>WhatsApp</strong> al <a href="https://wa.me/51973855242">973855242</a>.</p>
                
                <p>Saludos cordiales,</p>
                
                <p><strong>Carolina Galarza</strong><br>
                Coordinadora Foro TIS<br>
                PERUMIN 37 Convención Minera</p>
            </body>
            `;
        }

        return this.sendMail({
            to,
            template,
            subject: 'Actualización de estado de trabajo técnico',
        })
            .then(() => {
                console.log(`Email de actualización de estado de paper enviado a ${to}`);
            })
            .catch((error) => {
                console.error(`Error sending email de actualización de estado de paper to ${to}`);
                console.error(error.message);
            });
    }
}
