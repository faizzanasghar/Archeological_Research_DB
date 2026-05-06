import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Shield, CheckCircle, XCircle, Search, Key, X, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
  borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', width: '100%', outline: 'none', fontFamily: 'Inter, sans-serif',
};

const ROLES = ['SuperAdmin', 'DBA', 'LeadDirector', 'SiteAdmin', 'FieldLabourAdmin', 'GuestResearcher', 'LabAnalyst', 'Intern', 'Guest'];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'GuestResearcher' });

  useEffect(() => { fetchUsers(); }, []);



  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleStatusToggle = async (user) => {
    try {
      const newStatus = user.isActive === 'Y' ? 'N' : 'Y';
      await api.put(`/users/${user.id}`, { isActive: newStatus });
      toast.success(`User ${newStatus === 'Y' ? 'activated' : 'locked'}`);
      fetchUsers();
    } catch (e) { console.error('Update failed'); }
  };

  const handleProvision = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', form);
      setShowModal(false);
      setForm({ username: '', password: '', role: 'GuestResearcher' });
      toast.success('User provisioned successfully');
      fetchUsers();
    } catch (e) {
      console.error('Provisioning failed', e);
    }
  };

  const filtered = users.filter(u => !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.role?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ display: 'block', width: '2rem', height: '3px', background: 'linear-gradient(90deg, var(--gold), transparent)', borderRadius: '2px', marginBottom: '0.5rem' }} />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.02em' }}>Access Governance</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Manage system users, roles, and security permissions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={16} /> Provision User
        </button>
      </div>

      {/* Security Health Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Users', value: users.length, color: '#d4a843', icon: Users },
          { label: 'Active Sessions', value: users.filter(u => u.isActive === 'Y').length, color: '#059669', icon: ShieldCheck },
          { label: 'Locked Accounts', value: users.filter(u => u.isActive !== 'Y').length, color: '#e05555', icon: XCircle },
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
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

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} style={{ color: 'var(--gold)' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Identity Directory</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search directory..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, width: '220px', paddingLeft: '2.2rem', padding: '0.6rem 1rem 0.6rem 2.2rem' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-dark">
            <thead>
              <tr><th>Identity</th><th>Assigned Role</th><th>Status</th><th>Pages Access</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: '#0e1621', flexShrink: 0 }}>
                        {u.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontSize: '0.9rem' }}>{u.username}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.15rem 0 0', fontFamily: 'Fira Code, monospace' }}>UID:{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-gold">{u.role}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.isActive === 'Y' ? '#34d399' : '#f87171', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.82rem', color: u.isActive === 'Y' ? '#34d399' : '#f87171', fontWeight: 600 }}>
                        {u.isActive === 'Y' ? 'Active' : 'Locked'}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px' }}>
                    <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                      {u.pages || 'Default'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleStatusToggle(u)} title={u.isActive === 'Y' ? 'Lock user' : 'Activate user'}
                        style={{ padding: '0.4rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: u.isActive === 'Y' ? 'rgba(224,85,85,0.12)' : 'rgba(5,150,105,0.12)', color: u.isActive === 'Y' ? '#f87171' : '#34d399' }}>
                        {u.isActive === 'Y' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button title="Reset password"
                        style={{ padding: '0.4rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', background: 'rgba(212,168,67,0.1)', color: 'var(--gold)' }}>
                        <Key size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="modal-box">
              <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: '1.5rem', borderRadius: '2px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Provision New User</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleProvision} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Username *</label>
                  <input required style={inputStyle} placeholder="e.g. analyst_khan" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Password *</label>
                  <input required type="password" style={inputStyle} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>System Role</label>
                  <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '0.875rem' }}>
                    <Save size={16} /> Create User
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
