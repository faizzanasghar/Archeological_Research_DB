import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Layers, Navigation, FileText } from 'lucide-react';
import { getSiteImage, getSiteMetadata } from '../utils/siteImages';

/**
 * Site Detail Modal Component
 * Displays comprehensive site information with image, metadata, and details
 * Responsive and works in both dark/light mode
 */
export default function SiteDetailModal({ site, onClose, onEdit = null, onDelete = null }) {
  if (!site) return null;

  const imagePath = getSiteImage(site.site_name || site.name);
  const metadata = getSiteMetadata(site.site_name || site.name);
  const siteName = site.site_name || site.name || 'Unknown Site';
  const location = site.location || '';
  const gps = site.gps_coordinates || site.gps || '';
  const description = site.description || 'No description available';
  const discoveryDate = site.discovery_date || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          overflow: 'hidden',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header with Image */}
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
          {/* Background Image */}
          <img
            src={imagePath}
            alt={siteName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onError={(e) => {
              e.target.src = '/assets/sites/mohenjadaro.jpg';
            }}
          />

          {/* Overlay Gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.6)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.4)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <X size={20} />
          </button>

          {/* Site Title Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '2rem 1.5rem',
              color: 'white',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              {siteName}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                opacity: 0.95,
              }}
            >
              <MapPin size={16} />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {/* Period & Historical Info */}
          {metadata && (
            <div
              style={{
                background: 'rgba(212, 168, 67, 0.08)',
                border: '1px solid rgba(212, 168, 67, 0.2)',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                Historical Period
              </p>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                {metadata.period}
              </p>
            </div>
          )}

          {/* Description */}
          {description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  margin: '0 0 0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FileText size={16} style={{ color: 'var(--gold)' }} />
                Overview
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
              {metadata && metadata.description && (
                <p
                  style={{
                    margin: '0.75rem 0 0',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                  }}
                >
                  {metadata.description}
                </p>
              )}
            </div>
          )}

          {/* Metadata Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {/* Discovery Date */}
            {discoveryDate && (
              <div>
                <h4
                  style={{
                    margin: '0 0 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Calendar size={14} style={{ color: 'var(--gold)' }} />
                  Discovery Date
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  {new Date(discoveryDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {/* GPS Coordinates */}
            {gps && (
              <div>
                <h4
                  style={{
                    margin: '0 0 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Navigation size={14} style={{ color: 'var(--gold)' }} />
                  GPS Coordinates
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'Fira Code, monospace',
                    fontWeight: 600,
                  }}
                >
                  {gps}
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '1.5rem 0' }} />

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(site);
                  onClose();
                }}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '0.75rem 1rem',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#3b82f6',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.25)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.15)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }}
              >
                Edit Site
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(site.site_id || site.id);
                  onClose();
                }}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '0.75rem 1rem',
                  background: 'rgba(224, 85, 85, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(224, 85, 85, 0.3)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(224, 85, 85, 0.25)';
                  e.target.style.borderColor = 'rgba(224, 85, 85, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(224, 85, 85, 0.15)';
                  e.target.style.borderColor = 'rgba(224, 85, 85, 0.3)';
                }}
              >
                Delete Site
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '0.75rem 1rem',
                background: 'var(--gold)',
                color: 'var(--bg-primary)',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(212, 168, 67, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
