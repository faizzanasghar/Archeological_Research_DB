-- MERGE USERS TO AVOID FK ISSUES
MERGE INTO app_login target
USING (
    SELECT 1 AS user_id, 'admin_dani' AS username, 'hash123' AS pwd, 'SuperAdmin' AS role FROM DUAL UNION ALL
    SELECT 2, 'curator_lhr', 'hash123', 'Curator' FROM DUAL UNION ALL
    SELECT 3, 'lead_taxila', 'hash123', 'FieldLead' FROM DUAL UNION ALL
    SELECT 15, 'rohail', 'rohail', 'SuperAdmin' FROM DUAL
) source
ON (target.user_id = source.user_id)
WHEN MATCHED THEN
    UPDATE SET target.username = source.username, target.password_hash = source.pwd, target.system_role = source.role
WHEN NOT MATCHED THEN
    INSERT (user_id, username, password_hash, system_role)
    VALUES (source.user_id, source.username, source.pwd, source.role);

COMMIT;
