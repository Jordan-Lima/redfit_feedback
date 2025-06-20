import express, { Request, Response } from 'express';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const avaliacoes = req.body;

  if (!Array.isArray(avaliacoes)) {
    return res.status(400).json({ error: 'Formato inválido' });
  }

  const enviado_id = uuidv4();  // Gera o UUID no backend por requisição

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const avaliacao of avaliacoes) {
      const { setor, nota, comentario } = avaliacao;
      await client.query(
        'INSERT INTO public.redfit_feedback_aquarius (enviado_id, setor, nota, comentario) VALUES ($1, $2, $3, $4)',
        [enviado_id, setor, nota, comentario]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Feedback salvo com sucesso', enviado_id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar o feedback' });
  } finally {
    client.release();
  }
});

export default router;
