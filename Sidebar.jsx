import React from 'react';
import { LayoutDashboard, CalendarDays, MessageSquare, Users, User, Tv, ShieldCheck } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, onOpenExecutive }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agendas', label: 'Agenda & Kalender', icon: CalendarDays },
    { id: 'wa-generator', label: 'WA Reminder Draft', icon: MessageSquare },
    { id: 'contacts', label: 'Kontak & Kategori', icon: Users },
    { id: 'profile', label: 'Profil Sespri', icon: User }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-logo" style={{ width: 40, height: 40, fontSize: '1.4rem' }}>S</div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
              My<span style={{ color: 'var(--accent-orange)' }}>SESPRI</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>System Secretariat V2.4</div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onOpenExecutive}
          >
            <Tv size={18} />
            <span>Mode Layar TV Pimpinan</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
