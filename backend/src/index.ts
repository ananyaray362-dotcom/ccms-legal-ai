import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload';
import caseRoutes from './routes/cases';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', uploadRoutes);
app.use('/api/cases', caseRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
