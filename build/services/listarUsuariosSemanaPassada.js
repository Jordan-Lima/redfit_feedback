"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarUsuariosSemanaPassada = listarUsuariosSemanaPassada;
const db_1 = __importDefault(require("../db"));
function getLast7DaysInterval() {
    // const today = new Date();
    // const start = new Date(today);
    // start.setDate(today.getDate() - 7);
    // start.setHours(0, 0, 0, 0);
    // const end = new Date(today);
    // end.setDate(today.getDate() - 1);
    // end.setHours(23, 59, 59, 999);
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    start.setDate(now.getDate() - 7);
    const end = now; // Agora
    return { start, end };
}
async function listarUsuariosSemanaPassada() {
    const { start, end } = getLast7DaysInterval();
    const client = await db_1.default.connect();
    try {
        const result = await client.query(`SELECT DISTINCT enviado_id
       FROM public.redfit_feedback_aquarius
       WHERE criado_em BETWEEN $1 AND $2
         AND lido_em IS NULL`, [start.toISOString(), end.toISOString()]);
        return result.rows.map(row => row.enviado_id);
    }
    catch (error) {
        console.error('Erro ao buscar usuários da semana passada:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
