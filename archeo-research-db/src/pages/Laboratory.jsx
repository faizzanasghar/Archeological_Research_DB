import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, FileText, Clipboard, Activity, Beaker, Search, Download, Plus, Microscope, ShieldCheck, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
  borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', width: '100%', outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif',
};

export default function Laboratory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchReports(); }, []);



  const fetchReports = async () => {
    try {
      const res = await api.get('/lab/reports');
      setReports(res.data);
    } catch (e) {
      console.error(e);
      console.error('Failed to fetch lab reports');
    }
    finally { setLoading(false); }
  };

  const filtered = reports.filter(r =>
    String(r.id).includes(searchTerm) ||
    String(r.artifactId).includes(searchTerm) ||
    r.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="gold-line" />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif' }}>Archaeo-Metrics Lab</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Scientific analysis, dating, and material conservation</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Beaker size={16} /> New Sample
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clipboard size={16} /> Submit Report
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Completed Tests', value: reports.length, color: '#3b82f6', icon: FileText },
          { label: 'Samples In-Queue', value: '12', color: '#059669', icon: FlaskConical },
          { label: 'Active Analysts', value: '5', color: '#8b5cf6', icon: Microscope },
          { label: 'Avg Turnaround', value: '4.2 Days', color: '#d4a843', icon: Activity }
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="stat-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: `${c.color}18`, border: `1px solid ${c.color}30`, borderRadius: '0.75rem', padding: '0.75rem', color: c.color, flexShrink: 0 }}>
              <c.icon size={20} />
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', margin: 0 }}>{c.label}</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', margin: 0, lineHeight: 1.2 }}>{c.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clipboard size={16} style={{ color: 'var(--gold)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Analytical Archives</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search reports..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, width: '220px', paddingLeft: '2.2rem', padding: '0.6rem 1rem 0.6rem 2.2rem' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-dark">
            <thead>
              <tr><th>Report ID</th><th>Artifact Ref</th><th>Analysis Type</th><th>Laboratory</th><th>Test Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading reports...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No reports found</td></tr>
              ) : (
                filtered.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td>
                      <span style={{ fontFamily: 'Fira Code, monospace', color: 'var(--gold)', fontWeight: 700 }}>LAB-{r.id}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>ART-{r.artifactId}</span>
                    </td>
                    <td>
                      <span className={`badge ${r.type === 'carbon' ? 'badge-blue' : 'badge-gold'}`}>
                        {r.type} Dating
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{r.lab}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{r.testDate}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                        <Download size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
