"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarRelatorioSemana = criarRelatorioSemana;
const listarUsuariosSemanaPassada_1 = require("./listarUsuariosSemanaPassada");
const gerarRelatorioFeedbacks_1 = require("./gerarRelatorioFeedbacks");
const notaPorSetor_1 = require("./notaPorSetor");
const gerarPDFRelatorio_1 = require("./gerarPDFRelatorio");
async function criarRelatorioSemana() {
    try {
        const usuarios = await (0, listarUsuariosSemanaPassada_1.listarUsuariosSemanaPassada)();
        if (usuarios.length === 0) {
            console.log('Nenhum feedback na semana passada.');
            return;
        }
        const textoRelatorio = await (0, gerarRelatorioFeedbacks_1.gerarRelatorioFeedbacks)(usuarios);
        const dadosGrafico = await (0, notaPorSetor_1.gerarDadosGrafico)(usuarios);
        await (0, gerarPDFRelatorio_1.gerarPDFRelatorio)(textoRelatorio, dadosGrafico, './relatorio_semanal.pdf');
        console.log('Relatório semanal gerado com sucesso em ./relatorio_semanal.pdf');
    }
    catch (error) {
        console.error('Erro ao criar relatório semanal:', error);
    }
}
