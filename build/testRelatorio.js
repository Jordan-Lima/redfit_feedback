"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const criarRelatorioSemana_1 = require("./services/criarRelatorioSemana");
async function run() {
    try {
        await (0, criarRelatorioSemana_1.criarRelatorioSemana)();
        console.log('Relatório gerado com sucesso!');
    }
    catch (error) {
        console.error('Erro ao gerar relatório:', error);
    }
}
run();
