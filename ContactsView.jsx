import React, { useState } from 'react';
import { Users, Plus, Search, Phone, Mail, Building, Edit2, Trash2, MessageCircle, Star, User } from 'lucide-react';
import Modal from '../components/Modal';
import { db } from '../services/db';

export default function ContactsView({ contacts = [], onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    agency: '',
    position: '',
    category: 'Internal',
    notes: '',
    avatar: ''
  });

  const categories = ['Semua', 'VIP', 'Internal', 'Eksternal', 'Media', 'Protokol'];

  const handleOpenAddModal = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      agency: '',
      position: '',
      category: 'Internal',
      notes: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name || '',
      phone: contact.phone || '',
      email: contact.email || '',
      agency: contact.agency || '',
      position: contact.position || '',
      category: contact.category || 'Internal',
      notes: contact.notes || '',
      avatar: contact.avatar || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
      db.deleteContact(id);
      onRefresh();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    db.saveContact({
      ...(editingContact ? { id: editingContact.id } : {}),
      ...formData
    });
    setIsModalOpen(false);
    onRefresh();
  };

  const filteredContacts = contacts.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.phone.includes(searchQuery);
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDirectWA = (phone) => {
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="view-wrapper">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <Users color="var(--accent-orange)" size={26} />
            Manajemen Kontak & Kategori
          </h1>
          <p className="section-subtitle">Buku telepon direktori VIP, Pejabat Internal, Eksternal, & Tim Protokol</p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Tambah Kontak Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--primary-navy)' : '#F1F5F9',
                  color: selectedCategory === cat ? 'white' : 'var(--primary-navy)'
                }}
              >
                {cat === 'VIP' && '⭐ '}
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Cari nama, instansi, atau no hp..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.2rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredContacts.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem' }}>
            <Users size={40} color="#94A3B8" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontWeight: 700 }}>Tidak Ada Kontak Ditemukan</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coba sesuaikan pencarian atau kategori filter Anda.</p>
          </div>
        ) : (
          filteredContacts.map(cnt => (
            <div key={cnt.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={cnt.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={cnt.name}
                      style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-navy)' }}>{cnt.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-orange)', fontWeight: 700 }}>{cnt.position}</div>
                    </div>
                  </div>

                  <span
                    className="badge"
                    style={{
                      background: cnt.category === 'VIP' ? '#FEF3C7' : cnt.category === 'Internal' ? '#DBEAFE' : '#F1F5F9',
                      color: cnt.category === 'VIP' ? '#B45309' : cnt.category === 'Internal' ? '#1D4ED8' : '#334155'
                    }}
                  >
                    {cnt.category === 'VIP' && '⭐ '}
                    {cnt.category}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.83rem', color: 'var(--text-muted)', background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Building size={14} color="var(--primary-navy)" />
                    <span>{cnt.agency || 'Instansi / Mitra'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} color="var(--primary-navy)" />
                    <span>{cnt.phone}</span>
                  </div>
                  {cnt.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={14} color="var(--primary-navy)" />
                      <span>{cnt.email}</span>
                    </div>
                  )}
                </div>

                {cnt.notes && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    "{cnt.notes}"
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDirectWA(cnt.phone)}
                    title="Kirim WhatsApp"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </button>
                  <a
                    href={`tel:${cnt.phone}`}
                    className="btn btn-outline btn-sm"
                    title="Telepon"
                  >
                    <Phone size={14} />
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    className="btn btn-outline btn-icon"
                    onClick={() => handleOpenEditModal(cnt)}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => handleDelete(cnt.id)}
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CRUD MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContact ? 'Edit Informasi Kontak' : 'Tambah Kontak Baru'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap Kontak *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ir. Budi Santoso, M.Eng"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jabatan / Posisi *</label>
              <input
                type="text"
                className="form-input"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                placeholder="Direktur Jenderal"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori Kontak *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="VIP">VIP</option>
                <option value="Internal">Internal</option>
                <option value="Eksternal">Eksternal</option>
                <option value="Media">Media</option>
                <option value="Protokol">Protokol</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">No. Telepon / WhatsApp *</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="081234567890"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@instansi.go.id"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instansi / Perusahaan</label>
            <input
              type="text"
              className="form-input"
              value={formData.agency}
              onChange={e => setFormData({ ...formData, agency: e.target.value })}
              placeholder="Kementerian ESDM / PT Trans Nusantara"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Foto / Avatar</label>
            <input
              type="url"
              className="form-input"
              value={formData.avatar}
              onChange={e => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Catatan / Ringkasan Kontak</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan khusus koordinasi atau pertemanan..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Kontak
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
