import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const saveVerifiedCase = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileName, pdfText, caseDetails, actionPlan } = req.body;
        
        // 1. Save to `cases` table
        const { data: caseData, error: caseError } = await supabase
            .from('cases')
            .insert([
                { file_name: fileName, pdf_text: pdfText, status: 'verified' }
            ])
            .select()
            .single();

        if (caseError) throw caseError;

        // 2. Save to `action_plans` table
        const { data: planData, error: planError } = await supabase
            .from('action_plans')
            .insert([
                {
                    case_id: caseData.id,
                    case_number: caseDetails.caseNumber,
                    date_of_order: caseDetails.dateOfOrder,
                    parties_involved: caseDetails.partiesInvolved,
                    key_directions: caseDetails.keyDirections,
                    relevant_timelines: caseDetails.relevantTimelines,
                    compliance_requirements: actionPlan.complianceRequirements,
                    appeal_consideration: actionPlan.appealConsideration,
                    action_timelines: actionPlan.actionTimelines,
                    responsible_department: actionPlan.responsibleDepartment,
                    nature_of_action: actionPlan.natureOfAction,
                    is_verified: true,
                    verified_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (planError) throw planError;

        res.status(201).json({ success: true, caseId: caseData.id });
    } catch (error: any) {
        console.error('Error saving verified case:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

export const getVerifiedCases = async (req: Request, res: Response): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('action_plans')
            .select(`
                *,
                cases (file_name, status)
            `)
            .eq('is_verified', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error: any) {
         console.error('Error fetching cases:', error);
         res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
