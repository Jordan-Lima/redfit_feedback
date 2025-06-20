import path from 'path';
import { enviarEmailComAnexo } from './services/enviarEmailComAnexo';

async function testarEnvio() {
    await enviarEmailComAnexo({
       to: `${process.env.SMTP_FROM}`,
        subject: 'Relatório de Avaliação REDFIT',
        text: 'Segue o PDF em anexo.',
        attachments: [
            {
                filename: '../relatorio_semanal.pdf',
                path: path.resolve('relatorio_semanal.pdf'),
            },
        ],
    });
}

testarEnvio();
