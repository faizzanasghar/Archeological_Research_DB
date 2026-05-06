import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ShieldCheck, Microscope, Database, Activity, Calendar } from 'lucide-react';
import api from '../api/axios';

export default function DatingCenter() {
  const [datingRecords, setDatingRecords] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [datingRes, artifactsRes] = await Promise.all([
          api.get('/lab/reports'),
          api.get('/reports/archive')
        ]);
        setDatingRecords(datingRes.data);
        setArtifacts(artifactsRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading Scientific Archive...
    </div>
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
        <div>
          <span className="gold-line" />
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif' }}>Dating Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Chronological timeline of scientific analysis results</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-gold" style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <Activity size={12} /> Live Analysis
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: '24px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--gold), rgba(212,168,67,0.1))' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {datingRecords.map((record, i) => {
            const artifact = artifacts.find(a => a.artifactId == record.artifactId);
            const multipleMethods = datingRecords.filter(r => r.artifactId === record.artifactId).length > 1;

            return (
              <motion.div key={record.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ position: 'relative', paddingLeft: '4rem' }}>
                
                {/* Node */}
                <div style={{ position: 'absolute', left: '17px', top: '1.5rem', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--gold)', border: '4px solid var(--bg-primary)', boxShadow: '0 0 12px rgba(212,168,67,0.5)', zIndex: 10 }} />
                
                {/* Connector */}
                <div style={{ position: 'absolute', left: '32px', top: 'calc(1.5rem + 7px)', width: '2rem', height: '1px', background: 'var(--gold)', opacity: 0.5 }} />

                <div className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>{record.lab}</p>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Analysis Report LAB-{record.id}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Artifact Reference: <strong style={{ color: 'var(--text-primary)' }}>ART-{record.artifactId}</strong></p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>Tested On</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <Calendar size={14} style={{ color: 'var(--gold)' }} /> {record.testDate}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>Methodology</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        <FlaskConical size={16} style={{ color: 'var(--gold)' }} />
                        {record.type.toUpperCase()} DATING
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem' }}>Verification Status</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, justifyContent: 'flex-end' }}>
                        <ShieldCheck size={16} /> VERIFIED
                      </div>
                    </div>
                  </div>

                  {multipleMethods && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(5,150,105,0.05)', borderRadius: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>
                      <Microscope size={14} /> High Confidence: Cross-verified by multiple dating methods.
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
