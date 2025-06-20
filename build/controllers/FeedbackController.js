"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const avaliacoes = req.body;
    if (!Array.isArray(avaliacoes)) {
        return res.status(400).json({ error: 'Formato inválido' });
    }
    const enviado_id = (0, uuid_1.v4)(); // Gera o UUID no backend por requisição
    const client = await db_1.default.connect();
    try {
        await client.query('BEGIN');
        for (const avaliacao of avaliacoes) {
            const { setor, nota, comentario } = avaliacao;
            await client.query('INSERT INTO public.redfit_feedback_aquarius (enviado_id, setor, nota, comentario) VALUES ($1, $2, $3, $4)', [enviado_id, setor, nota, comentario]);
        }
        await client.query('COMMIT');
        res.status(201).json({ message: 'Feedback salvo com sucesso', enviado_id });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar o feedback' });
    }
    finally {
        client.release();
    }
});
exports.default = router;
