-- ==============================================================================
-- RUNTIME QUERIES FOR ARCHAEOLOGICAL RESEARCH ERP
-- ==============================================================================

-- 1. AUTHENTICATION & PROFILE
-- =============================================
-- Login verification
SELECT * FROM app_login WHERE username = :username;

-- Fetch user profile
SELECT id, username, role, isActive FROM app_login WHERE user_id = :user_id;


-- 2. EXCAVATION SITES (MASTER DATA)
-- =============================================
-- List all sites with optional search
SELECT site_id, site_name, location, discovery_date, description, gps_coordinates 
FROM excavation_site 
WHERE site_name LIKE :search_term;

-- Detailed site overview (including child counts)
SELECT 
    s.*, 
    (SELECT COUNT(*) FROM layer WHERE site_id = s.site_id) as layers_count,
    (SELECT COUNT(*) FROM site_worker WHERE site_id = s.site_id) as workers_count
FROM excavation_site s
WHERE s.site_id = :site_id;


-- 3. FINANCIALS (ORACLE VIEW & STORED FUNC)
-- =============================================
-- Summary of all vouchers (Uses View)
SELECT * FROM vw_financial_summary;

-- Total approved budget for a site (Uses Stored Function)
SELECT get_site_total_budget(:site_id) FROM DUAL;

-- Approve a pending voucher
UPDATE financial_voucher SET status = 'Approved' WHERE voucher_id = :voucher_id;

-- Insert new voucher (Trigger handles ID)
INSERT INTO financial_voucher (site_id, created_by, voucher_type, amount_pkr, voucher_date, description, status)
VALUES (:site_id, :user_id, :v_type, :amount, SYSDATE, :desc, 'Pending');


-- 4. ARTIFACT REGISTRY (ORACLE VIEW)
-- =============================================
-- Fetch public archive (Uses View)
SELECT * FROM vw_public_archive;

-- Advanced Artifact Search (Joins multiple subtypes)
SELECT a.artifact_id, a.material, p.rim_diameter, l.stone_type
FROM artifact a
LEFT JOIN pottery p ON a.artifact_id = p.artifact_id
LEFT JOIN lithic l ON a.artifact_id = l.artifact_id
WHERE a.material = :material;


-- 5. HUMAN RESOURCES (PROCEDURE)
-- =============================================
-- Hire a new field worker (Uses Stored Procedure)
BEGIN
    hire_site_worker(:site_id, :name, :cnic, :role, :wage, :admin_id);
END;

-- 6. SYSTEM AUDIT & GOVERNANCE
-- =============================================
-- Fetch last 50 system events (Uses View)
SELECT * FROM vw_secure_audit_log FETCH FIRST 50 ROWS ONLY;


-- 7. ADVANCED ANALYTICS (NEW QUERIES)
-- =============================================
-- Monthly Expenditure Trend
SELECT TO_CHAR(voucher_date, 'YYYY-MM') as month, SUM(amount_pkr) as total
FROM financial_voucher
WHERE status = 'Approved'
GROUP BY TO_CHAR(voucher_date, 'YYYY-MM')
ORDER BY month DESC;

-- Artifact Distribution by Material
SELECT material, COUNT(*) as total
FROM artifact
GROUP BY material
ORDER BY total DESC;

-- Researcher Activity (Number of artifacts associated)
SELECT r.name, COUNT(ra.artifact_id) as artifacts_cataloged
FROM researcher r
JOIN researcher_artifact ra ON r.researcher_id = ra.researcher_id
GROUP BY r.name
ORDER BY artifacts_cataloged DESC;

-- Site Stratigraphy Summary
SELECT s.site_name, l.layer_name, l.depth, COUNT(a.artifact_id) as artifact_count
FROM excavation_site s
JOIN layer l ON s.site_id = l.site_id
LEFT JOIN artifact a ON l.layer_id = a.layer_id
GROUP BY s.site_name, l.layer_name, l.depth
ORDER BY s.site_name, l.depth;
