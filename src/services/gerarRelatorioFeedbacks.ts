import pool from '../db';

interface Feedback {
  enviado_id: string;
  setor: string;
  nota: number;
  comentario: string;
}

export async function gerarRelatorioFeedbacks(enviadoIds: string[]): Promise<string> {
  if (enviadoIds.length === 0) {
    return 'Nenhum usuário enviou feedback na semana passada.';
  }

  const placeholders = enviadoIds.map((_, index) => `$${index + 1}`).join(', ');

  const query = `
    SELECT enviado_id, setor, nota, comentario
    FROM public.redfit_feedback_aquarius
    WHERE enviado_id IN (${placeholders})
  `;

  const client = await pool.connect();

  try {
    const result = await client.query<Feedback>(query, enviadoIds);

    const feedbacksPorUsuario: Record<string, Feedback[]> = {};

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
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw error;
  } finally {
    client.release();
  }
}
