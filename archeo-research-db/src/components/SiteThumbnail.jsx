import { getSiteImage } from '../utils/siteImages';

/**
 * Site Thumbnail Component
 * Compact site preview for display in tables, lists, and dashboards
 * Responsive with image and basic metadata
 */
export default function SiteThumbnail({
  site,
  size = 'md', // 'sm' | 'md' | 'lg'
  showMetadata = true,
  onClick = null,
  style = {},
}) {
  const sizes = {
    sm: { width: '80px', height: '80px', fontSize: '0.65rem' },
    md: { width: '120px', height: '120px', fontSize: '0.75rem' },
    lg: { width: '160px', height: '160px', fontSize: '0.85rem' },
  };

  const config = sizes[size] || sizes.md;
  const imagePath = getSiteImage(site.site_name || site.name);

  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Image Container */}
      <div
        style={{
          width: config.width,
          height: config.height,
          borderRadius: '0.75rem',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          background: 'linear-gradient(135deg, var(--bg-elevated), rgba(212,168,67,0.08))',
          marginBottom: showMetadata ? '0.5rem' : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          onError={(e) => {
            e.target.src = '/assets/sites/mohenjadaro.jpg';
          }}
        />
        <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.75rem', pointerEvents: 'none' }} />
      </div>


      {/* Metadata */}
      {showMetadata && (
        <div style={{ minWidth: config.width }}>
          <h4
            style={{
              margin: 0,
              fontSize: config.fontSize,
              fontWeight: 700,
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {site.site_name || site.name}
          </h4>
          <p
            style={{
              margin: '0.2rem 0 0',
              fontSize: `calc(${config.fontSize} - 0.05rem)`,
              color: 'var(--gold)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {site.location}
          </p>
        </div>
      )}
    </div>
  );
}
