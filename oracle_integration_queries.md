# ArcheoDB - Oracle Enterprise Query Integration Summary

This document summarizes the professional SQL logic from your Oracle 11g database that has been integrated into the ArcheoDB application.

## 🏛️ Integrated Database Views
The frontend uses these views for high-performance dashboards and secure data access.

| View Name | Usage in Frontend | Benefit |
| :--- | :--- | :--- |
| `vw_master_excavation_record` | **Sites Explorer** | Joins Sites, Layers, and Artifacts into one query. |
| `vw_lead_director_overview` | **Dashboard Stats** | Calculates counts and total budget in one go. |
| `vw_financial_summary` | **Financials Page** | Shows vouchers with submitter names without exposing sensitive user data. |
| `vw_admin_labor_dashboard` | **Infrastructure / HR** | Summarizes active workers and payroll per site. |
| `vw_secure_audit_log` | **Admin Audit Panel** | Provides a chronological log of all DB activity for DBAs. |

## ⚙️ Automated Business Logic (Triggers)
These triggers run automatically in the background when the frontend sends data.

1. **`trg_high_value_voucher`**: 
   - **Logic**: If a voucher > 1,000,000 PKR is submitted via the **Financials** page, the status is automatically set to `Pending_Director_Approval`.
2. **`trg_audit_voucher_updates`**:
   - **Logic**: Every time a status is changed in the UI, a record is silently inserted into the `system_audit_log`.
3. **`trg_auto_artifact` / `trg_auto_worker`**:
   - **Logic**: Handles ID generation so the frontend doesn't need to guess the next ID.

## 🚀 Stored Procedures & Functions
Used for complex multi-table operations.

### 1. `hire_site_worker`
- **Called by**: Infrastructure (Add Worker)
- **Action**: Inserts to `site_worker` AND creates an audit log entry in one transaction.

### 2. `get_site_total_budget(p_site_id)`
- **Called by**: Dashboard / Sites Page
- **Action**: Returns a single number representing the total approved spend for a specific site.

### 3. Payroll Calculation Logic (Integrated in API)
- **SQL Logic**: `SUM(CASE WHEN status = 'Present' THEN daily_wage ELSE daily_wage * 0.5 END)`
- **Frontend Usage**: **Financials Page** now calculates real-time liability for every site worker based on Oracle attendance records.

## 📋 Full HR & Logistics Operations
The following enterprise operations are now fully supported:

| Operation | SQL Command Pattern | File / Page |
| :--- | :--- | :--- |
| **Hire Worker** | `INSERT INTO site_worker (...)` | `Infrastructure.jsx` |
| **Remove Worker** | `DELETE FROM site_worker WHERE worker_id = :id` | `Financials.jsx` |
| **Add Equipment** | `INSERT INTO equipment_inventory (...)` | `Infrastructure.jsx` |
| **Submit Voucher** | `INSERT INTO financial_voucher (...)` | `Financials.jsx` |
| **Register Artifact** | `INSERT INTO artifact (...)` | `ArtifactRegistry.jsx` |

---

## 🛠️ API & SQL Mapping Pattern
When the frontend makes an API call, the backend executes a query similar to this:

**Payroll Calculation (Aggregate):**
```sql
SELECT w.full_name, SUM(v.amount_pkr) 
FROM site_worker w 
JOIN worker_attendance a ON w.worker_id = a.worker_id 
GROUP BY w.full_name;
```

**Fetch Site Laborers:**
```sql
SELECT * FROM site_worker WHERE site_id = :sid;
```
