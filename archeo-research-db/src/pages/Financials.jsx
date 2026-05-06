import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, XCircle, Plus, Search, FileText, X, Save } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
  borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', width: '100%', outline: 'none', fontFamily: 'Inter, sans-serif',
};

const formatPKR = (val) => {
  if (val >= 1000000) return `₨ ${(val / 1000000).toFixed(2)}M`;
  return `₨ ${Number(val).toLocaleString()}`;
};

export default function Financials() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ siteId: '', type: 'Operational', amount: '', description: '' });

  useEffect(() => { fetchVouchers(); }, []);

  const fetchVouchers = async () => {
    try {
      const res = await api.get('/finance/vouchers');
      setVouchers(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/finance/vouchers/${id}/approve`);
      toast.success('Voucher approved');
      fetchVouchers();
    } catch (e) { console.error(e); }
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    try {
      await api.post('/finance/vouchers', form);
      setShowModal(false);
      setForm({ siteId: '', type: 'Operational', amount: '', description: '' });
      toast.success('Voucher submitted for approval');
      fetchVouchers();
    } catch (e) { console.error(e); }
  };

  const filtered = vouchers.filter(v => {
    const matchFilter = filter === 'All' || v.status === filter;
    const matchSearch = !search || v.siteName?.toLowerCase().includes(search.toLowerCase()) || String(v.id).includes(search);
    return matchFilter && matchSearch;
  });

  const totalApproved = vouchers.filter(v => v.status === 'Approved').reduce((a, c) => a + Number(c.amount || 0), 0);
  const totalPending = vouchers.filter(v => v.status === 'Pending').reduce((a, c) => a + Number(c.amount || 0), 0);

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ display: 'block', width: '2rem', height: '3px', background: 'linear-gradient(90deg, var(--gold), transparent)', borderRadius: '2px', marginBottom: '0.5rem' }} />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.02em' }}>Financial Governance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Excavation vouchers, approvals, and site budget management</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Create Voucher
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Pending Approval', value: vouchers.filter(v => v.status === 'Pending').length, sub: formatPKR(totalPending), color: '#f59e0b', icon: Clock },
          { label: 'Approved Vouchers', value: vouchers.filter(v => v.status === 'Approved').length, sub: formatPKR(totalApproved), color: '#059669', icon: CheckCircle },
          { label: 'Total Vouchers', value: vouchers.length, sub: 'All statuses', color: '#d4a843', icon: CreditCard },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="stat-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: `${c.color}18`, border: `1px solid ${c.color}30`, borderRadius: '0.75rem', padding: '0.75rem', color: c.color, flexShrink: 0 }}>
              <c.icon size={22} />
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', margin: '0 0 0.25rem' }}>{c.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', margin: 0, lineHeight: 1 }}>{c.value}</p>
              <p style={{ fontSize: '0.72rem', color: c.color, fontWeight: 600, marginTop: '0.2rem' }}>{c.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.25rem', border: '1px solid var(--border-color)', gap: '0.25rem' }}>
            {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0.4rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.2s',
                  background: filter === f ? 'rgba(212,168,67,0.15)' : 'transparent',
                  color: filter === f ? 'var(--gold)' : 'var(--text-muted)' }}>
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search vouchers..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, width: '220px', paddingLeft: '2.2rem', padding: '0.6rem 1rem 0.6rem 2.2rem' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="table-dark">
            <thead>
              <tr><th>Voucher</th><th>Site</th><th>Type</th><th>Amount (PKR)</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(v => (
                  <motion.tr key={v.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '0.5rem', padding: '0.4rem', color: 'var(--gold)' }}>
                          <FileText size={14} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontSize: '0.85rem' }}>#{v.id}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: '0.1rem 0 0' }}>{v.date}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{v.siteName || '—'}</td>
                    <td><span className="badge badge-muted">{v.type}</span></td>
                    <td style={{ fontFamily: 'Fira Code, monospace', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {formatPKR(v.amount || 0)}
                    </td>
                    <td>
                      <span className={`badge ${v.status === 'Approved' ? 'badge-emerald' : v.status === 'Pending' ? 'badge-gold' : 'badge-red'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {v.status === 'Pending' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button onClick={() => handleApprove(v.id)}
                            style={{ padding: '0.4rem 0.875rem', borderRadius: '999px', border: 'none', cursor: 'pointer', background: 'rgba(5,150,105,0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700 }}>
                            Approve
                          </button>
                          <button style={{ padding: '0.4rem 0.875rem', borderRadius: '999px', border: 'none', cursor: 'pointer', background: 'rgba(224,85,85,0.12)', color: '#f87171', fontSize: '0.75rem', fontWeight: 700 }}>
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No vouchers match the current filter.</div>
          )}
        </div>
      </div>

      {/* Create Voucher Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="modal-box">
              <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: '1.5rem', borderRadius: '2px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create Financial Voucher</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateVoucher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Site ID *</label>
                    <input required type="number" style={inputStyle} placeholder="e.g. 1" value={form.siteId} onChange={e => setForm({ ...form, siteId: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Voucher Type</label>
                    <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      {['Operational', 'Equipment', 'Payroll', 'Research', 'Logistics'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Amount (PKR) *</label>
                  <input required type="number" style={inputStyle} placeholder="e.g. 50000" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Description</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Voucher purpose..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '0.875rem' }}>
                    <Save size={16} /> Submit Voucher
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
