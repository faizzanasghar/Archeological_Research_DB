import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ShieldCheck, User, Lock, Globe, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

const S = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 20% 50%, rgba(14,22,33,1) 0%, rgba(10,12,18,1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-15%', left: '-10%',
    width: '50%', height: '50%',
    background: 'radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute', bottom: '-20%', right: '-10%',
    width: '45%', height: '45%',
    background: 'radial-gradient(circle, rgba(5,150,105,0.05) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  card: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-mid)',
    borderRadius: '1.75rem',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    position: 'relative',
    zIndex: 1,
  },
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed. Verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = async () => {
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { username: 'guest_std', password: 'secure-guest-123' });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Guest access is currently unavailable. Contact admin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div style={S.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={S.blob1} />
      <div style={S.blob2} />

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(212,168,67,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <motion.div style={S.card} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          borderRadius: '2px',
        }} />

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div style={{
            background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)',
            borderRadius: '50%', padding: '1rem',
          }}>
            <ShieldCheck style={{ color: 'var(--gold)', width: '2rem', height: '2rem' }} />
          </div>
        </div>

        <h1 style={{ color: 'var(--text-primary)', textAlign: 'center', fontSize: '1.5rem', fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '0.25rem' }}>
          ExcavationHub Portal
        </h1>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.8rem', marginBottom: '2rem' }}>
          FARS Digital Research Ecosystem
        </p>


        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)',
              color: '#f87171', fontSize: '0.8rem', padding: '0.75rem 1rem',
              borderRadius: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Username */}
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '1rem', height: '1rem' }} />
            <input
              type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
              className="input-dark" style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '1rem', height: '1rem' }} />
            <input
              type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
              className="input-dark" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', borderRadius: '0.875rem', fontSize: '0.9rem' }}>
            {isLoading ? 'Authenticating...' : 'Secure Login →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        <button onClick={handleGuest} className="btn-ghost" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Globe size={16} /> Continue as Guest
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          New researcher?{' '}
          <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>
            Request Access
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
