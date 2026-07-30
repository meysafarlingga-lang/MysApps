import React, { useState } from 'react';
import { User, Mail, Phone, Building, Shield, RefreshCw, Check, Save } from 'lucide-react';
import { db } from '../services/db';

export default function ProfileView({ currentUser, setCurrentUser }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    title: currentUser?.title || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    pimpinanTitle: currentUser?.pimpinanTitle || '',
    department: currentUser?.department || '',
    avatar: currentUser?.avatar || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = db.updateUser({ ...currentUser, ...formData });
    setCurrentUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data agenda & kontak ke data awal (Seed Data)?')) {
      db.resetData();
      window.location.reload();
    }
  };

  return (
    <div className="view-wrapper">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <User color="var(--accent-orange)" size={26} />
            Profil & Pengaturan Sespri
          </h1>
          <p className="section-subtitle">Kelola informasi diri, gelar pimpinan, dan preferensi sekretariat</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          {savedSuccess && (
            <div
              style={{
                background: '#DCFCE7',
                color: '#15803D',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              <Check size={18} />
              <span>Profil berhasil diperbarui dan disimpan!</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <img
              src={formData.avatar}
              alt="Avatar"
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent-orange)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                {formData.name}
              </h2>
              <div style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.9rem' }}>
                {formData.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {formData.department}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Lengkap Sespri</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jabatan Sekretariat</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gelar / Sebutan Pimpinan</label>
              <input
                type="text"
                className="form-input"
                value={formData.pimpinanTitle}
                onChange={e => setFormData({ ...formData, pimpinanTitle: e.target.value })}
                placeholder="Contoh: Bapak Menteri / Bapak Kepala Board"
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                *Digunakan otomatis saat men-generate draf pesan WhatsApp & Layar TV Pimpinan.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Instansi / Unit Kerja</label>
              <input
                type="text"
                className="form-input"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Kedinasan</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">No. Telepon / WhatsApp</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">URL Avatar / Foto Profil</label>
            <input
              type="url"
              className="form-input"
              value={formData.avatar}
              onChange={e => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleResetData}
            >
              <RefreshCw size={16} />
              <span>Reset Seluruh Data Ke Seed Default</span>
            </button>

            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
