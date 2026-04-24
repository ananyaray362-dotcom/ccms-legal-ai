import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processJudgment(text: string) {
    const prompt = `
You are an expert legal AI assistant for the Court Case Monitoring System (CCMS).
Read the following court judgment text and extract the required information.
Generate a structured action plan.
If you cannot find a piece of information, use "Not explicitly stated" or "Unknown".

Extracted Text:
${text}

Respond ONLY with a valid JSON object matching this schema:
{
  "caseDetails": {
    "caseNumber": "string",
    "dateOfOrder": "YYYY-MM-DD",
    "partiesInvolved": "string",
    "keyDirections": "string",
    "relevantTimelines": "string"
  },
  "actionPlan": {
    "complianceRequirements": "string",
    "appealConsideration": "string",
    "actionTimelines": "string",
    "responsibleDepartment": "string",
    "natureOfAction": "string"
  }
}
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        if (response.text) {
             return JSON.parse(response.text);
        }
        return null;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}
