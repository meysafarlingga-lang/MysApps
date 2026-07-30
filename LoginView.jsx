import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { db } from '../services/db';

export default function LoginView({ onLoginSuccess }) {
  const users = db.getUsers();
  const [selectedUser, setSelectedUser] = useState(users[0]?.email || 'sespri@pimpinan.go.id');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === selectedUser) || users[0];
    db.setCurrentUser(user);
    onLoginSuccess(user);
  };

  const handleQuickSelect = (user) => {
    setSelectedUser(user.email);
    db.setCurrentUser(user);
    onLoginSuccess(user);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
        padding: '1.5rem',
        color: 'white'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          color: 'var(--primary-navy)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--accent-orange), #EA580C)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              margin: '0 auto 1rem auto',
              boxShadow: '0 8px 20px rgba(249, 115, 22, 0.4)'
            }}
          >
            S
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
            My<span style={{ color: 'var(--accent-orange)' }}>SESPRI</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Aplikasi Sekretariat & Layar Jadwal Pimpinan
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Sespri / Akun</label>
            <div style={{ position: 'relative' }}>
              <select
                className="form-select"
                value={selectedUser}
                onChange={e => setSelectedUser(e.target.value)}
                style={{ paddingLeft: '2.5rem', fontWeight: 600 }}
              >
                {users.map(u => (
                  <option key={u.id} value={u.email}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <Mail
                size={18}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                required
              />
              <Lock
                size={18}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', borderRadius: '12px' }}
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
            PILIH AKUN DEMO INSTAN
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickSelect(u)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-navy)' }}>{u.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
