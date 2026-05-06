import { motion } from 'framer-motion';
import { Target, Compass, ShieldCheck, Users, Award } from 'lucide-react';
import MissionHero from '../components/MissionHero';
import DirectorCard from '../components/DirectorCard';

export default function Owner() {
  const directors = [
    {
      name: 'Muhammad Faizan Asghar',
      role: 'Lead Architect & Full Stack Engineer',
      bio: 'A pioneer in Computational Archaeology, Faizan integrates advanced ERP frameworks with stratigraphic data to secure historical records. His focus is on seamless system orchestration and predictive archaeological modeling.',
      company: 'Fort Tech',
      color: 'var(--gold)',
      github: 'https://github.com/faizzanasghar',
      linkedin: 'https://www.linkedin.com/in/muhammad-faizan-asghar-a843272a2/',
      portfolio: 'https://faizan-asghar-portfolio.vercel.app/'
    },
    {
      name: 'Muhammad Rohail',
      role: 'Backend Developer / Data Engineer',
      bio: 'Specializing in high-performance database architectures and field logistics, Rohail ensures the technical integrity of the FARS ecosystem. He leads the development of the high-availability Oracle 11g backend integration.',
      company: 'CGT',
      color: '#60a5fa',
      github: 'https://github.com/Muhammad-Rohail12',
      linkedin: 'https://www.linkedin.com/in/muhammad-rohail-57b178334/',
      portfolio: 'none'
    }
  ];

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* 1. Hero Section */}
      <MissionHero />

      {/* 2. Founding Directors Section */}
      <div style={{ marginBottom: '5rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}
        >
          <div style={{ 
            background: 'rgba(212,168,67,0.1)', 
            border: '1px solid var(--border-mid)', 
            borderRadius: '0.75rem', 
            padding: '0.6rem',
            color: 'var(--gold)'
          }}>
            <Users size={24} />
          </div>
          <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
            Founding Directors
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {directors.map((director, i) => (
            <DirectorCard key={i} director={director} index={i} />
          ))}
        </div>
      </div>

      {/* 3. Vision & Methodology Section (Preserving Partner Entity Concepts) */}
      <div style={{ marginBottom: '5rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}
        >
          <div style={{ 
            background: 'rgba(5,150,105,0.1)', 
            border: '1px solid rgba(5,150,105,0.3)', 
            borderRadius: '0.75rem', 
            padding: '0.6rem',
            color: '#34d399'
          }}>
            <Target size={24} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
            Collaborating Organizations & Vision
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '0.75rem', padding: '0.75rem', color: 'var(--gold)' }}>
                <Target size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Unified Vision</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              To establish **ExcavationHub** as the global benchmark for archaeological data preservation. Under the patronage of **CGT** and **Fort Tech**, we bridge the gap between ancient stratigraphy and modern enterprise intelligence.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '0.75rem', padding: '0.75rem', color: '#34d399' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Methodology</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              Our field operations utilize state-of-the-art GIS mapping and rigorous site workforce management through **FARS**, ensuring every discovery is secured with digital immutability.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.75rem', padding: '0.75rem', color: '#60a5fa' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Enterprise Trust</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              Backed by **CGT** and **Fort Tech**, FARS is hosted on high-availability enterprise infrastructure, representing the pinnacle of interdisciplinary collaboration between technology and archaeology.
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ marginTop: '5rem', textAlign: 'center', paddingBottom: '3rem' }}>
        <Award size={48} style={{ color: 'var(--gold)', margin: '0 auto 1.5rem', opacity: 0.6 }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
          Preserving the past · Securing the future · FARS
        </p>
      </div>
    </div>
  );
}
