"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarRelatorioFeedbacks = gerarRelatorioFeedbacks;
const db_1 = __importDefault(require("../db"));
async function gerarRelatorioFeedbacks(enviadoIds) {
    if (enviadoIds.length === 0) {
        return 'Nenhum usuário enviou feedback na semana passada.';
    }
    const placeholders = enviadoIds.map((_, index) => `$${index + 1}`).join(', ');
    const query = `
    SELECT enviado_id, setor, nota, comentario
    FROM public.redfit_feedback_aquarius
    WHERE enviado_id IN (${placeholders})
  `;
    const client = await db_1.default.connect();
    try {
        const result = await client.query(query, enviadoIds);
        const feedbacksPorUsuario = {};
        for (const row of result.rows) {
            if (!feedbacksPorUsuario[row.enviado_id]) {
                feedbacksPorUsuario[row.enviado_id] = [];
            }
            feedbacksPorUsuario[row.enviado_id].push(row);
        }
        let relatorio = '';
        for (const enviado_id of enviadoIds) {
            const feedbacks = feedbacksPorUsuario[enviado_id];
            if (feedbacks && feedbacks.length > 0) {
                relatorio += `user-${enviado_id}:\n`;
                for (const feedback of feedbacks) {
                    relatorio += `${feedback.setor}: ${feedback.comentario}\n`;
                }
                relatorio += `\n`;
            }
        }
        return relatorio.trim();
    }
    catch (error) {
        console.error('Erro ao gerar relatório:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
