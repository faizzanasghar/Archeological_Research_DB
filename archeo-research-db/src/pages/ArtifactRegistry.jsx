import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Database, Package, Grid, List, X, Save, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { getSiteImage } from '../utils/siteImages';

import { useAuthStore } from '../stores/authStore';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
  borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', width: '100%', outline: 'none', fontFamily: 'Inter, sans-serif',
};

const MATERIALS = ['Pottery', 'Lithic', 'Metal', 'Bone', 'Glass', 'Textile', 'Other'];

export default function ArtifactRegistry() {
  const { user } = useAuthStore();
  const [artifacts, setArtifacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ layerId: '', museumId: '', material: 'Pottery', dimensions: '', condition: 'Good' });

  useEffect(() => { fetchArtifacts(); }, []);



  async function fetchArtifacts() {
    try {
      const res = await api.get('/reports/archive');
      setArtifacts(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    try {
      await api.post('/artifacts', form);
      setShowModal(false);
      setForm({ layerId: '', museumId: '', material: 'Pottery', dimensions: '', condition: 'Good' });
      toast.success('Artifact registered in Oracle DB');
      fetchArtifacts();
    } catch (e) { console.error('Registration failed'); }
  }

  const filtered = artifacts.filter(a =>
    !search ||
    String(a.artifactId).includes(search) ||
    a.material?.toLowerCase().includes(search.toLowerCase()) ||
    a.siteName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ display: 'block', width: '2rem', height: '3px', background: 'linear-gradient(90deg, var(--gold), transparent)', borderRadius: '2px', marginBottom: '0.5rem' }} />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.02em' }}>Artifact Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Central catalog of material culture — Oracle archive view</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {user?.role !== 'Guest' && (
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Register Artifact
            </button>
          )}
        </div>
      </div>


      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search material, site, ID..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
            onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', overflow: 'hidden' }}>
          {['table', 'grid'].map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              style={{ padding: '0 1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                background: viewMode === mode ? 'rgba(212,168,67,0.12)' : 'transparent',
                color: viewMode === mode ? 'var(--gold)' : 'var(--text-muted)' }}>
              {mode === 'table' ? <List size={16} /> : <Grid size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Summary badge */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1rem' }}>
        Showing <strong style={{ color: 'var(--gold)' }}>{filtered.length}</strong> of {artifacts.length} artifacts
      </p>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-dark">
              <thead>
                <tr>
                  <th>ID</th><th>Site & Region</th><th>Material</th><th>Age / Period</th><th>Museum</th><th>Condition</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(art => (
                  <tr key={art.artifactId}>
                    <td><span style={{ fontFamily: 'Fira Code, monospace', color: 'var(--gold)', fontWeight: 700 }}>ART-{art.artifactId}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{art.siteName || '—'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{art.region || ''}</div>
                    </td>
                    <td><span className="badge badge-gold">{art.material}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{art.age || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{art.museum || '—'}</td>
                    <td>
                      <span className={`badge ${art.condition === 'Good' || art.condition === 'Excellent' ? 'badge-emerald' : art.condition === 'Fair' ? 'badge-blue' : 'badge-red'}`}>
                        {art.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((art, i) => {
            const siteImage = getSiteImage(art.siteName);
            return (
              <motion.div key={art.artifactId} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Site Image */}
                <div style={{ width: '100%', height: '140px', overflow: 'hidden', background: 'linear-gradient(135deg, var(--bg-elevated), rgba(212,168,67,0.05))', position: 'relative' }}>
                  <img 
                    src={siteImage}
                    alt={art.siteName || 'Site'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    onError={(e) => { e.target.src = '/assets/sites/mohenjadaro.jpg'; }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3))', pointerEvents: 'none' }} />
                </div>
                
                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem' }}>{art.age || 'Unknown Period'}</p>
                  <h4 style={{ margin: '0 0 0.25rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem' }}>ART-{art.artifactId}</h4>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{art.material}</p>
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingBottom: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>{art.siteName || 'Unknown Site'}</p>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{art.museum || 'Not Assigned'}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Register Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="modal-box">
              <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', marginBottom: '1.5rem', borderRadius: '2px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Register Artifact</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Layer ID *</label>
                    <input required type="number" style={inputStyle} placeholder="e.g. 101" value={form.layerId} onChange={e => setForm({ ...form, layerId: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Museum ID</label>
                    <input type="number" style={inputStyle} placeholder="e.g. 5" value={form.museumId} onChange={e => setForm({ ...form, museumId: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Material</label>
                    <select style={inputStyle} value={form.material} onChange={e => setForm({ ...form, material: e.target.value })}>
                      {MATERIALS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Condition</label>
                    <select style={inputStyle} value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                      {['Excellent', 'Good', 'Fair', 'Damaged', 'Fragmented'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Dimensions (cm)</label>
                  <input style={inputStyle} placeholder="e.g. 12x8x4" value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '0.875rem' }}>
                    <Save size={16} /> Commit to DB
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
