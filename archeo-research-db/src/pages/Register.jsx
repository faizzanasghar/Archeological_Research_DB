import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Lock, Building, Briefcase } from 'lucide-react';
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

export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', name: '', affiliation: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setIsLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      setSuccess(`Registration successful! ID: ${response.data.researcher_id}. Redirecting...`);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <motion.div style={S.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={S.blob1} />
      <div style={S.blob2} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(212,168,67,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div style={S.card} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', borderRadius: '2px' }} />
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '50%', padding: '1rem' }}>
            <ShieldCheck style={{ color: 'var(--gold)', width: '2rem', height: '2rem' }} />
          </div>
        </div>
        
        <h2 style={{ color: 'var(--text-primary)', textAlign: 'center', fontSize: '1.5rem', fontFamily: 'Outfit,sans-serif', fontWeight: 700, margin: '0 0 0.25rem' }}>Researcher Onboarding</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.8rem', margin: '0 0 2rem' }}>Request ExcavationHub Access Credentials</p>


        {error && <div style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)', color: '#f87171', fontSize: '0.8rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', color: '#34d399', fontSize: '0.8rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Briefcase style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '1rem', height: '1rem' }} />
            <input type="text" name="name" placeholder="Full Name (e.g. Dr. Jane Doe)" value={formData.name} onChange={handleChange} className="input-dark" style={{ paddingLeft: '2.5rem' }} required />
          </div>
          <div style={{ position: 'relative' }}>
            <Building style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '1rem', height: '1rem' }} />
            <input type="text" name="affiliation" placeholder="University / Affiliation" value={formData.affiliation} onChange={handleChange} className="input-dark" style={{ paddingLeft: '2.5rem' }} required />
          </div>
          <div style={{ position: 'relative' }}>
            <User style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '1rem', height: '1rem' }} />
            <input type="text" name="username" placeholder="Desired Username" value={formData.username} onChange={handleChange} className="input-dark" style={{ paddingLeft: '2.5rem' }} required />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '1rem', height: '1rem' }} />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-dark" style={{ paddingLeft: '2.5rem' }} required />
          </div>

          <button type="submit" disabled={isLoading || success} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', borderRadius: '0.875rem', fontSize: '0.9rem' }}>
            {isLoading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>Return to Login</Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
