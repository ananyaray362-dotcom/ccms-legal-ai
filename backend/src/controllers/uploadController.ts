import { Request, Response } from 'express';
const pdfParse = require('pdf-parse');
import { supabase } from '../config/supabase';
import { processJudgment } from '../services/aiService';

export const uploadAndProcessPDF = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No PDF file uploaded' });
            return;
        }

        const pdfBuffer = req.file.buffer;
        const pdfData = await pdfParse(pdfBuffer);
        const text = pdfData.text;

        // Process with AI
        const extraction = await processJudgment(text);

        if (!extraction) {
             res.status(500).json({ error: 'Failed to extract information from the judgment' });
             return;
        }

        // Return extracted data for verification
        res.status(200).json({
            success: true,
            extractedTextSnippet: text.substring(0, 1000) + '...', // For context
            fullText: text, // Provide full text so UI can highlight
            data: extraction
        });

    } catch (error: any) {
        console.error('Error processing upload:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
