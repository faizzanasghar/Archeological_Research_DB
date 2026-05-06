import { motion } from 'framer-motion';

export default function MissionHero() {
  return (
    <div style={{ 
      position: 'relative', 
      borderRadius: '2.5rem', 
      overflow: 'hidden', 
      marginBottom: '4rem', 
      border: '1px solid var(--border-color)', 
      minHeight: '600px', 
      background: 'radial-gradient(circle at top right, #1a2536 0%, #0a0f18 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem'
    }}>
      
      {/* Subtle Background Pattern / Glow */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--gold)', filter: 'blur(150px)', opacity: 0.05, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: '#3b82f6', filter: 'blur(150px)', opacity: 0.05, pointerEvents: 'none' }} />

      <div style={{ 
        position: 'relative', 
        zIndex: 10,
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {/* Profile Images Group (The Core Focus) */}
        <div style={{ 
          display: 'flex', 
          gap: '3rem', 
          marginBottom: '3rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* Faizan Profile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div 
              whileHover={{ scale: 1.05, translateY: -10 }}
              style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '50%', 
                border: '4px solid var(--gold)', 
                padding: '6px',
                background: 'rgba(212,168,67,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(212,168,67,0.2)',
                marginBottom: '1.5rem',
                overflow: 'hidden'
              }}
            >
              <img 
                src="/assets/faaizan.png" 
                alt="Muhammad Faizan Asghar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </motion.div>
            <div style={{ 
              padding: '0.4rem 1.25rem', 
              borderRadius: '2rem', 
              background: 'rgba(212,168,67,0.15)', 
              border: '1px solid var(--gold)', 
              color: 'var(--gold)', 
              fontSize: '0.75rem', 
              fontWeight: 800,
              letterSpacing: '0.1em',
              display: 'inline-block'
            }}>
              M. FAIZAN ASGHAR
            </div>
          </motion.div>

          {/* Rohail Profile */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div 
              whileHover={{ scale: 1.05, translateY: -10 }}
              style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '50%', 
                border: '4px solid #60a5fa', 
                padding: '6px',
                background: 'rgba(96,165,250,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(96,165,250,0.2)',
                marginBottom: '1.5rem',
                overflow: 'hidden'
              }}
            >
              <img 
                src="/assets/rohail.jpeg" 
                alt="Muhammad Rohail" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </motion.div>
            <div style={{ 
              padding: '0.4rem 1.25rem', 
              borderRadius: '2rem', 
              background: 'rgba(96,165,250,0.15)', 
              border: '1px solid #60a5fa', 
              color: '#60a5fa', 
              fontSize: '0.75rem', 
              fontWeight: 800,
              letterSpacing: '0.1em',
              display: 'inline-block'
            }}>
              M. ROHAIL
            </div>
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ 
              color: 'var(--gold)', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.5em',
              display: 'block',
              marginBottom: '1rem'
            }}>
              Mission Leadership
            </span>
            <h1 style={{ 
              margin: 0, 
              fontSize: '3.5rem', 
              fontWeight: 900, 
              color: '#fff', 
              fontFamily: 'Outfit,sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}>
              System Architects of FARS
            </h1>
          </div>

          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '2rem',
            borderRadius: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '1.15rem', 
              lineHeight: 1.7, 
              margin: 0,
              fontWeight: 500
            }}>
              "Led by <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Muhammad Faizan Asghar</span> and <span style={{ color: '#60a5fa', fontWeight: 700 }}>Muhammad Rohail</span>, FARS is designed to digitally preserve and manage archaeological intelligence with precision, scalability, and innovation."
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
