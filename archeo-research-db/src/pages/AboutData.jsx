import { motion } from 'framer-motion';
import { Database, Shield, Server, Network } from 'lucide-react';

export default function AboutData() {
  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header section with image */}
      <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '3rem', border: '1px solid var(--border-color)', height: '400px' }}>
        <img 
          src="/assets/about_data.png" 
          alt="FARS Data Systems" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5) contrast(1.2)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, var(--bg-primary) 0%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span style={{ display: 'block', width: '3rem', height: '3px', background: 'var(--gold)', borderRadius: '2px', marginBottom: '1rem' }} />
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit,sans-serif', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
              Technological Core
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '700px', marginTop: '0.5rem' }}>
              ExcavationHub is powered by the FARS Enterprise Stack, engineered by CGT and Fort tech to handle the complexities of cultural heritage data.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '0.75rem', padding: '0.75rem', color: 'var(--gold)' }}>
              <Database size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Enterprise Persistence</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
            Our system utilizes an enterprise-grade Oracle 11g backend, providing unparalleled transactional integrity for multi-decade research projects. Hosted on secure infrastructure, it ensures that every artifact record is immutable and globally accessible.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '0.75rem', padding: '0.75rem', color: '#34d399' }}>
              <Server size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>API Intelligence</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
            The FARS logic layer is built with high-performance Python Flask, orchestrating complex ERP workflows from personnel payroll to AI-driven artifact classification with sub-millisecond latency.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.75rem', padding: '0.75rem', color: '#60a5fa' }}>
              <Network size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Research UI</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
            ExcavationHub's interface is a state-of-the-art React 18 application, featuring glassmorphic design elements and real-time data visualizations to assist researchers in uncovering patterns across centuries.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(224,85,85,0.1)', border: '1px solid rgba(224,85,85,0.3)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f87171' }}>
              <Shield size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Advanced RBAC</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
            Security is paramount. Our proprietary Role-Based Access Control matrix ensures that confidential site data is only visible to authorized personnel, while maintaining a clean, error-free experience for visitors.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
