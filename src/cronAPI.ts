import cron from 'node-cron';
import { criarRelatorioSemana } from './services/criarRelatorioSemana';
import path from 'path';
import { enviarEmailComAnexo } from './services/enviarEmailComAnexo';

// Agenda pra rodar toda segunda-feira às 6h da manhã
cron.schedule('0 6 * * 1', async () => {
  try {
    console.log('Executando relatório semanal...');
    await criarRelatorioSemana();
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
    console.log('Relatório enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao executar o relatório semanal:', error);
  }
});
