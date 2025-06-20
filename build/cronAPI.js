"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const criarRelatorioSemana_1 = require("./services/criarRelatorioSemana");
const path_1 = __importDefault(require("path"));
const enviarEmailComAnexo_1 = require("./services/enviarEmailComAnexo");
// Agenda pra rodar toda segunda-feira às 6h da manhã
node_cron_1.default.schedule('0 6 * * 1', async () => {
    try {
        console.log('Executando relatório semanal...');
        await (0, criarRelatorioSemana_1.criarRelatorioSemana)();
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
        console.log('Relatório enviado com sucesso!');
    }
    catch (error) {
        console.error('Erro ao executar o relatório semanal:', error);
    }
});
