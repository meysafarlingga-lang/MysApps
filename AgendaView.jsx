import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Bell,
  CheckCircle,
  Video,
  UserCheck,
  Tag
} from 'lucide-react';
import Modal from '../components/Modal';
import { db } from '../services/db';
import { formatIndonesianDate } from '../services/waGeneratorService';

export default function AgendaView({ agendas = [], contacts = [], onRefresh }) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'daily' | 'weekly' | 'monthly'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [priorityFilter, setPriorityFilter] = useState('Semua');
  
  // Date State for Calendar views
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    isOnline: false,
    meetingUrl: '',
    category: 'Rapat Internal',
    priority: 'Sedang',
    status: 'Mendatang',
    contactIds: [],
    notes: '',
    recurrenceFrequency: 'Sekali',
    reminderMinutes: 30
  });

  const categories = ['Rapat Internal', 'Audiensi', 'Kunjungan Kerja', 'Acara Resmi', 'Personal'];

  const handleOpenAddModal = (initialDate = null) => {
    setEditingAgenda(null);
    setFormData({
      title: '',
      date: initialDate || new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      isOnline: false,
      meetingUrl: '',
      category: 'Rapat Internal',
      priority: 'Sedang',
      status: 'Mendatang',
      contactIds: [],
      notes: '',
      recurrenceFrequency: 'Sekali',
      reminderMinutes: 30
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (agenda) => {
    setEditingAgenda(agenda);
    setFormData({
      title: agenda.title,
      date: agenda.date,
      startTime: agenda.startTime,
      endTime: agenda.endTime,
      location: agenda.location || '',
      isOnline: agenda.isOnline || false,
      meetingUrl: agenda.meetingUrl || '',
      category: agenda.category || 'Rapat Internal',
      priority: agenda.priority || 'Sedang',
      status: agenda.status || 'Mendatang',
      contactIds: agenda.contactIds || [],
      notes: agenda.notes || '',
      recurrenceFrequency: agenda.recurrenceId ? 'Mingguan' : 'Sekali',
      reminderMinutes: agenda.reminderMinutes || 30
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      db.deleteAgenda(id);
      onRefresh();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let recId = null;
    if (formData.recurrenceFrequency !== 'Sekali') {
      const rec = db.saveRecurrence({
        frequency: formData.recurrenceFrequency,
        interval: 1,
        endType: 'never'
      });
      recId = rec.id;
    }

    const payload = {
      ...(editingAgenda ? { id: editingAgenda.id } : {}),
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      isOnline: formData.isOnline,
      meetingUrl: formData.meetingUrl,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      contactIds: formData.contactIds,
      notes: formData.notes,
      recurrenceId: recId,
      reminderMinutes: Number(formData.reminderMinutes)
    };

    db.saveAgenda(payload);
    setIsModalOpen(false);
    onRefresh();
  };

  const toggleContactSelection = (contactId) => {
    setFormData(prev => {
      const exists = prev.contactIds.includes(contactId);
      return {
        ...prev,
        contactIds: exists
          ? prev.contactIds.filter(id => id !== contactId)
          : [...prev.contactIds, contactId]
      };
    });
  };

  // Filtered Agendas List
  const filteredAgendas = agendas.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'Semua' || item.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Calendar Helpers
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderMonthGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Adjust Sunday to be last day (0=Sunday -> 6, 1=Monday -> 0)
    const startingOffset = firstDay === 0 ? 6 : firstDay - 1;

    const cells = [];
    // Previous month empty padding
    for (let i = 0; i < startingOffset; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day-cell other-month" />);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= totalDays; day++) {
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAgendas = agendas.filter(a => a.date === dayStr);
      const isToday = dayStr === todayStr;

      cells.push(
        <div
          key={dayStr}
          className={`calendar-day-cell ${isToday ? 'is-today' : ''}`}
          onClick={() => handleOpenAddModal(dayStr)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="calendar-day-number">{day}</span>
            {dayAgendas.length > 0 && (
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
                {dayAgendas.length} Agd
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
            {dayAgendas.map(agd => (
              <div
                key={agd.id}
                className={`calendar-event-badge ${agd.priority === 'Tinggi' ? 'high-priority' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenEditModal(agd);
                }}
                title={`${agd.startTime} - ${agd.title}`}
              >
                {agd.startTime} {agd.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return cells;
  };

  // Daily View Hourly Slots (07:00 - 20:00)
  const hourlySlots = Array.from({ length: 14 }, (_, i) => i + 7);
  const selectedDateAgendas = agendas.filter(a => a.date === selectedDate);

  return (
    <div className="view-wrapper">
      {/* Top Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <CalendarIcon color="var(--accent-orange)" size={26} />
            Manajemen Agenda & Kalender
          </h1>
          <p className="section-subtitle">Kelola jadwal kegiatan pimpinan, reminder otomatis, & tampilan kalender</p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenAddModal()}>
          <Plus size={18} />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div className="tab-group">
            <button
              className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              Daftar Agenda
            </button>
            <button
              className={`tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              Kalender Harian
            </button>
            <button
              className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              Kalender Mingguan
            </button>
            <button
              className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Kalender Bulanan
            </button>
          </div>

          {activeTab === 'list' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
              <div style={{ position: 'relative', minWidth: '220px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Cari agenda atau lokasi..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.2rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>

              <select
                className="form-select"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="Semua">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="Semua">Semua Prioritas</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* TAB 1: LIST VIEW */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAgendas.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CalendarIcon size={40} color="#94A3B8" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontWeight: 700 }}>Tidak ada agenda yang ditemukan</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coba ubah kata kunci pencarian atau filter Anda.</p>
            </div>
          ) : (
            filteredAgendas.map(item => (
              <div key={item.id} className={`timeline-card ${item.status === 'Berlangsung' ? 'status-berlangsung' : item.status === 'Selesai' ? 'status-selesai' : ''}`}>
                <div className="timeline-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary-navy)' }}>
                        🗓️ {formatIndonesianDate(item.date)} &bull; {item.startTime} - {item.endTime} WITA
                      </span>
                      <span className="badge badge-category">{item.category}</span>
                      {item.recurrenceId && (
                        <span className="badge" style={{ background: '#E0F2FE', color: '#0369A1' }}>
                          <Repeat size={12} /> Berulang
                        </span>
                      )}
                    </div>
                    <h3 className="timeline-title">{item.title}</h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${item.status === 'Selesai' ? 'badge-selesai' : item.status === 'Berlangsung' ? 'badge-berlangsung' : 'badge-mendatang'}`}>
                      {item.status}
                    </span>

                    <button className="btn btn-outline btn-icon" onClick={() => handleOpenEditModal(item)} title="Edit Agenda">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-danger btn-icon" onClick={() => handleDelete(item.id)} title="Hapus Agenda">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="timeline-meta">
                  <div className="timeline-meta-item">
                    <MapPin size={15} color="var(--accent-orange)" />
                    <span>{item.location}</span>
                  </div>
                  {item.isOnline && item.meetingUrl && (
                    <div className="timeline-meta-item" style={{ color: '#2563EB', fontWeight: 600 }}>
                      <Video size={15} />
                      <a href={item.meetingUrl} target="_blank" rel="noreferrer" style={{ color: '#2563EB' }}>
                        {item.meetingUrl}
                      </a>
                    </div>
                  )}
                  {item.contactIds && item.contactIds.length > 0 && (
                    <div className="timeline-meta-item">
                      <UserCheck size={15} color="#8B5CF6" />
                      <span>{item.contactIds.length} Kontak Terkait</span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                    📝 <strong>Catatan:</strong> {item.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: DAILY VIEW */}
      {activeTab === 'daily' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--accent-orange)" />
              Timeline Harian
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="date"
                className="form-input"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                style={{ width: 'auto', fontWeight: 700 }}
              />
            </div>
          </div>

          <div className="hourly-timeline">
            {hourlySlots.map(hour => {
              const hourStr = String(hour).padStart(2, '0');
              const slotAgendas = selectedDateAgendas.filter(a => {
                const startH = parseInt(a.startTime.split(':')[0], 10);
                return startH === hour;
              });

              return (
                <div key={hour} className="hourly-slot">
                  <div className="hourly-time">{hourStr}:00</div>
                  <div className="hourly-content">
                    {slotAgendas.length === 0 ? (
                      <div style={{ fontSize: '0.8rem', color: '#CBD5E1', padding: '0.2rem 0' }}>
                        — Kosong —
                      </div>
                    ) : (
                      slotAgendas.map(agd => (
                        <div
                          key={agd.id}
                          className="timeline-card"
                          onClick={() => handleOpenEditModal(agd)}
                          style={{ cursor: 'pointer', padding: '0.85rem', borderLeftWidth: '4px' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{agd.startTime} - {agd.endTime} WITA</span>
                            <span className="badge badge-category">{agd.category}</span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-navy)' }}>{agd.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {agd.location}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY VIEW */}
      {activeTab === 'weekly' && (
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary-navy)' }}>
            Kalender Mingguan
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem' }}>
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() + i);
              const dStr = d.toISOString().split('T')[0];
              const items = agendas.filter(a => a.date === dStr);

              return (
                <div key={dStr} style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '0.75rem', minHeight: '300px' }}>
                  <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {d.toLocaleDateString('id-ID', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
                      {d.getDate()} {d.toLocaleDateString('id-ID', { month: 'short' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {items.map(agd => (
                      <div
                        key={agd.id}
                        onClick={() => handleOpenEditModal(agd)}
                        style={{
                          background: 'white',
                          border: '1px solid var(--border-color)',
                          borderLeft: '3px solid var(--accent-orange)',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 800, color: 'var(--primary-blue-light)' }}>{agd.startTime}</div>
                        <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>{agd.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MONTHLY VIEW */}
      {activeTab === 'monthly' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
              Kalender Bulanan: {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </h2>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              >
                <ChevronLeft size={16} /> Bln Lalu
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Hari Ini
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              >
                Bln Depan <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            <div className="calendar-header-cell">Senin</div>
            <div className="calendar-header-cell">Selasa</div>
            <div className="calendar-header-cell">Rabu</div>
            <div className="calendar-header-cell">Kamis</div>
            <div className="calendar-header-cell">Jumat</div>
            <div className="calendar-header-cell">Sabtu</div>
            <div className="calendar-header-cell">Minggu</div>

            {renderMonthGrid()}
          </div>
        </div>
      )}

      {/* CRUD MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAgenda ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul Agenda / Kegiatan *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Rapat Koordinasi Anggaran Strategis"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tanggal Kegiatan *</label>
              <input
                type="date"
                className="form-input"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jam Mulai *</label>
              <input
                type="time"
                className="form-input"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jam Selesai *</label>
              <input
                type="time"
                className="form-input"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Lokasi / Tempat *</label>
            <input
              type="text"
              className="form-input"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ruang Rapat Utama Lt. 3 / Gedung Kemenkeu"
              required
            />
          </div>

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="isOnline"
              checked={formData.isOnline}
              onChange={e => setFormData({ ...formData, isOnline: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="isOnline" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
              Kegiatan Dilaksanakan Secara Online (Zoom/Google Meet)
            </label>
          </div>

          {formData.isOnline && (
            <div className="form-group">
              <label className="form-label">Link Meeting (Zoom/GMeet/Teams)</label>
              <input
                type="url"
                className="form-input"
                value={formData.meetingUrl}
                onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })}
                placeholder="https://zoom.us/j/123456789"
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tingkat Prioritas</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Tinggi">Tinggi (Merah)</option>
                <option value="Sedang">Sedang (Kuning)</option>
                <option value="Rendah">Rendah (Biru)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status Agenda</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Mendatang">Mendatang</option>
                <option value="Berlangsung">Berlangsung</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pengulangan Jadwal (Recurrence)</label>
              <select
                className="form-select"
                value={formData.recurrenceFrequency}
                onChange={e => setFormData({ ...formData, recurrenceFrequency: e.target.value })}
              >
                <option value="Sekali">Sekali (Tidak Berulang)</option>
                <option value="Harian">Harian</option>
                <option value="Mingguan">Mingguan</option>
                <option value="Bulanan">Bulanan</option>
                <option value="Tahunan">Tahunan</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Pengingat Otomatis (Reminder)</label>
              <select
                className="form-select"
                value={formData.reminderMinutes}
                onChange={e => setFormData({ ...formData, reminderMinutes: e.target.value })}
              >
                <option value={15}>15 Menit Sebelum</option>
                <option value={30}>30 Menit Sebelum</option>
                <option value={60}>1 Jam Sebelum</option>
                <option value={1440}>1 Hari (24 Jam) Sebelum</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tautkan Kontak / Peserta Pendamping</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '8px' }}>
              {contacts.map(cnt => {
                const isSelected = formData.contactIds.includes(cnt.id);
                return (
                  <button
                    key={cnt.id}
                    type="button"
                    onClick={() => toggleContactSelection(cnt.id)}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {isSelected ? '✓ ' : '+ '}{cnt.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Catatan / Arahan Khusus</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan pakaian, berkas yang harus dibawa, dsb."
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
              Simpan Agenda
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
