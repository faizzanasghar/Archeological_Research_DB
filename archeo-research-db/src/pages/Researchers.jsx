import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BookOpen, ExternalLink, ChevronDown, CheckCircle, Search } from 'lucide-react';
import api from '../api/axios';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
  borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', width: '100%', outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif',
};

export default function Researchers() {
  const [users, setUsers] = useState([]);
  const [publications, setPublications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openPubId, setOpenPubId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, pubsRes] = await Promise.all([
          api.get('/hr/workers'), // Field workers / oversight
          api.get('/publications')
        ]);
        setUsers(usersRes.data);
        setPublications(pubsRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const scholarPubs = publications;

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span className="gold-line" />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif' }}>Personnel Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Directory of registered researchers, system activity, and cross-referenced literature.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-gold" style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <Shield size={12} /> Admin Oversight
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-dark" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search personnel directory..." style={{ paddingLeft: '2.5rem' }} />
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading researcher data...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No personnel found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((researcher, i) => (
            <motion.div key={researcher.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Card Header */}
              <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--bg-elevated), rgba(212,168,67,0.05))', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', border: '1px solid rgba(212,168,67,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0e1621', fontFamily: 'Outfit,sans-serif', fontSize: '1.25rem', fontWeight: 800 }}>
                  {researcher.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif' }}>
                    {researcher.name}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.15rem 0 0' }}>{researcher.role}</p>
                  <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--gold)', marginTop: '0.25rem' }}>
                    Site: {researcher.site}
                  </p>
                </div>
              </div>

              {/* Publications */}
              <div style={{ padding: '1.5rem', flex: 1 }}>
                <h3 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <BookOpen size={14} style={{ color: 'var(--gold)' }} /> Related Publications ({scholarPubs.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {scholarPubs.slice(0, 2).map(pub => {
                    const isOpen = openPubId === pub.id;
                    return (
                      <div key={pub.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        <button onClick={() => setOpenPubId(isOpen ? null : pub.id)}
                          style={{ width: '100%', textAlign: 'left', padding: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <h4 style={{ margin: 0, fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{pub.title}</h4>
                          <span style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>DOI: {pub.doi}</span>
                        </button>
                      </div>
                    )
                  })}
                  {scholarPubs.length === 0 && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No publications recorded.</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
