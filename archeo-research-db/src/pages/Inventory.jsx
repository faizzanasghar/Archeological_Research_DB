import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, MapPin, Search, AlertCircle, Hammer, Box, X, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { getSiteImage } from '../utils/siteImages';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
  borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', width: '100%', outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif',
};

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Tools', quantity: 1, condition: 'Good', siteId: '' });

  useEffect(() => { fetchData(); }, []);



  const fetchData = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch (e) {
      console.error(e);
      console.error('Failed to fetch inventory from Oracle DB');
    }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory', form);
      setShowModal(false);
      setForm({ name: '', category: 'Tools', quantity: 1, condition: 'Good', siteId: '' });
      toast.success('Asset registered successfully');
      fetchData();
    } catch (e) {
      console.error('Failed to register asset');
    }
  };

  const filtered = inventory.filter(i =>
    i.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="gold-line" />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif' }}>Asset & Logistics</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Field equipment tracking and supply chain</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Register Asset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Assets', value: inventory.length, color: '#d4a843', icon: Package },
          { label: 'Tools & Equipment', value: inventory.filter(i => i.category === 'Tools').length, color: '#3b82f6', icon: Hammer },
          { label: 'Supplies', value: inventory.filter(i => i.category === 'Supplies').length, color: '#059669', icon: Box },
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
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search assets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '2.2rem', padding: '0.6rem 1rem 0.6rem 2.2rem' }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-dark">
            <thead>
              <tr><th>Asset Name</th><th>Category</th><th>Quantity</th><th>Condition</th><th>Deployed Site</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading inventory...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No assets found</td></tr>
              ) : (
                filtered.map((item, i) => {
                  const siteImage = item.site ? getSiteImage(item.site) : null;
                  return (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.item}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Fira Code, monospace', marginTop: '0.2rem' }}>ID: INV-{item.id}</div>
                      </td>
                      <td><span className="badge badge-muted">{item.category}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.quantity}</td>
                      <td>
                        <span className={`badge ${item.condition === 'Excellent' || item.condition === 'Good' ? 'badge-emerald' : item.condition === 'Fair' ? 'badge-blue' : 'badge-red'}`}>
                          {item.condition}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {siteImage && (
                            <img 
                              src={siteImage}
                              alt={item.site}
                              style={{ width: '28px', height: '28px', borderRadius: '0.375rem', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          )}
                          <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem' }}>{item.site || 'Storage Base'}</div>
                            {item.site && <div style={{ fontSize: '0.65rem', color: 'var(--gold)' }}>✓ Deployed</div>}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="modal-box">
              <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: '1.5rem', borderRadius: '2px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Register Asset</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Asset Name *</label>
                  <input required style={inputStyle} placeholder="e.g. Total Station Leica TS16" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Category</label>
                    <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {['Tools', 'Supplies', 'Machinery', 'Vehicles', 'Tech'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Quantity *</label>
                    <input required type="number" min="1" style={inputStyle} value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Condition</label>
                    <select style={inputStyle} value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                      {['Excellent', 'Good', 'Fair', 'Poor', 'Broken'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Site ID</label>
                    <input type="number" style={inputStyle} placeholder="Leave blank for Storage" value={form.siteId} onChange={e => setForm({ ...form, siteId: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '0.875rem' }}>
                    <Save size={16} /> Register Asset
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
