import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const S = {
  page: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 50% 50%, rgba(14,22,33,1) 0%, rgba(10,12,18,1) 100%)',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '600px',
    height: '600px',
    transform: 'translate(-50%, -50%)',
    background: 'radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 60%)',
    pointerEvents: 'none',
  }
};

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div 
      style={S.page}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div style={S.glow} />
      
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,168,67,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div 
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <motion.div 
            style={{ position: 'absolute', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '50%', width: '160px', height: '160px' }}
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            style={{ position: 'absolute', border: '1px dashed rgba(212,168,67,0.2)', borderRadius: '50%', width: '200px', height: '200px' }}
            animate={{ rotate: -360, scale: [1, 1.02, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          
          <h1 style={{ margin: 0, fontSize: '3.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-primary)', textShadow: '0 8px 32px rgba(0,0,0,0.5)', textAlign: 'center' }}>
            Excavation<span style={{ color: 'var(--gold)' }}>Hub</span>
          </h1>
        </div>

        <motion.p 
          style={{ marginTop: '2rem', fontSize: '0.8rem', fontFamily: 'Fira Code, monospace', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          FARS DIGITAL ARCHIVE
        </motion.p>

        
        <div style={{ width: '256px', height: '2px', background: 'rgba(212,168,67,0.1)', marginTop: '3rem', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
          <motion.div 
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--gold)', boxShadow: '0 0 12px rgba(212,168,67,0.8)' }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
          />
        </div>
        <motion.p
          style={{ marginTop: '1rem', fontSize: '0.65rem', fontFamily: 'Fira Code, monospace', color: 'rgba(212,168,67,0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5] }}
          transition={{ duration: 2, delay: 1, repeat: Infinity }}
        >
          INITIALIZING SECURE PROTOCOLS...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
