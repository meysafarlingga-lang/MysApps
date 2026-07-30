import React from 'react';
import { Tv, User, LogOut, Calendar, Bell } from 'lucide-react';

export default function Navbar({ currentUser, onOpenExecutive, onOpenProfile, onLogout }) {
  const todayDateFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">S</div>
        <div>
          <div className="brand-title">
            My<span>SESPRI</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
            {currentUser?.pimpinanTitle || 'Sekretariat Pimpinan'}
          </div>
        </div>
      </div>

      <div className="navbar-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenExecutive}
          title="Buka Mode Layar TV Pimpinan"
        >
          <Tv size={16} />
          <span style={{ display: 'none', minWidth: '600px' }}>Mode TV Pimpinan</span>
          <span className="executive-btn-text">Layar Pimpinan</span>
        </button>

        <button
          className="btn btn-outline btn-icon"
          onClick={onOpenProfile}
          title="Profil User"
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <User size={18} />
          )}
        </button>

        {onLogout && (
          <button
            className="btn btn-outline btn-icon"
            onClick={onLogout}
            title="Keluar / Switch User"
            style={{ color: '#EF4444' }}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
