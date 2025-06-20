import express from 'express';
import cors from 'cors';
import feedbackRouter from './controllers/FeedbackController';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/', feedbackRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});