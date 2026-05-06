/**
 * Lightweight toast utility — mirrors react-hot-toast's API.
 * Renders a fixed overlay container on first use and shows
 * auto-dismissing toast notifications.
 */

const CONTAINER_ID = '__toast_container__';
const DURATION = 3500;

function getContainer() {
  let c = document.getElementById(CONTAINER_ID);
  if (!c) {
    c = document.createElement('div');
    c.id = CONTAINER_ID;
    Object.assign(c.style, {
      position: 'fixed',
      top: '1.25rem',
      right: '1.25rem',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.625rem',
      pointerEvents: 'none',
    });
    document.body.appendChild(c);
  }
  return c;
}

function show(message, type = 'default') {
  const container = getContainer();
  const el = document.createElement('div');

  const colors = {
    success: { bg: 'rgba(5,150,105,0.92)', border: 'rgba(52,211,153,0.4)', icon: '✓' },
    error:   { bg: 'rgba(185,28,28,0.92)',  border: 'rgba(248,113,113,0.4)', icon: '✕' },
    default: { bg: 'rgba(20,31,46,0.95)',   border: 'rgba(212,169,67,0.3)',  icon: 'ℹ' },
  };
  const c = colors[type] || colors.default;

  Object.assign(el.style, {
    background: c.bg,
    border: `1px solid ${c.border}`,
    borderRadius: '0.75rem',
    padding: '0.75rem 1.125rem',
    color: '#fff',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '0.875rem',
    fontWeight: '600',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    pointerEvents: 'auto',
    opacity: '0',
    transform: 'translateX(24px)',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
    maxWidth: '360px',
  });

  el.innerHTML = `<span style="font-size:1rem;line-height:1">${c.icon}</span><span>${message}</span>`;
  container.appendChild(el);

  // Animate in
  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateX(0)';
  });

  // Auto-dismiss
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(24px)';
    setTimeout(() => el.remove(), 280);
  }, DURATION);
}

const toast = (message) => show(message, 'default');
toast.success = (message) => show(message, 'success');
toast.error   = (message) => show(message, 'error');

// Toaster component stub — our container is created lazily, so this is a no-op
export const Toaster = () => null;

export default toast;
