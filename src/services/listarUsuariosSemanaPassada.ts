import pool from '../db';

function getLast7DaysInterval(): { start: Date; end: Date } {
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
  const end = now;  // Agora

  return { start, end };
}

export async function listarUsuariosSemanaPassada(): Promise<string[]> {
  const { start, end } = getLast7DaysInterval();

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT DISTINCT enviado_id
       FROM public.redfit_feedback_aquarius
       WHERE criado_em BETWEEN $1 AND $2
         AND lido_em IS NULL`,
      [start.toISOString(), end.toISOString()]
    );

    return result.rows.map(row => row.enviado_id);
  } catch (error) {
    console.error('Erro ao buscar usuários da semana passada:', error);
    throw error;
  } finally {
    client.release();
  }
}
