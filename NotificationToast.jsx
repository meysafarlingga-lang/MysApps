import React, { useEffect, useState } from 'react';
import { Bell, X, Calendar, MapPin, Clock } from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function NotificationToast() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notif) => {
      setNotifications(prev => [notif, ...prev]);
    });
    return () => unsubscribe();
  }, []);

  const removeNotif = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '380px',
        width: 'calc(100% - 40px)'
      }}
    >
      {notifications.map(notif => (
        <div
          key={notif.id}
          className="card"
          style={{
            background: 'linear-gradient(135deg, #0F172A, #1E293B)',
            color: 'white',
            border: '1px solid var(--accent-orange)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease',
            padding: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Bell size={18} className="pulse-dot" />
              <span>PENGINGAT AGENDA</span>
            </div>
            <button
              onClick={() => removeNotif(notif.id)}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.35rem' }}>
            {notif.agenda?.title}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} color="var(--accent-orange)" />
              <span>{notif.agenda?.startTime} - {notif.agenda?.endTime} WITA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="var(--accent-orange)" />
              <span>{notif.agenda?.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
