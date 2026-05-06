import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Layers, Users, Home, LogOut,
  Building, Briefcase, Sun, Moon, Menu, X,
  Shield, FlaskConical, Database, Globe, Info,
  ChevronRight, Server
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const LINKS = [
  { path: '/dashboard',     label: 'Command Center',    icon: Home,        roles: ['SuperAdmin','DBA','LeadDirector','FieldLabourAdmin','GuestResearcher','SiteAdmin','Intern','Guest'] },
  { path: '/sites',         label: 'Sites & Strata',    icon: Layers,      roles: ['SuperAdmin','DBA','LeadDirector','GuestResearcher','SiteAdmin', 'Guest'] },
  { path: '/artifacts',     label: 'Artifact Registry', icon: Compass,     roles: ['SuperAdmin','DBA','LeadDirector','GuestResearcher','SiteAdmin', 'Guest'] },
  { path: '/attendance',    label: 'Workforce Roster',  icon: Users,       roles: ['SuperAdmin','DBA','LeadDirector','FieldLabourAdmin'] },
  { path: '/inventory',     label: 'Asset Logistics',   icon: Building,    roles: ['SuperAdmin','DBA','LeadDirector','SiteAdmin'] },
  { path: '/lab',           label: 'Archaeo-Metrics',   icon: FlaskConical,roles: ['SuperAdmin','DBA','LeadDirector','LabAnalyst'] },
  { path: '/researchers',   label: 'Personnel',         icon: Users,       roles: ['SuperAdmin','DBA','LeadDirector'] },
  { path: '/financials',    label: 'Financial Gov.',    icon: Briefcase,   roles: ['SuperAdmin','DBA','LeadDirector','FieldLabourAdmin'] },
  { path: '/users',         label: 'Access Control',    icon: Shield,      roles: ['SuperAdmin','DBA'] },
  { path: '/infrastructure',label: 'Infrastructure',    icon: Server,      roles: ['SuperAdmin','DBA'] },
  { path: '/audit',         label: 'Audit Logs',        icon: Shield,      roles: ['SuperAdmin','DBA'] },
  { path: '/about',         label: 'About Data',        icon: Database,    roles: ['SuperAdmin','DBA','LeadDirector','FieldLabourAdmin','GuestResearcher','SiteAdmin','Intern','Guest'] },
  { path: '/owner',         label: 'Our Mission',       icon: Globe,       roles: ['SuperAdmin','DBA','LeadDirector','FieldLabourAdmin','GuestResearcher','SiteAdmin','Intern','Guest'] },
];

export default function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, toggleTheme } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const filteredLinks = LINKS.filter(l => !user || l.roles.includes(user.role));

  const Sidebar = () => (
    <nav style={{
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-color)',
    }} className="fixed left-0 top-0 h-screen w-64 z-[90] flex flex-col transition-transform duration-300"
      data-open={isMobileOpen}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3">
          <div style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', borderRadius: '0.75rem' }}
            className="h-9 w-9 flex items-center justify-center font-bold text-black text-sm">EH</div>
          <div>
            <p className="font-bold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>ExcavationHub</p>
            <p style={{ color: 'var(--gold)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>FARS Digital Core</p>
          </div>
        </div>
      </div>

      {/* User Card */}
      {user && (
        <div className="mx-4 mt-4 p-3 rounded-xl" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))', color: '#0e1621' }}>
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{user.username}</p>
              <p style={{ color: 'var(--gold)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link key={link.path} to={link.path} onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium group"
              style={isActive ? {
                background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(212,168,67,0.05))',
                border: '1px solid rgba(212,168,67,0.25)',
                color: 'var(--gold)',
              } : {
                color: 'var(--text-secondary)',
                border: '1px solid transparent',
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span className="flex-1 truncate">{link.label}</span>
              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </div>

      {/* Settings / Theme Toggle */}
      <div className="px-4 py-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium text-sm transition-all"
          style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)', background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <Sun size={14} className="hidden dark:block" />
          <Moon size={14} className="block dark:hidden" />
          Toggle Theme
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{ color: 'var(--danger)', border: '1px solid rgba(224,85,85,0.2)', background: 'transparent' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,85,85,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={16} /> Sign Out
        </button>
        <div className="text-center mt-3" style={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontFamily: 'Fira Code, monospace' }}>
          <p>FARS v3.5 · Oracle 11g</p>
          <p style={{ marginTop: '0.2rem', opacity: 0.8 }}>Powered by CGT & Fort tech</p>
        </div>
      </div>
    </nav>

  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[100] p-2 rounded-xl shadow-lg"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)', color: 'var(--gold)' }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar always visible */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-[80]" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen z-[90]">
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
