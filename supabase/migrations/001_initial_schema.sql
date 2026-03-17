-- CBR AI Discovery Assessment Tool — Initial Schema
-- Version: 2.0

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Table: assessments
-- ============================================================
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text,
  company_name text,
  industry text,
  status text NOT NULL DEFAULT 'draft',
  share_token text UNIQUE NOT NULL,
  token_expires_at timestamptz NOT NULL,
  current_stage integer NOT NULL DEFAULT 0,
  ai_readiness_score jsonb,
  stage_6_data jsonb,
  stage_7_data jsonb,
  consent_given_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_assessments_consultant_id ON assessments(consultant_id);
CREATE INDEX idx_assessments_status ON assessments(status);
-- share_token already has a UNIQUE index

-- ============================================================
-- Table: responses
-- ============================================================
CREATE TABLE responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  stage text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, stage)
);

CREATE INDEX idx_responses_assessment_id ON responses(assessment_id);

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER responses_updated_at
  BEFORE UPDATE ON responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Consultants: full access to own assessments
CREATE POLICY "consultants_select_own_assessments" ON assessments
  FOR SELECT USING (consultant_id = auth.uid());

CREATE POLICY "consultants_insert_own_assessments" ON assessments
  FOR INSERT WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "consultants_update_own_assessments" ON assessments
  FOR UPDATE USING (consultant_id = auth.uid());

CREATE POLICY "consultants_delete_own_assessments" ON assessments
  FOR DELETE USING (consultant_id = auth.uid());

-- Anonymous clients: read assessments by token (for lookup)
CREATE POLICY "anon_select_assessments_by_token" ON assessments
  FOR SELECT TO anon
  USING (true);

-- Anonymous clients: update assessment status/stage (via app validation)
CREATE POLICY "anon_update_assessments" ON assessments
  FOR UPDATE TO anon
  USING (true);

-- Consultants: full access to responses for own assessments
CREATE POLICY "consultants_select_own_responses" ON responses
  FOR SELECT USING (
    assessment_id IN (SELECT id FROM assessments WHERE consultant_id = auth.uid())
  );

CREATE POLICY "consultants_insert_own_responses" ON responses
  FOR INSERT WITH CHECK (
    assessment_id IN (SELECT id FROM assessments WHERE consultant_id = auth.uid())
  );

CREATE POLICY "consultants_update_own_responses" ON responses
  FOR UPDATE USING (
    assessment_id IN (SELECT id FROM assessments WHERE consultant_id = auth.uid())
  );

CREATE POLICY "consultants_delete_own_responses" ON responses
  FOR DELETE USING (
    assessment_id IN (SELECT id FROM assessments WHERE consultant_id = auth.uid())
  );

-- Anonymous clients: read, insert, update responses (app validates token)
CREATE POLICY "anon_select_responses" ON responses
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "anon_insert_responses" ON responses
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "anon_update_responses" ON responses
  FOR UPDATE TO anon
  USING (true);
