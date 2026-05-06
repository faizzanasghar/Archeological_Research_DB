import { motion } from 'framer-motion';
import { MapPin, Calendar, Layers, Trash2, Edit, ChevronRight } from 'lucide-react';
import { getSiteImage } from '../utils/siteImages';
import { useAuthStore } from '../stores/authStore';

/**
 * Reusable Site Card Component
 * Displays excavation site with image, metadata, and actions
 * Fully responsive with dark/light mode support
 */
export default function SiteCard({
  site,
  onDelete,
  onEdit,
  onDetails,
  isDeleting = false,
  variant = 'grid', // 'grid' | 'list'
  index = 0,
}) {
  const { user } = useAuthStore();
  const imagePath = getSiteImage(site.site_name || site.name);
  const isGuest = user?.role === 'Guest';

  if (variant === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ delay: index * 0.05 }}
        className="card"
        style={{
          display: 'flex',
          gap: '1.25rem',
          padding: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Image Thumbnail */}
        <div
          style={{
            width: '120px',
            height: '120px',
            minWidth: '120px',
            borderRadius: '0.875rem',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            background: 'linear-gradient(135deg, var(--bg-elevated), rgba(212,168,67,0.08))',
          }}
        >
          <img
            src={imagePath}
            alt={site.site_name || site.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            onError={(e) => {
              e.target.src = '/assets/sites/mohenjadaro.jpg';
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {site.site_name || site.name}
            </h3>
            <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 600, margin: '0.2rem 0 0' }}>
              {site.location}
            </p>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: '0.5rem 0 0',
              }}
            >
              {site.description || 'No description available'}
            </p>
          </div>

          {/* Metadata Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              flexWrap: 'wrap',
            }}
          >
            {site.discovery_date && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={12} /> {new Date(site.discovery_date).getFullYear()}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Layers size={12} /> {site.gps_coordinates ? '✓ Mapped' : '—'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexDirection: 'column' }}>
          {onDetails && (
            <button
              onClick={() => onDetails(site)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'rgba(212,168,67,0.15)',
                color: 'var(--gold)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(212,168,67,0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(212,168,67,0.15)';
              }}
              title="View Details"
            >
              <ChevronRight size={16} />
            </button>
          )}
          {onEdit && !isGuest && (
            <button
              onClick={() => onEdit(site)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'rgba(59,130,246,0.15)',
                color: '#3b82f6',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(59,130,246,0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(59,130,246,0.15)';
              }}
              title="Edit Site"
            >
              <Edit size={16} />
            </button>
          )}
          {onDelete && !isGuest && (
            <button
              onClick={() => onDelete(site.site_id || site.id)}
              disabled={isDeleting}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'rgba(224,85,85,0.15)',
                color: '#f87171',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isDeleting ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) e.target.style.background = 'rgba(224,85,85,0.25)';
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) e.target.style.background = 'rgba(224,85,85,0.15)';
              }}
              title="Delete Site"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // Grid variant (default)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="card"
      style={{
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(212,168,67,0.1)' }}
    >
      {/* Image Container */}
      <div
        style={{
          width: '100%',
          height: '160px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--bg-elevated), rgba(212,168,67,0.08))',
          position: 'relative',
        }}
      >
        <img
          src={imagePath}
          alt={site.site_name || site.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          onError={(e) => {
            e.target.src = '/assets/sites/mohenjadaro.jpg';
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4))',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Card Header with Icon */}
      <div
        style={{
          height: '3.5rem',
          background: 'linear-gradient(135deg, var(--bg-elevated), rgba(212,168,67,0.08))',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '0.75rem 1rem 0.75rem 1rem',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: '0.75rem',
            padding: '0.5rem',
            border: '1px solid var(--border-mid)',
            color: 'var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MapPin size={18} />
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          flex: 1,
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {site.site_name || site.name}
          </h3>
          <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 600, margin: '0.2rem 0 0' }}>
            {site.location}
          </p>
        </div>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            margin: 0,
          }}
        >
          {site.description || 'No description available'}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: 'auto',
            flexWrap: 'wrap',
          }}
        >
          {site.discovery_date && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={12} /> {new Date(site.discovery_date).getFullYear()}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Layers size={12} /> {site.gps_coordinates ? '✓ Mapped' : '—'}
          </span>
        </div>
      </div>

      {/* Actions Bar */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(212,168,67,0.02)',
        }}
      >
        {onDetails && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetails(site);
            }}
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'rgba(212,168,67,0.15)',
              color: 'var(--gold)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(212,168,67,0.25)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(212,168,67,0.15)';
            }}
          >
            Details →
          </button>
        )}
        {onDelete && !isGuest && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(site.site_id || site.id);
            }}
            disabled={isDeleting}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'rgba(224,85,85,0.15)',
              color: '#f87171',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.5 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) e.target.style.background = 'rgba(224,85,85,0.25)';
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) e.target.style.background = 'rgba(224,85,85,0.15)';
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
