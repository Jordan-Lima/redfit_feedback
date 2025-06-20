"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const enviarEmailComAnexo_1 = require("./services/enviarEmailComAnexo");
async function testarEnvio() {
    await (0, enviarEmailComAnexo_1.enviarEmailComAnexo)({
        to: `${process.env.SMTP_FROM}`,
        subject: 'Relatório de Avaliação REDFIT',
        text: 'Segue o PDF em anexo.',
        attachments: [
            {
                filename: '../relatorio_semanal.pdf',
                path: path_1.default.resolve('relatorio_semanal.pdf'),
            },
        ],
    });
}
testarEnvio();
