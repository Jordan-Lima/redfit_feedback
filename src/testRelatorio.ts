import { criarRelatorioSemana } from './services/criarRelatorioSemana';

async function run() {
  try {
    await criarRelatorioSemana();
    console.log('Relatório gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
  }
}

run();
