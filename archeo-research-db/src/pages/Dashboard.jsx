import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, Map as MapIcon, Database,
  Globe, PieChart as PieIcon, Activity, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../api/axios';
import { useAuthStore } from '../stores/authStore';
import SiteCard from '../components/SiteCard';
import SiteGallery from '../components/SiteGallery';
import SiteDetailModal from '../components/SiteDetailModal';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const formatPKR = (val) => {
  if (val >= 1000000) return `₨ ${(val / 1000000).toFixed(2)}M`;
  return `₨ ${Number(val).toLocaleString()}`;
};

const COLORS = ['#d4a843', '#059669', '#3b82f6', '#8b5cf6', '#e05555'];

const StatCard = ({ label, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ background: `${color}18`, border: `1px solid ${color}30`, borderRadius: '0.75rem', padding: '0.6rem', color }}>
        <Icon size={20} />
      </div>
      <Activity size={14} style={{ color: 'var(--text-muted)' }} />
    </div>
    <div>
      <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.03em' }}>{value}</p>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
      <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: 'var(--text-primary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>₨{Number(p.value).toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ artifacts: 0, sites: 0, budget: 0, workers: 0 });
  const [expenditureData, setExpenditureData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [sitesRes, expRes, matRes, archiveRes, finRes, workersRes] = await Promise.all([
        api.get('/sites'),
        api.get('/reports/analytics/expenditure'),
        api.get('/reports/analytics/materials'),
        api.get('/reports/archive'),
        api.get('/reports/finance'),
        api.get('/hr/workers'),
      ]);
      setSites(sitesRes.data);
      setExpenditureData(expRes.data);
      setMaterialData(matRes.data);
      setStats({
        artifacts: archiveRes.data.length,
        sites: sitesRes.data.length,
        budget: finRes.data.reduce((acc, curr) => acc + (curr.status === 'Approved' ? Number(curr.amount || 0) : 0), 0),
        workers: workersRes.data.length,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '2.5rem', height: '2.5rem', border: '3px solid var(--border-color)', borderTop: '3px solid var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Initializing Stratum-Connect...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ display: 'block', width: '3rem', height: '3px', background: 'linear-gradient(90deg, var(--gold), transparent)', borderRadius: '2px', marginBottom: '0.5rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.03em', margin: 0 }}>
            Welcome, {user?.username}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            FARS Command Center — Directed by Faizan Asghar & Rohail
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '2rem', padding: '0.4rem 1rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse-gold 2s ease-in-out infinite' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ExcavationHub Live</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.6rem', color: 'var(--gold)', fontWeight: 600 }}>v3.5 Build 2026</p>
        </div>
      </div>

      {/* Visitor Wing for Guests */}
      {user?.role === 'Guest' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(212,168,67,0.1), rgba(20,31,46,0.5))', border: '1px solid rgba(212,168,67,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Globe size={24} style={{ color: 'var(--gold)' }} />
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Visitor's Wing</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '600px' }}>
            Welcome to the digital museum. Explore centuries of history through our public archives. You have read-only access to our most significant discoveries.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/sites')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapIcon size={16} /> Explore Sites
            </button>
            <button onClick={() => navigate('/artifacts')} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={16} /> Public Gallery
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard label="Catalogued Artifacts" value={stats.artifacts.toLocaleString()} icon={Database} color="#d4a843" delay={0} />
        <StatCard label="Active Sites"          value={stats.sites}               icon={MapIcon}   color="#059669" delay={0.05} />
        <StatCard label="Approved Budget (PKR)" value={formatPKR(stats.budget)} icon={TrendingUp} color="#3b82f6" delay={0.1} />
        <StatCard label="Field Personnel"       value={stats.workers}             icon={Users}     color="#8b5cf6" delay={0.15} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Area Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--gold)' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Expenditure Trend</h3>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenditureData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a843" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#d4a843" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickFormatter={v => `₨${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#d4a843" strokeWidth={2.5} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <PieIcon size={18} style={{ color: 'var(--gold)' }} />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Material Culture</h3>
          </div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={materialData} dataKey="count" nameKey="material" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {materialData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)', borderRadius: '0.75rem', color: 'var(--text-primary)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {materialData.slice(0, 5).map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{m.material}</span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* GIS Map */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card"
        style={{ overflow: 'hidden', height: '480px', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000,
          background: 'rgba(14,22,33,0.85)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-mid)', borderRadius: '0.875rem',
          padding: '0.75rem 1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={16} style={{ color: 'var(--gold)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>GIS Surface Mapping</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>
            {sites.length} Sites Tracked
          </p>
        </div>
        <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: '100%', width: '100%', filter: 'saturate(0.5) brightness(0.7)' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {sites.map(site => {
            const coords = site.gps?.split(',').map(c => parseFloat(c.trim()));
            if (!coords || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null;
            return (
              <Marker key={site.id} position={coords}>
                <Popup>
                  <div style={{ background: 'var(--bg-elevated)', padding: '0.5rem', minWidth: '150px' }}>
                    <h4 style={{ fontWeight: 700, color: 'var(--gold)', margin: '0 0 0.25rem' }}>{site.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{site.location}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{site.description}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </motion.div>

      {/* Featured Sites Gallery */}
      {sites.length > 0 && <SiteGallery sites={sites} onSiteSelect={(site) => { setSelectedSite(site); setShowDetailModal(true); }} maxSlides={9} />}

      {/* Active Excavation Sites */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <MapIcon size={18} style={{ color: 'var(--gold)' }} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Active Excavation Sites</h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: 'auto' }}>{sites.length} Total</span>
        </div>
        {sites.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {sites.slice(0, 6).map((site, i) => (
              <SiteCard
                key={site.id || i}
                site={site}
                index={i}
                variant="grid"
                onDetails={(site) => {
                  setSelectedSite(site);
                  setShowDetailModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: '0.875rem', border: '1px solid var(--border-color)' }}>
            No active sites available
          </div>
        )}
      </motion.div>

      {/* Site Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedSite && (
          <SiteDetailModal
            site={selectedSite}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
