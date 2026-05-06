import { Building } from 'lucide-react';

export default function PartnerEntity({ company, color }) {
  if (!company) return null;
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem', 
      padding: '0.75rem 1rem', 
      borderRadius: '1rem', 
      background: 'rgba(255,255,255,0.03)', 
      border: '1px solid var(--border-color)',
      marginTop: 'auto' 
    }}>
      <div style={{
        padding: '0.4rem',
        borderRadius: '0.5rem',
        background: `${color}15`,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Building size={16} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Partner Entity</p>
        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{company}</p>
      </div>
    </div>
  );
}
