import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Save, AlertTriangle, LayoutGrid, List } from 'lucide-react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import SiteCard from '../components/SiteCard';
import SiteDetailModal from '../components/SiteDetailModal';

import { useAuthStore } from '../stores/authStore';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)',
  borderRadius: '0.75rem', color: 'var(--text-primary)', padding: '0.75rem 1rem',
  fontSize: '0.875rem', width: '100%', outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'Inter, sans-serif',
};

export default function SitesExplorer() {
  const { user } = useAuthStore();
  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', gps: '', date: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => { fetchSites(); }, []);

  async function fetchSites() {
    try {
      const res = await axios.get(`/sites${search ? `?search=${search}` : ''}`);
      setSites(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('/sites', formData);
      setShowForm(false);
      setFormData({ name: '', location: '', gps: '', date: '', description: '' });
      toast.success('Site registered successfully');
      fetchSites();
    } catch (e) { console.error(e); }
  }

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await axios.delete(`/sites/${id}`);
      toast.success('Site removed');
      if (showDetailModal) setShowDetailModal(false);
      fetchSites();
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  }

  function handleViewDetails(site) {
    setSelectedSite(site);
    setShowDetailModal(true);
  }

  async function handleEditSite(site) {
    // This could open an edit form or modal
    setSelectedSite(site);
    setFormData({
      name: site.site_name || site.name,
      location: site.location,
      gps: site.gps_coordinates || site.gps,
      date: site.discovery_date,
      description: site.description,
    });
    setShowForm(true);
    setShowDetailModal(false);
  }

  const filtered = sites.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>


      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <span style={{ display: 'block', width: '2rem', height: '3px', background: 'linear-gradient(90deg, var(--gold), transparent)', borderRadius: '2px', marginBottom: '0.5rem' }} />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.02em' }}>
            Excavation Sites
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Master registry of archaeological locations</p>
        </div>
        {user?.role !== 'Guest' && (
          <button onClick={() => setShowForm(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Register New Site
          </button>
        )}
      </div>


      {/* Search & View Toggle */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text" placeholder="Search by site name or region..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchSites()}
            style={{ ...inputStyle, paddingLeft: '2.5rem' }}
            onFocus={e => e.target.style.borderColor = 'var(--gold)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>
        <button onClick={fetchSites} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
          Search
        </button>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '0.4rem' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: viewMode === 'grid' ? 'var(--gold)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--bg-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: viewMode === 'list' ? 'var(--gold)' : 'transparent',
              color: viewMode === 'list' ? 'var(--bg-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid/List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading sites...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <AlertTriangle size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
          No sites found. Register the first excavation site.
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <AnimatePresence>
            {filtered.map((site, i) => (
              <SiteCard
                key={site.site_id || site.id}
                site={site}
                index={i}
                variant="grid"
                isDeleting={deleting === (site.site_id || site.id)}
                onDelete={handleDelete}
                onDetails={handleViewDetails}
                onEdit={handleEditSite}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence>
            {filtered.map((site, i) => (
              <SiteCard
                key={site.site_id || site.id}
                site={site}
                index={i}
                variant="list"
                isDeleting={deleting === (site.site_id || site.id)}
                onDelete={handleDelete}
                onDetails={handleViewDetails}
                onEdit={handleEditSite}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Site Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedSite && (
          <SiteDetailModal
            site={selectedSite}
            onClose={() => setShowDetailModal(false)}
            onEdit={handleEditSite}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      {/* Registration Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="modal-overlay">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="modal-box" style={{ maxWidth: '540px' }}>
              {/* Gold top accent */}
              <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', borderRadius: '2px', marginBottom: '1.5rem' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Register Excavation Site</h2>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Site Name *</label>
                  <input required style={inputStyle} placeholder="e.g. Mohenjo-Daro North Sector" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Region *</label>
                    <input required style={inputStyle} placeholder="Province / Region" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Discovery Date</label>
                    <input type="date" style={inputStyle} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>GPS Coordinates</label>
                  <input style={inputStyle} placeholder="e.g. 27.3233, 68.1377" value={formData.gps} onChange={e => setFormData({ ...formData, gps: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: '0.4rem' }}>Description</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief excavation overview..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    onFocus={e => e.target.style.borderColor = 'var(--gold)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '0.875rem' }}>
                    <Save size={16} /> Commit to Oracle
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
