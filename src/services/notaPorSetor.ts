import pool from "../db";

interface NotaPorSetor {
  setor: string;
  media_nota: number;
  quantidade: number;
}

export async function gerarDadosGrafico(enviadoIds: string[]): Promise<NotaPorSetor[]> {
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

  const client = await pool.connect();

  try {
    const result = await client.query<NotaPorSetor>(query, enviadoIds);
    return result.rows;
  } catch (error) {
    console.error('Erro ao gerar dados do gráfico:', error);
    throw error;
  } finally {
    client.release();
  }
}
