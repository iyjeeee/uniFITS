-- =============================================================================
-- uniFITS schema v2.1 — self-checking tests.
-- Usage (empty database):  psql -d <db> -f schema.sql && psql -d <db> -f schema.tests.sql
-- Prints one row per check (PASS/FAIL) and a final summary. Everything is rolled back at the end.
-- =============================================================================
\set ON_ERROR_STOP on
BEGIN;
\o /dev/null
CREATE TEMP TABLE results (n SERIAL, label TEXT, ok BOOLEAN);

-- expect_fail(sql, label): PASS when the statement raises an error
CREATE FUNCTION pg_temp.expect_fail(p_sql TEXT, p_label TEXT) RETURNS VOID AS $$
BEGIN
    BEGIN EXECUTE p_sql; INSERT INTO results (label, ok) VALUES (p_label, FALSE);
    EXCEPTION WHEN OTHERS THEN INSERT INTO results (label, ok) VALUES (p_label, TRUE); END;
END; $$ LANGUAGE plpgsql;

-- expect_ok(sql, label): PASS when the statement succeeds
CREATE FUNCTION pg_temp.expect_ok(p_sql TEXT, p_label TEXT) RETURNS VOID AS $$
BEGIN
    BEGIN EXECUTE p_sql; INSERT INTO results (label, ok) VALUES (p_label, TRUE);
    EXCEPTION WHEN OTHERS THEN INSERT INTO results (label, ok) VALUES (p_label || ' -> ' || SQLERRM, FALSE); END;
END; $$ LANGUAGE plpgsql;

-- expect_eq(actual, expected, label)
CREATE FUNCTION pg_temp.expect_eq(p_actual TEXT, p_expected TEXT, p_label TEXT) RETURNS VOID AS $$
BEGIN INSERT INTO results (label, ok) VALUES (p_label || ' [got ' || COALESCE(p_actual,'NULL') || ', want ' || p_expected || ']', p_actual IS NOT DISTINCT FROM p_expected); END;
$$ LANGUAGE plpgsql;

-- ---------- fixtures: two organizations, role-holders in org A ----------
INSERT INTO organizations (id, name, slug) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Org A', 'org-a'),
    ('b0000000-0000-0000-0000-000000000001', 'Org B', 'org-b');
SELECT seed_org_defaults('a0000000-0000-0000-0000-000000000001');
SELECT seed_org_defaults('b0000000-0000-0000-0000-000000000001');

CREATE FUNCTION pg_temp.mk_user(p_id UUID, p_org UUID, p_n TEXT) RETURNS VOID AS $$
BEGIN INSERT INTO users (id, org_id, employee_number, first_name, last_name, date_of_birth, gender, contact_number, email, username, password_hash)
      VALUES (p_id, p_org, 'E-' || p_n, p_n, 'User', '2000-01-01', 'F', '0900', p_n || '@x.test', p_n, 'h'); END; $$ LANGUAGE plpgsql;

CREATE FUNCTION pg_temp.give_role(p_user UUID, p_org UUID, p_role TEXT) RETURNS VOID AS $$
BEGIN INSERT INTO user_roles (org_id, user_id, role_id, assigned_by)
      SELECT p_org, p_user, r.id, p_user FROM roles r WHERE r.org_id = p_org AND r.name = p_role; END; $$ LANGUAGE plpgsql;

SELECT pg_temp.mk_user('a1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'admin');
SELECT pg_temp.mk_user('a1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'treasurer');
SELECT pg_temp.mk_user('a1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'secretary');
SELECT pg_temp.mk_user('a1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'member');
SELECT pg_temp.mk_user('b1000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'bobadmin');
SELECT pg_temp.give_role('a1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Admin');
SELECT pg_temp.give_role('a1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Treasurer');
SELECT pg_temp.give_role('a1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Secretary');
SELECT pg_temp.give_role('a1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Member');

INSERT INTO funds (id, org_id, name, fund_type, created_by) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'General', 'internal', 'a1000000-0000-0000-0000-000000000001');
-- Project A / Event A are APPROVED (money and attendance need an approved activity); 'Pending' ones exist for the review tests
INSERT INTO projects (id, org_id, title, start_date, created_by, approval_status, reviewed_by, reviewed_at) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Project A', '2025-01-01', 'a1000000-0000-0000-0000-000000000001', 'approved', 'a1000000-0000-0000-0000-000000000001', NOW());
INSERT INTO events (id, org_id, title, event_date, created_by, approval_status, reviewed_by, reviewed_at) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Event A', '2025-02-01', 'a1000000-0000-0000-0000-000000000001', 'approved', 'a1000000-0000-0000-0000-000000000001', NOW());
INSERT INTO projects (id, org_id, title, start_date, created_by) VALUES
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Pending Project', '2025-06-01', 'a1000000-0000-0000-0000-000000000001');
INSERT INTO events (id, org_id, title, event_date, created_by) VALUES
    ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Pending Event', '2025-06-02', 'a1000000-0000-0000-0000-000000000001');

-- ---------- 1. tenant isolation ----------
SELECT pg_temp.expect_fail($q$INSERT INTO funds (org_id, name, fund_type, created_by) VALUES ('b0000000-0000-0000-0000-000000000001','X','internal','a1000000-0000-0000-0000-000000000001')$q$,
    'T1a org B fund created by an org A user is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, project_id, transaction_date, created_by) VALUES ('b0000000-0000-0000-0000-000000000001','expense',10,'project','c0000000-0000-0000-0000-000000000001','2025-01-01','b1000000-0000-0000-0000-000000000001')$q$,
    'T1b org B transaction pointing at an org A project is rejected');

-- ---------- 2. soft delete + unique ----------
SELECT pg_temp.expect_fail($q$INSERT INTO users (org_id, employee_number, first_name, last_name, date_of_birth, gender, contact_number, email, username, password_hash) VALUES ('a0000000-0000-0000-0000-000000000001','E-dup','D','D','2000-01-01','F','1','MEMBER@x.test','dup','h')$q$,
    'T2a duplicate email (different case) among live users is rejected');
UPDATE users SET deleted_at = NOW() WHERE username = 'member';
SELECT pg_temp.expect_ok($q$INSERT INTO users (org_id, employee_number, first_name, last_name, date_of_birth, gender, contact_number, email, username, password_hash) VALUES ('a0000000-0000-0000-0000-000000000001','E-new','N','N','2000-01-01','F','1','member@x.test','member','h')$q$,
    'T2b email/username/number of a soft-deleted user can be reused');

-- ---------- 3. one active role ----------
SELECT pg_temp.expect_fail($q$INSERT INTO user_roles (org_id, user_id, role_id, assigned_by) SELECT org_id, 'a1000000-0000-0000-0000-000000000002', id, 'a1000000-0000-0000-0000-000000000001' FROM roles WHERE org_id='a0000000-0000-0000-0000-000000000001' AND name='Auditor'$q$,
    'T3a a second active role for the same user is rejected');
SELECT pg_temp.expect_fail($q$UPDATE user_roles SET removed_at = NOW() WHERE user_id = 'a1000000-0000-0000-0000-000000000002'$q$,
    'T3b is_active must match removed_at');

-- ---------- 4. transaction context ----------
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, project_id, event_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','expense',10,'project','c0000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000001','2025-01-01','a1000000-0000-0000-0000-000000000001')$q$,
    'T4a project AND event on one transaction is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','expense',10,'project','2025-01-01','a1000000-0000-0000-0000-000000000001')$q$,
    'T4b category project without project_id is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, fund_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','contribution',10,'fund','f0000000-0000-0000-0000-000000000001','2025-01-01','a1000000-0000-0000-0000-000000000001')$q$,
    'T4c contribution without a member is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, fund_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','income',0,'fund','f0000000-0000-0000-0000-000000000001','2025-01-01','a1000000-0000-0000-0000-000000000001')$q$,
    'T4d amount 0 is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, project_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','opening_balance',10,'project','c0000000-0000-0000-0000-000000000001','2025-01-01','a1000000-0000-0000-0000-000000000001')$q$,
    'T4e opening_balance outside a fund is rejected');

-- ---------- 5. attendance ----------
INSERT INTO attendances (org_id, user_id, activity_type, project_id, attendance_date, status, recorded_by)
VALUES ('a0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','project','c0000000-0000-0000-0000-000000000001','2025-01-02','present','a1000000-0000-0000-0000-000000000001');
SELECT pg_temp.expect_fail($q$INSERT INTO attendances (org_id, user_id, activity_type, project_id, attendance_date, status, recorded_by) VALUES ('a0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','project','c0000000-0000-0000-0000-000000000001','2025-01-02','absent','a1000000-0000-0000-0000-000000000001')$q$,
    'T5a same person + activity + date twice is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO attendances (org_id, user_id, activity_type, attendance_date, status, recorded_by) VALUES ('a0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','project','2025-01-03','present','a1000000-0000-0000-0000-000000000001')$q$,
    'T5b attendance with neither project nor event is rejected');

-- ---------- 6. review / self-approval rules ----------
-- Treasurer (a..02) records a transaction, Admin (a..01) records one, Secretary (a..03) records a project
INSERT INTO transactions (id, org_id, entry_type, amount, category, fund_id, transaction_date, created_by)
VALUES ('d0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','income',1000,'fund','f0000000-0000-0000-0000-000000000001','2025-03-01','a1000000-0000-0000-0000-000000000002'),
       ('d0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','income',500,'fund','f0000000-0000-0000-0000-000000000001','2025-03-02','a1000000-0000-0000-0000-000000000001');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000002', reviewed_at=NOW() WHERE id='d0000000-0000-0000-0000-000000000001'$q$,
    'T6a Treasurer cannot approve their OWN transaction');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d0000000-0000-0000-0000-000000000001'$q$,
    'T6b Admin can approve the Treasurer''s transaction');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000002', reviewed_at=NOW() WHERE id='d0000000-0000-0000-0000-000000000002'$q$,
    'T6c Treasurer can approve someone else''s transaction');
INSERT INTO transactions (id, org_id, entry_type, amount, category, fund_id, transaction_date, created_by)
VALUES ('d0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','income',50,'fund','f0000000-0000-0000-0000-000000000001','2025-03-03','a1000000-0000-0000-0000-000000000001');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d0000000-0000-0000-0000-000000000003'$q$,
    'T6d Admin can approve their OWN transaction');
INSERT INTO projects (id, org_id, title, start_date, created_by) VALUES ('c0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','Sec project','2025-05-01','a1000000-0000-0000-0000-000000000003');
SELECT pg_temp.expect_ok($q$UPDATE projects SET approval_status='approved', reviewed_by='a1000000-0000-0000-0000-000000000003', reviewed_at=NOW() WHERE id='c0000000-0000-0000-0000-000000000002'$q$,
    'T6e Secretary can approve their OWN project');
SELECT pg_temp.expect_fail($q$UPDATE events SET approval_status='approved', reviewed_by='a1000000-0000-0000-0000-000000000002', reviewed_at=NOW() WHERE id='e0000000-0000-0000-0000-000000000002'$q$,
    'T6f Treasurer has no approve_event permission');
SELECT pg_temp.expect_fail($q$UPDATE events SET approval_status='approved' WHERE id='e0000000-0000-0000-0000-000000000002'$q$,
    'T6g approved without reviewer is rejected');
SELECT pg_temp.expect_fail($q$UPDATE projects SET approval_status='rejected' WHERE id='c0000000-0000-0000-0000-000000000003'$q$,
    'T6h rejected without reviewer is rejected');

-- ---------- 7. derived numbers (only approved count) ----------
INSERT INTO transactions (org_id, entry_type, amount, category, fund_id, transaction_date, created_by, status, voided_by, voided_at)
VALUES ('a0000000-0000-0000-0000-000000000001','income',9999,'fund','f0000000-0000-0000-0000-000000000001','2025-03-04','a1000000-0000-0000-0000-000000000002','voided','a1000000-0000-0000-0000-000000000001',NOW());
-- General fund so far: +1000 +500 +50 approved = 1550. Add pending, rejected, voided, refund, opening balance.
INSERT INTO transactions (org_id, entry_type, amount, category, fund_id, transaction_date, created_by, status, reviewed_by, reviewed_at) VALUES
    ('a0000000-0000-0000-0000-000000000001','income',9999,'fund','f0000000-0000-0000-0000-000000000001','2025-03-04','a1000000-0000-0000-0000-000000000002','pending',NULL,NULL),
    ('a0000000-0000-0000-0000-000000000001','income',9999,'fund','f0000000-0000-0000-0000-000000000001','2025-03-04','a1000000-0000-0000-0000-000000000002','rejected','a1000000-0000-0000-0000-000000000001',NOW()),
    ('a0000000-0000-0000-0000-000000000001','refund',150,'fund','f0000000-0000-0000-0000-000000000001','2025-03-05','a1000000-0000-0000-0000-000000000002','approved','a1000000-0000-0000-0000-000000000001',NOW()),
    ('a0000000-0000-0000-0000-000000000001','opening_balance',2000,'fund','f0000000-0000-0000-0000-000000000001','2025-01-01','a1000000-0000-0000-0000-000000000001','approved','a1000000-0000-0000-0000-000000000001',NOW());
SELECT pg_temp.expect_eq((SELECT balance::TEXT FROM fund_balances WHERE fund_id='f0000000-0000-0000-0000-000000000001'), '3400.00', 'T7a fund balance counts approved only (1550 - 150 + 2000)');

-- project: contribution 300 (approved) + expense 100 (approved) + expense 77 (pending)
INSERT INTO transactions (org_id, entry_type, amount, category, project_id, user_id, transaction_date, created_by, status, reviewed_by, reviewed_at) VALUES
    ('a0000000-0000-0000-0000-000000000001','contribution',300,'project','c0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','2025-03-06','a1000000-0000-0000-0000-000000000002','approved','a1000000-0000-0000-0000-000000000001',NOW()),
    ('a0000000-0000-0000-0000-000000000001','expense',100,'project','c0000000-0000-0000-0000-000000000001',NULL,'2025-03-07','a1000000-0000-0000-0000-000000000002','approved','a1000000-0000-0000-0000-000000000001',NOW());
INSERT INTO transactions (org_id, entry_type, amount, category, project_id, transaction_date, created_by) VALUES
    ('a0000000-0000-0000-0000-000000000001','expense',77,'project','c0000000-0000-0000-0000-000000000001','2025-03-08','a1000000-0000-0000-0000-000000000002');
SELECT pg_temp.expect_eq((SELECT contributions::TEXT || '/' || expenses::TEXT || '/' || net_balance::TEXT FROM project_financials WHERE project_id='c0000000-0000-0000-0000-000000000001'),
    '300.00/100.00/200.00', 'T7b project financials are per project and approved-only');
SELECT pg_temp.expect_eq((SELECT net_balance::TEXT FROM project_financials WHERE project_id='c0000000-0000-0000-0000-000000000002'), '0', 'T7c another project is not affected (bug B-47 class)');

-- utility: bill 1000, approved payment 400 -> partial; + 600 -> paid; pending payment not counted
INSERT INTO utilities (id, org_id, expense_type, total_amount, due_date, created_by) VALUES ('90000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Electricity',1000,'2025-03-20','a1000000-0000-0000-0000-000000000002');
SELECT pg_temp.expect_eq((SELECT status FROM utility_balances WHERE utility_id='90000000-0000-0000-0000-000000000001'), 'unpaid', 'T7d utility with no payment is unpaid');
INSERT INTO transactions (org_id, entry_type, amount, category, utility_id, transaction_date, created_by, status, reviewed_by, reviewed_at) VALUES
    ('a0000000-0000-0000-0000-000000000001','expense',400,'utility','90000000-0000-0000-0000-000000000001','2025-03-21','a1000000-0000-0000-0000-000000000002','approved','a1000000-0000-0000-0000-000000000001',NOW());
INSERT INTO transactions (org_id, entry_type, amount, category, utility_id, transaction_date, created_by) VALUES
    ('a0000000-0000-0000-0000-000000000001','expense',600,'utility','90000000-0000-0000-0000-000000000001','2025-03-22','a1000000-0000-0000-0000-000000000002');
SELECT pg_temp.expect_eq((SELECT status || ':' || amount_paid::TEXT FROM utility_balances WHERE utility_id='90000000-0000-0000-0000-000000000001'), 'partial:400.00', 'T7e pending payment is not counted -> partial');
UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE utility_id='90000000-0000-0000-0000-000000000001' AND status='pending';
SELECT pg_temp.expect_eq((SELECT status || ':' || amount_paid::TEXT FROM utility_balances WHERE utility_id='90000000-0000-0000-0000-000000000001'), 'paid:1000.00', 'T7f approved payments complete the bill -> paid');
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, utility_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','income',5,'utility','90000000-0000-0000-0000-000000000001','2025-03-22','a1000000-0000-0000-0000-000000000002')$q$,
    'T7g income against a utility bill is rejected');

-- ---------- 8. reference numbers ----------
SELECT pg_temp.expect_eq((SELECT (reference_number ~ '^TXN-20250301-[0-9]{6}$')::TEXT FROM transactions WHERE id='d0000000-0000-0000-0000-000000000001'), 'true', 'T8a reference number is generated (TXN-YYYYMMDD-NNNNNN)');
SELECT pg_temp.expect_eq((SELECT (COUNT(*) = COUNT(DISTINCT reference_number))::TEXT FROM transactions), 'true', 'T8b reference numbers are unique');

-- ---------- 9. funds ----------
SELECT pg_temp.expect_fail($q$INSERT INTO funds (org_id, name, fund_type, is_required, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','Req','internal',TRUE,'a1000000-0000-0000-0000-000000000001')$q$,
    'T9a required fund without frequency/fee is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO funds (org_id, name, fund_type, annual_fee, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','Opt','internal',100,'a1000000-0000-0000-0000-000000000001')$q$,
    'T9b optional fund with a fee is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO funds (org_id, name, fund_type, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','GENERAL','internal','a1000000-0000-0000-0000-000000000001')$q$,
    'T9c duplicate fund name (different case) is rejected');

-- ---------- 10. seed_org_defaults ----------
SELECT pg_temp.expect_eq((SELECT COUNT(*)::TEXT FROM roles WHERE org_id='a0000000-0000-0000-0000-000000000001'), '5', 'T10a five default roles');
SELECT pg_temp.expect_eq((SELECT COUNT(*)::TEXT FROM role_permissions rp JOIN roles r ON r.id=rp.role_id WHERE r.org_id='a0000000-0000-0000-0000-000000000001' AND r.name='Admin'), '37', 'T10b Admin has all 37 permissions');
SELECT pg_temp.expect_eq((SELECT has_permission('a1000000-0000-0000-0000-000000000002','approve_own_entries')::TEXT), 'false', 'T10c Treasurer lacks approve_own_entries');
SELECT pg_temp.expect_eq((SELECT has_permission('a1000000-0000-0000-0000-000000000003','approve_own_entries')::TEXT), 'true', 'T10d Secretary has approve_own_entries');
SELECT pg_temp.expect_ok($q$SELECT seed_org_defaults('a0000000-0000-0000-0000-000000000001')$q$, 'T10e seed_org_defaults is safe to run twice');


-- ---------- 11. ledger immutability: approved entries cannot be tampered with ----------
INSERT INTO funds (id, org_id, name, fund_type, created_by) VALUES ('f0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','Reserve','internal','a1000000-0000-0000-0000-000000000001');
INSERT INTO transactions (id, org_id, entry_type, amount, category, fund_id, transaction_date, created_by, status, reviewed_by, reviewed_at)
VALUES ('d1000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','opening_balance',1000,'fund','f0000000-0000-0000-0000-000000000002','2025-01-01','a1000000-0000-0000-0000-000000000001','approved','a1000000-0000-0000-0000-000000000001',NOW()),
       ('d1000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','income',500,'fund','f0000000-0000-0000-0000-000000000002','2025-01-02','a1000000-0000-0000-0000-000000000001','approved','a1000000-0000-0000-0000-000000000001',NOW());
SELECT pg_temp.expect_fail($q$UPDATE transactions SET amount = 1 WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11a changing the amount of an approved entry is rejected');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET entry_type = 'expense' WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11b changing the entry type of an approved entry is rejected');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET fund_id = 'f0000000-0000-0000-0000-000000000001' WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11c moving an approved entry to another fund is rejected');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET transaction_date = '2024-01-01' WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11d changing the date of an approved entry is rejected');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET deleted_at = NOW() WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11e soft-deleting an approved entry is rejected (void it instead)');
SELECT pg_temp.expect_fail($q$DELETE FROM transactions WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11f hard-deleting an approved entry is rejected');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='pending', reviewed_by=NULL, reviewed_at=NULL WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11g an approved entry cannot go back to pending');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='rejected' WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11h an approved entry cannot be rejected afterwards');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET notes = 'checked by auditor' WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11i a note can still be added to an approved entry');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='voided' WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11j voiding needs voided_by and voided_at');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='voided', voided_by='a1000000-0000-0000-0000-000000000001', voided_at=NOW(), void_reason='entered twice' WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11k an approved entry can be voided (who, when, why recorded)');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='approved', voided_by=NULL, voided_at=NULL, void_reason=NULL, reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11l a voided entry can never come back');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET amount = 2 WHERE id='d1000000-0000-0000-0000-000000000002'$q$, 'T11m a voided entry is frozen');
SELECT pg_temp.expect_eq((SELECT balance::TEXT FROM fund_balances WHERE fund_id='f0000000-0000-0000-0000-000000000002'), '1000.00', 'T11n a voided entry no longer counts in the balance');
-- pending and rejected rows behave as before / are frozen
INSERT INTO transactions (id, org_id, entry_type, amount, category, fund_id, transaction_date, created_by) VALUES ('d1000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','income',70,'fund','f0000000-0000-0000-0000-000000000002','2025-01-03','a1000000-0000-0000-0000-000000000002');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET amount = 75 WHERE id='d1000000-0000-0000-0000-000000000003'$q$, 'T11o a PENDING entry can still be corrected');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='rejected', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW(), rejection_reason='wrong fund' WHERE id='d1000000-0000-0000-0000-000000000003'$q$, 'T11p a pending entry can be rejected');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET amount = 80 WHERE id='d1000000-0000-0000-0000-000000000003'$q$, 'T11q a rejected entry is frozen');
INSERT INTO transactions (id, org_id, entry_type, amount, category, fund_id, transaction_date, created_by) VALUES ('d1000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000001','income',5,'fund','f0000000-0000-0000-0000-000000000002','2025-01-03','a1000000-0000-0000-0000-000000000002');
SELECT pg_temp.expect_ok($q$DELETE FROM transactions WHERE id='d1000000-0000-0000-0000-000000000004'$q$, 'T11r a pending entry can be deleted');

-- ---------- 12. a fund can never go below zero ----------
-- Reserve now holds 1000 (opening balance; the 500 income was voided)
INSERT INTO transactions (id, org_id, entry_type, amount, category, fund_id, transaction_date, created_by) VALUES
  ('d2000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','expense',1000.01,'fund','f0000000-0000-0000-0000-000000000002','2025-02-01','a1000000-0000-0000-0000-000000000002'),
  ('d2000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','refund', 1500,   'fund','f0000000-0000-0000-0000-000000000002','2025-02-01','a1000000-0000-0000-0000-000000000002'),
  ('d2000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','expense',400,    'fund','f0000000-0000-0000-0000-000000000002','2025-02-02','a1000000-0000-0000-0000-000000000002'),
  ('d2000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000001','expense',600,    'fund','f0000000-0000-0000-0000-000000000002','2025-02-03','a1000000-0000-0000-0000-000000000002');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d2000000-0000-0000-0000-000000000001'$q$, 'T12a approving an expense above the balance is rejected');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d2000000-0000-0000-0000-000000000002'$q$, 'T12b approving a refund above the balance is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, fund_id, transaction_date, created_by, status, reviewed_by, reviewed_at) VALUES ('a0000000-0000-0000-0000-000000000001','expense',5000,'fund','f0000000-0000-0000-0000-000000000002','2025-02-04','a1000000-0000-0000-0000-000000000002','approved','a1000000-0000-0000-0000-000000000001',NOW())$q$, 'T12c inserting an already-approved overdraft is rejected');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d2000000-0000-0000-0000-000000000003'$q$, 'T12d an expense within the balance is approved');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d2000000-0000-0000-0000-000000000004'$q$, 'T12e spending the fund down to exactly zero is allowed');
SELECT pg_temp.expect_eq((SELECT balance::TEXT FROM fund_balances WHERE fund_id='f0000000-0000-0000-0000-000000000002'), '0.00', 'T12f balance is exactly zero');
SELECT pg_temp.expect_eq((SELECT fund_balance('f0000000-0000-0000-0000-000000000002')::TEXT), '0.00', 'T12g fund_balance() agrees with the fund_balances view');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='voided', voided_by='a1000000-0000-0000-0000-000000000001', voided_at=NOW() WHERE id='d1000000-0000-0000-0000-000000000001'$q$, 'T12h voiding the opening balance would leave the fund negative: rejected');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='voided', voided_by='a1000000-0000-0000-0000-000000000001', voided_at=NOW() WHERE id='d2000000-0000-0000-0000-000000000004'$q$, 'T12i voiding an expense (money returns) is allowed');
SELECT pg_temp.expect_ok($q$INSERT INTO transactions (org_id, entry_type, amount, category, utility_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','expense',999999,'utility','90000000-0000-0000-0000-000000000001','2025-02-05','a1000000-0000-0000-0000-000000000002')$q$, 'T12j an entry that touches no fund is not blocked by the fund rule');
SELECT pg_temp.expect_ok($q$INSERT INTO transactions (org_id, entry_type, amount, category, fund_id, transaction_date, created_by, status, reviewed_by, reviewed_at) VALUES ('a0000000-0000-0000-0000-000000000001','income',12345,'fund','f0000000-0000-0000-0000-000000000002','2025-02-06','a1000000-0000-0000-0000-000000000002','approved','a1000000-0000-0000-0000-000000000001',NOW())$q$, 'T12k inflows are never blocked');


-- ---------- 13. money and attendance only for APPROVED projects/events ----------
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, project_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','expense',10,'project','c0000000-0000-0000-0000-000000000003','2025-06-03','a1000000-0000-0000-0000-000000000002')$q$, 'T13a a transaction for a PENDING project is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, event_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','expense',10,'event','e0000000-0000-0000-0000-000000000002','2025-06-03','a1000000-0000-0000-0000-000000000002')$q$, 'T13b a transaction for a PENDING event is rejected');
SELECT pg_temp.expect_ok($q$INSERT INTO transactions (org_id, entry_type, amount, category, project_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','expense',10,'project','c0000000-0000-0000-0000-000000000001','2025-06-03','a1000000-0000-0000-0000-000000000002')$q$, 'T13c a transaction for an approved project is accepted');
SELECT pg_temp.expect_ok($q$INSERT INTO transactions (org_id, entry_type, amount, category, event_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','expense',10,'event','e0000000-0000-0000-0000-000000000001','2025-06-03','a1000000-0000-0000-0000-000000000002')$q$, 'T13d a transaction for an approved event is accepted');
INSERT INTO transactions (id, org_id, entry_type, amount, category, project_id, transaction_date, created_by) VALUES ('d3000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','expense',10,'project','c0000000-0000-0000-0000-000000000001','2025-06-04','a1000000-0000-0000-0000-000000000002');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET project_id='c0000000-0000-0000-0000-000000000003' WHERE id='d3000000-0000-0000-0000-000000000001'$q$, 'T13e a pending transaction cannot be re-pointed to a pending project');
SELECT pg_temp.expect_fail($q$INSERT INTO attendances (org_id, user_id, activity_type, project_id, attendance_date, status, recorded_by) VALUES ('a0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','project','c0000000-0000-0000-0000-000000000003','2025-06-05','present','a1000000-0000-0000-0000-000000000001')$q$, 'T13f attendance for a PENDING project is rejected');
SELECT pg_temp.expect_fail($q$INSERT INTO attendances (org_id, user_id, activity_type, event_id, attendance_date, status, recorded_by) VALUES ('a0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','event','e0000000-0000-0000-0000-000000000002','2025-06-05','present','a1000000-0000-0000-0000-000000000001')$q$, 'T13g attendance for a PENDING event is rejected');
SELECT pg_temp.expect_ok($q$INSERT INTO attendances (org_id, user_id, activity_type, event_id, attendance_date, status, recorded_by) VALUES ('a0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','event','e0000000-0000-0000-0000-000000000001','2025-06-05','present','a1000000-0000-0000-0000-000000000001')$q$, 'T13h attendance for an approved event is accepted');
-- a project that is approved, gets activity, and is then rejected: history stays editable but nothing NEW can be added
INSERT INTO projects (id, org_id, title, start_date, created_by, approval_status, reviewed_by, reviewed_at) VALUES ('c0000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000001','Later Rejected','2025-07-01','a1000000-0000-0000-0000-000000000001','approved','a1000000-0000-0000-0000-000000000001',NOW());
INSERT INTO transactions (id, org_id, entry_type, amount, category, project_id, transaction_date, created_by) VALUES ('d3000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','income',50,'project','c0000000-0000-0000-0000-000000000004','2025-07-02','a1000000-0000-0000-0000-000000000002'),
       ('d3000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','income',60,'project','c0000000-0000-0000-0000-000000000004','2025-07-02','a1000000-0000-0000-0000-000000000002');
UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d3000000-0000-0000-0000-000000000002';
INSERT INTO attendances (id, org_id, user_id, activity_type, project_id, attendance_date, status, recorded_by) VALUES ('d4000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','project','c0000000-0000-0000-0000-000000000004','2025-07-03','present','a1000000-0000-0000-0000-000000000001');
UPDATE projects SET approval_status='rejected', rejection_reason='cancelled by the board' WHERE id='c0000000-0000-0000-0000-000000000004';
SELECT pg_temp.expect_fail($q$INSERT INTO transactions (org_id, entry_type, amount, category, project_id, transaction_date, created_by) VALUES ('a0000000-0000-0000-0000-000000000001','income',5,'project','c0000000-0000-0000-0000-000000000004','2025-07-04','a1000000-0000-0000-0000-000000000002')$q$, 'T13i a rejected project cannot receive new transactions');
SELECT pg_temp.expect_fail($q$UPDATE transactions SET status='approved', reviewed_by='a1000000-0000-0000-0000-000000000001', reviewed_at=NOW() WHERE id='d3000000-0000-0000-0000-000000000003'$q$, 'T13j a pending transaction cannot be approved once its project is no longer approved');
SELECT pg_temp.expect_ok($q$UPDATE transactions SET status='voided', voided_by='a1000000-0000-0000-0000-000000000001', voided_at=NOW(), void_reason='project rejected' WHERE id='d3000000-0000-0000-0000-000000000002'$q$, 'T13k an already-approved transaction of that project can still be voided (corrections stay possible)');
SELECT pg_temp.expect_ok($q$UPDATE attendances SET status='late' WHERE id='d4000000-0000-0000-0000-000000000001'$q$, 'T13l existing attendance of that project can still be corrected');
SELECT pg_temp.expect_fail($q$INSERT INTO attendances (org_id, user_id, activity_type, project_id, attendance_date, status, recorded_by) VALUES ('a0000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000003','project','c0000000-0000-0000-0000-000000000004','2025-07-03','present','a1000000-0000-0000-0000-000000000001')$q$, 'T13m a rejected project cannot get new attendance');

-- ---------- summary ----------
\o
SELECT n, CASE WHEN ok THEN 'PASS' ELSE 'FAIL' END AS result, label FROM results ORDER BY n;
SELECT COUNT(*) FILTER (WHERE ok) AS passed, COUNT(*) FILTER (WHERE NOT ok) AS failed, COUNT(*) AS total FROM results;
ROLLBACK;
