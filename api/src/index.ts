import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config';
import userRoutes from './routes/user';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/user', userRoutes); // ✅ AQUI: userRoutes deve ser o `router` exportado

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
