import { motion } from 'framer-motion';
import SocialLinks from './SocialLinks';
import PartnerEntity from './PartnerEntity';

export default function DirectorCard({ director, index }) {
  const getInitials = (name) => {
    if (name.includes('Faizan Asghar')) return 'MFA';
    if (name.includes('Rohail')) return 'MR';
    return name.split(' ').map(n => n[0]).join('').slice(0, 3);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
      className="card"
      style={{
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minHeight: '450px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}
    >
      {/* Accent Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle at top right, ${director.color}10, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Header: Avatar + Info */}
      <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '1.5rem',
          // IMPROVED COLOR COMBINATION: High contrast dark background with colored text/border
          background: '#05080f', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 900,
          color: director.color, // Gold or Blue text
          border: `2px solid ${director.color}`, // Solid accent border
          boxShadow: `0 0 20px ${director.color}22`,
          flexShrink: 0,
          fontFamily: 'Outfit, sans-serif'
        }}>
          {getInitials(director.name)}
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.4rem', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
            {director.name}
          </h3>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.5rem',
            background: `${director.color}15`,
            color: director.color,
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {director.role}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ position: 'relative', flex: 1 }}>
        <div style={{ position: 'absolute', left: -20, top: 0, bottom: 0, width: '3px', background: `linear-gradient(to bottom, ${director.color}, transparent)` }} />
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          lineHeight: 1.8,
          margin: 0,
          paddingLeft: '0.5rem'
        }}>
          {director.bio}
        </p>
      </div>

      {/* Footer: Socials + Partner */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SocialLinks 
            github={director.github} 
            linkedin={director.linkedin} 
            portfolio={director.portfolio} 
            color={director.color}
          />
          <PartnerEntity company={director.company} color={director.color} />
        </div>
      </div>
    </motion.div>
  );
}
