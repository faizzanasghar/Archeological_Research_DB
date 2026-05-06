import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Zap } from 'lucide-react';
import { getSiteImage, getSiteMetadata } from '../utils/siteImages';

/**
 * Site Gallery Carousel Component
 * Displays featured excavation sites in a rotating carousel with image highlights
 * Responsive and optimized for both desktop and mobile
 */
export default function SiteGallery({ sites = [], onSiteSelect = null, maxSlides = 6 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const displaySites = sites.slice(0, maxSlides);
  if (displaySites.length === 0) return null;

  useEffect(() => {
    if (!autoPlay || displaySites.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displaySites.length);
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(interval);
  }, [autoPlay, displaySites.length]);

  const currentSite = displaySites[currentIndex];
  const imagePath = getSiteImage(currentSite.site_name || currentSite.name);
  const metadata = getSiteMetadata(currentSite.site_name || currentSite.name);

  const handlePrev = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + displaySites.length) % displaySites.length);
  };

  const handleNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % displaySites.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card"
      style={{
        overflow: 'hidden',
        position: 'relative',
        height: '420px',
        marginBottom: '2rem',
      }}
    >
      {/* Main Image */}
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <motion.img
          key={currentIndex}
          src={imagePath}
          alt={currentSite.site_name || currentSite.name}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.src = '/assets/sites/mohenjadaro.jpg';
          }}
        />

        {/* Dark Overlay Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '2rem',
            color: 'white',
          }}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Zap size={16} style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.95 }}>
                Featured Site
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem',
              }}
            >
              {currentSite.site_name || currentSite.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.9 }}>
              <MapPin size={16} />
              <span style={{ fontSize: '0.95rem' }}>{currentSite.location || 'Unknown Location'}</span>
            </div>
            {metadata && (
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.85, maxWidth: '80%' }}>
                {metadata.period}
              </p>
            )}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            color: 'white',
            cursor: 'pointer',
            padding: '0.75rem',
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
          title="Previous site"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.5rem',
            color: 'white',
            cursor: 'pointer',
            padding: '0.75rem',
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
          title="Next site"
        >
          <ChevronRight size={20} />
        </button>

        {/* Pagination Dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10,
          }}
        >
          {displaySites.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAutoPlay(false);
                setCurrentIndex(idx);
              }}
              style={{
                width: idx === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                background: idx === currentIndex ? 'var(--gold)' : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (idx !== currentIndex) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (idx !== currentIndex) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                }
              }}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Indicator */}
        {autoPlay && (
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.375rem',
              color: 'white',
              padding: '0.4rem 0.75rem',
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              zIndex: 10,
            }}
          >
            Auto-play
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)',
          padding: '1.5rem 1rem 0.5rem',
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          zIndex: 5,
          justifyContent: displaySites.length > 6 ? 'flex-start' : 'center',
        }}
      >
        {displaySites.map((site, idx) => {
          const thumbImage = getSiteImage(site.site_name || site.name);
          return (
            <button
              key={idx}
              onClick={() => {
                setAutoPlay(false);
                setCurrentIndex(idx);
              }}
              style={{
                minWidth: '80px',
                width: '80px',
                height: '60px',
                borderRadius: '0.375rem',
                overflow: 'hidden',
                border: idx === currentIndex ? '2px solid var(--gold)' : '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                padding: 0,
                background: 'transparent',
                transition: 'all 0.2s',
                opacity: idx === currentIndex ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                if (idx !== currentIndex) {
                  e.currentTarget.style.opacity = '0.6';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              title={site.site_name || site.name}
            >
              <img
                src={thumbImage}
                alt={site.site_name || site.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.target.src = '/assets/sites/mohenjadaro.jpg';
                }}
              />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
