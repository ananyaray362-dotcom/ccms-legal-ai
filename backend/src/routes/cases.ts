import { Router } from 'express';
import { saveVerifiedCase, getVerifiedCases } from '../controllers/caseController';

const router = Router();

router.post('/verify', saveVerifiedCase);
router.get('/', getVerifiedCases);

export default router;
