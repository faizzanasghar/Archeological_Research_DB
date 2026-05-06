import { Code, User, Globe, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialLinks({ github, linkedin, portfolio, color }) {
  const links = [
    { icon: <Code size={18} />, url: github, label: 'GitHub' },
    { icon: <User size={18} />, url: linkedin, label: 'LinkedIn' },
    { icon: <Globe size={18} />, url: portfolio, label: 'Portfolio' }
  ].filter(link => link.url && link.url !== 'none');

  return (
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
      {links.map((link, i) => (
        <motion.a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -3, scale: 1.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-color)',
            color: color || 'var(--gold)',
            transition: 'all 0.2s ease',
            textDecoration: 'none'
          }}
          title={link.label}
        >
          {link.icon}
        </motion.a>
      ))}
    </div>
  );
}
