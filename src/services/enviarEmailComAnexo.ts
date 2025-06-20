import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    attachments?: {
        filename: string;
        path: string;
    }[];
}

export async function enviarEmailComAnexo(options: EmailOptions) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: Number(process.env.SMTP_PORT),
            secure: true, // Usando porta 465, é SSL
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `Relatório Avaliativo < ${process.env.SMTP_FROM}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            attachments: options.attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado:', info.messageId);
    } catch (error) {
        console.error('Erro ao enviar email:', error);
    }
}
