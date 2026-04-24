import { Router } from 'express';
import multer from 'multer';
import { uploadAndProcessPDF } from '../controllers/uploadController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('pdf'), uploadAndProcessPDF);

export default router;
