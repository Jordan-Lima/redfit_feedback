"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarPDFRelatorio = gerarPDFRelatorio;
const pdfkit_1 = __importDefault(require("pdfkit"));
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function gerarPDFRelatorio(textoRelatorio, dadosGrafico, outputPath) {
    const width = 600;
    const height = 400;
    const chartJSNodeCanvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({ width, height });
    const labels = dadosGrafico.map(d => d.setor);
    const data = dadosGrafico.map(d => d.media_nota);
    const colors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
    ];
    const configuration = {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Média das Notas por Setor',
                    data,
                    backgroundColor: colors.slice(0, dadosGrafico.length),
                    borderColor: colors
                        .slice(0, dadosGrafico.length)
                        .map(c => c.replace('0.6', '1')),
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                },
            },
        },
    };
    // Renderiza gráfico em buffer
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    // Carrega imagem da marca d'água (arquivo estático)
    const watermarkPath = path_1.default.resolve('public/redfit.png');
    const watermarkImage = fs_1.default.readFileSync(watermarkPath);
    const doc = new pdfkit_1.default({ margin: 40, size: 'A4' });
    const writeStream = fs_1.default.createWriteStream(outputPath);
    doc.pipe(writeStream);
    // --- MARCA D'ÁGUA ---
    // Tamanho da página em pt (A4 padrão: 595 x 842)
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    // Define tamanho para a marca d'água
    const watermarkWidth = 300;
    const watermarkHeight = 300;
    // Salva estado, aplica opacidade, desenha a imagem e restaura
    doc.save();
    doc.opacity(0.12); // Opacidade baixa para marca d'água
    doc.image(watermarkImage, (pageWidth - watermarkWidth) / 2, (pageHeight - watermarkHeight) / 2, {
        width: watermarkWidth,
        height: watermarkHeight,
        align: 'center',
        valign: 'center',
    });
    doc.restore();
    // --- CONTEÚDO NORMAL ---
    // Título principal
    doc.fontSize(20).text('Relatório Semanal de Feedback', { align: 'center' });
    doc.moveDown();
    // Insere o gráfico normal embaixo
    doc.image(imageBuffer, { align: 'center', fit: [500, 300] });
    doc.moveDown();
    // Título da seção de comentários
    doc.fontSize(16).text('Comentários Gerais:', { underline: true });
    doc.moveDown(0.5);
    // Texto dos comentários
    doc.fontSize(12).text(textoRelatorio, { align: 'left' });
    doc.end();
    return new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
}
