-- CBR AI Discovery Assessment Tool — Security Hardening
-- Removes the permissive `USING (true)` anonymous policies created in 001.
--
-- Background:
--   The original schema granted SELECT/INSERT/UPDATE on assessments and
--   responses to the `anon` role with no row-level filter, on the assumption
--   that the application layer would validate the share token. This means
--   anyone holding the public anon API key could read/modify every row.
--
-- Fix:
--   The application's public flow (/api/assess/[token]/*) uses the
--   service-role client, which bypasses RLS entirely. Anonymous access via
--   the anon key is therefore not required at all and we drop those policies.
--   Service-role calls continue to work because RLS is bypassed for that role.
--
-- Effect:
--   * Consultant policies (auth.uid() = consultant_id) remain in place.
--   * Anonymous access via the public anon key is now denied at the DB level.
--   * The /api/assess/[token]/* routes continue to function unchanged because
--     they use the service-role client.

DROP POLICY IF EXISTS "anon_select_assessments_by_token" ON assessments;
DROP POLICY IF EXISTS "anon_update_assessments" ON assessments;
DROP POLICY IF EXISTS "anon_select_responses" ON responses;
DROP POLICY IF EXISTS "anon_insert_responses" ON responses;
DROP POLICY IF EXISTS "anon_update_responses" ON responses;

-- Belt-and-braces: explicitly revoke any direct table grants from anon
REVOKE ALL ON TABLE assessments FROM anon;
REVOKE ALL ON TABLE responses FROM anon;
