import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Terminal, Clock, Activity, Search } from 'lucide-react';
import api from '../api/axios';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
  borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', width: '100%', outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif',
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/reports/audit');
      setLogs(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = logs.filter(l => 
    l.user?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.table?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="gold-line" />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif' }}>Secure System Audit</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Physical Oracle trace logs & enterprise activity monitoring</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '2rem', padding: '0.5rem 1rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse-gold 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Real-time Stream Active</span>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} style={{ color: 'var(--gold)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>System Activity Trace</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Filter logs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, width: '250px', paddingLeft: '2.2rem', padding: '0.6rem 1rem 0.6rem 2.2rem' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-dark">
            <thead>
              <tr><th>Timestamp</th><th>Actor (User)</th><th>Module/Table</th><th>Action Performed</th><th>Details</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Fetching trace logs...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No logs found matching filter</td></tr>
              ) : (
                filtered.map((log, i) => (
                  <motion.tr key={log.logId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'Fira Code, monospace' }}>
                        <Clock size={12} style={{ color: 'var(--text-muted)' }} /> {log.time}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: 'rgba(212,168,67,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: 'var(--gold)' }}>
                          {log.user?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontSize: '0.85rem' }}>{log.user}</p>
                          <p style={{ fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 700, margin: '0.1rem 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-muted">{log.table}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <Terminal size={14} style={{ color: 'var(--gold)' }} /> {log.action}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {log.details}
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
