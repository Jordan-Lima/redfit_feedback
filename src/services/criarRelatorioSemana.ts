import { listarUsuariosSemanaPassada } from './listarUsuariosSemanaPassada';
import { gerarRelatorioFeedbacks } from './gerarRelatorioFeedbacks';
import { gerarDadosGrafico } from './notaPorSetor';
import { gerarPDFRelatorio } from './gerarPDFRelatorio';

export async function criarRelatorioSemana() {
  try {
    const usuarios = await listarUsuariosSemanaPassada();
    if (usuarios.length === 0) {
      console.log('Nenhum feedback na semana passada.');
      return;
    }

    const textoRelatorio = await gerarRelatorioFeedbacks(usuarios);
    const dadosGrafico = await gerarDadosGrafico(usuarios);

    await gerarPDFRelatorio(textoRelatorio, dadosGrafico, './relatorio_semanal.pdf');

    console.log('Relatório semanal gerado com sucesso em ./relatorio_semanal.pdf');
  } catch (error) {
    console.error('Erro ao criar relatório semanal:', error);
  }
}
