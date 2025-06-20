"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarDadosGrafico = gerarDadosGrafico;
const db_1 = __importDefault(require("../db"));
async function gerarDadosGrafico(enviadoIds) {
    if (enviadoIds.length === 0) {
        return [];
    }
    const placeholders = enviadoIds.map((_, index) => `$${index + 1}`).join(', ');
    const query = `
    SELECT
      setor,
      AVG(nota)::numeric(10,2) AS media_nota,
      COUNT(*) AS quantidade
    FROM public.redfit_feedback_aquarius
    WHERE enviado_id IN (${placeholders})
      AND nota IS NOT NULL
    GROUP BY setor
    ORDER BY setor;
  `;
    const client = await db_1.default.connect();
    try {
        const result = await client.query(query, enviadoIds);
        return result.rows;
    }
    catch (error) {
        console.error('Erro ao gerar dados do gráfico:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
