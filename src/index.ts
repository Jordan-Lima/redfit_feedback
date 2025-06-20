import express from 'express';
import cors from 'cors';
import feedbackRouter from './controllers/FeedbackController';

// Importa o arquivo cronAPI para iniciar o cron job
import './cronAPI';

const app = express();
const PORT = process.env.PORT || 80;

const corsOptions = {
  origin: 'https://feedback-redfit.web.app',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', feedbackRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
