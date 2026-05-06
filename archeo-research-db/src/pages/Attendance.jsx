import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Clock, MapPin, Search, AlertCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Attendance() {
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchData(); }, []);



  const fetchData = async () => {
    try {
      const [wRes, aRes] = await Promise.all([
        api.get('/hr/workers'),
        api.get('/hr/attendance')
      ]);
      setWorkers(wRes.data);
      setAttendance(aRes.data);
    } catch (e) {
      console.error(e);
      console.error('Failed to sync with Oracle 11g server');
    }
    finally { setLoading(false); }
  };

  const handleMark = async (workerId, status) => {
    try {
      await api.post('/hr/attendance', { workerId, status });
      toast.success(`Attendance marked: ${status}`);
      fetchData();
    } catch (e) {
      console.error(e);
      console.error('Attendance transmission failed');
    }
  };

  const filteredWorkers = workers.filter(w =>
    w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="gold-line" />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif' }}>Workforce Roster</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Oracle-integrated field attendance & payroll engine</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '2rem', padding: '0.5rem 1rem' }}>
          <Calendar size={16} style={{ color: 'var(--gold)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-dark" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search field personnel..." style={{ paddingLeft: '2.5rem' }} />
        </div>
      </div>

      {/* Workers Table */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-dark">
            <thead>
              <tr>
                <th>Field Personnel</th>
                <th>Mission Site</th>
                <th>Daily Rate</th>
                <th>Hire Date</th>
                <th style={{ textAlign: 'right' }}>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading roster...</td></tr>
              ) : filteredWorkers.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No personnel found</td></tr>
              ) : (
                filteredWorkers.map((w, i) => (
                  <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#0e1621', flexShrink: 0 }}>
                          {w.name?.[0]}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{w.name}</p>
                          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0.15rem 0 0' }}>{w.role}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <MapPin size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} /> {w.site}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'Fira Code, monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₨{Number(w.wage || 0).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{w.hireDate || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => handleMark(w.id, 'Present')}
                          style={{ padding: '0.4rem 1rem', borderRadius: '999px', border: 'none', cursor: 'pointer', background: 'rgba(5,150,105,0.15)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(5,150,105,0.3)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(5,150,105,0.15)'}>
                          Check-In
                        </button>
                        <button onClick={() => handleMark(w.id, 'Absent')}
                          style={{ padding: '0.4rem 1rem', borderRadius: '999px', border: 'none', cursor: 'pointer', background: 'rgba(224,85,85,0.12)', color: '#f87171', fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,85,85,0.25)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(224,85,85,0.12)'}>
                          Absent
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Log */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Clock size={18} style={{ color: 'var(--gold)' }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Attendance Log</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {attendance.slice(0, 8).map((log, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              className="card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontSize: '0.9rem' }}>{log.worker}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, margin: '0.2rem 0 0', textTransform: 'uppercase' }}>{log.date}</p>
                </div>
                <span className={`badge ${log.status === 'Present' ? 'badge-emerald' : 'badge-red'}`}>
                  {log.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
