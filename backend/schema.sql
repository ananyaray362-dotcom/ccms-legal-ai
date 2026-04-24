-- Supabase Schema for CCMS Legal AI System

-- Enable uuid-ossp extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for storing uploaded court cases and their extracted text
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_name TEXT NOT NULL,
    pdf_text TEXT,
    status TEXT DEFAULT 'pending_extraction', -- pending_extraction, extracted, verified, rejected
    user_id UUID REFERENCES auth.users(id) -- Assuming integration with Supabase Auth
);

-- Table for storing extracted information and generated action plans
CREATE TABLE IF NOT EXISTS action_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Extracted Case Details
    case_number TEXT,
    date_of_order DATE,
    parties_involved TEXT,
    key_directions TEXT,
    relevant_timelines TEXT,

    -- Generated Action Plan
    compliance_requirements TEXT,
    appeal_consideration TEXT,
    action_timelines TEXT,
    responsible_department TEXT,
    nature_of_action TEXT,
    
    -- Human Verification Meta
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Function to automatically update 'updated_at' column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for 'action_plans' table
CREATE TRIGGER update_action_plans_modtime
    BEFORE UPDATE ON action_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Row Level Security (RLS) policies (Optional, can be customized based on requirements)
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert and select cases
CREATE POLICY "Allow authenticated users to insert cases" ON cases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to view cases" ON cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to update cases" ON cases FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users to manage action plans
CREATE POLICY "Allow authenticated users to insert action plans" ON action_plans FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to view action plans" ON action_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to update action plans" ON action_plans FOR UPDATE TO authenticated USING (true);
