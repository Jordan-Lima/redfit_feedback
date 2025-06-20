"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarEmailComAnexo = enviarEmailComAnexo;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function enviarEmailComAnexo(options) {
    try {
        const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (error) {
        console.error('Erro ao enviar email:', error);
    }
}
