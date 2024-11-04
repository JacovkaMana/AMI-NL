import express, { Request, Response, Router } from 'express';
import cors from 'cors';
import { prisma } from './db';
import { authenticateToken } from './middleware/auth';
import characterRoutes from './routes/characters';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/characters', characterRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 