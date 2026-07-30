import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Tv,
  Users,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  MapPin,
  ChevronRight,
  Plus,
  BarChart3,
  PieChart
} from 'lucide-react';
import { formatIndonesianDate } from '../services/waGeneratorService';

export default function DashboardView({
  agendas = [],
  contacts = [],
  currentUser,
  onOpenExecutive,
  onNavigate,
  onQuickUpdateStatus
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAgendas = agendas.filter(a => a.date === todayStr);

  // Compute stats
  const completedToday = todayAgendas.filter(a => a.status === 'Selesai').length;
  const ongoingToday = todayAgendas.filter(a => a.status === 'Berlangsung').length;
  const upcomingToday = todayAgendas.filter(a => a.status === 'Mendatang').length;
  
  const completionRate = todayAgendas.length > 0
    ? Math.round((completedToday / todayAgendas.length) * 100)
    : 100;

  // Next 7 days agendas
  const getNextDaysAgendas = () => {
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      const items = agendas.filter(a => a.date === dStr);
      next7Days.push({
        dateStr: dStr,
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        dayNum: d.getDate(),
        isToday: i === 0,
        count: items.length
      });
    }
    return next7Days;
  };

  // Category Statistics
  const categories = ['Rapat Internal', 'Audiensi', 'Kunjungan Kerja', 'Acara Resmi', 'Personal'];
  const categoryStats = categories.map(cat => {
    const count = agendas.filter(a => a.category === cat).length;
    const percentage = agendas.length > 0 ? Math.round((count / agendas.length) * 100) : 0;
    return { name: cat, count, percentage };
  });

  return (
    <div className="view-wrapper">
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary-navy), #1E3A8A)',
          color: 'white',
          borderRadius: '24px',
          padding: '1.75rem 2rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.35rem 0.85rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <span className="pulse-dot" />
              <span>DASHBOARD UTAMA EXECUTIVE</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Selamat Datang, {currentUser?.name || 'Sespri'}! 👋
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Jadwal Pimpinan: <strong style={{ color: 'white' }}>{currentUser?.pimpinanTitle || 'Bapak Pimpinan'}</strong> &bull; {formatIndonesianDate(todayStr)}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-primary"
              onClick={onOpenExecutive}
              style={{ boxShadow: 'var(--shadow-orange)', padding: '0.75rem 1.25rem' }}
            >
              <Tv size={20} />
              <span>Buka Mode TV Pimpinan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="metric-grid">
        <div className="metric-card accent-orange">
          <div className="metric-header">
            <span>Agenda Hari Ini</span>
            <div className="metric-icon" style={{ background: '#FFF7ED', color: 'var(--accent-orange)' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div className="metric-value">{todayAgendas.length}</div>
          <div className="metric-sub">
            {ongoingToday > 0 ? `🔥 ${ongoingToday} Sedang Berlangsung` : `${upcomingToday} Mendatang`}
          </div>
        </div>

        <div className="metric-card accent-green">
          <div className="metric-header">
            <span>Penyelesaian Hari Ini</span>
            <div className="metric-icon" style={{ background: '#DCFCE7', color: '#10B981' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="metric-value">{completionRate}%</div>
          <div className="metric-sub">
            {completedToday} dari {todayAgendas.length} kegiatan selesai
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Total Agenda Terjadwal</span>
            <div className="metric-icon">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-value">{agendas.length}</div>
          <div className="metric-sub">Tersebar di kalender kerja</div>
        </div>

        <div className="metric-card accent-purple">
          <div className="metric-header">
            <span>Kontak Tersimpan</span>
            <div className="metric-icon" style={{ background: '#F3E8FF', color: '#8B5CF6' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value">{contacts.length}</div>
          <div className="metric-sub">
            {contacts.filter(c => c.category === 'VIP').length} Kontak VIP
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Timeline & Weekly Glance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {/* Today's Agenda Timeline */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 className="section-title">
                  <Clock color="var(--accent-orange)" size={22} />
                  Agenda Hari Ini ({todayAgendas.length})
                </h2>
                <p className="section-subtitle">Daftar urutan kegiatan pimpinan hari ini</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onNavigate('wa-generator')}
                >
                  <MessageSquare size={16} />
                  <span>Draf WA</span>
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onNavigate('agendas')}
                >
                  <Plus size={16} />
                  <span>Tambah Agenda</span>
                </button>
              </div>
            </div>

            {todayAgendas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#F8FAFC', borderRadius: '12px' }}>
                <Calendar size={40} color="#94A3B8" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>Belum Ada Agenda Hari Ini</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Klik tombol "+ Tambah Agenda" untuk membuat jadwal baru.</div>
              </div>
            ) : (
              <div className="timeline-list">
                {todayAgendas.map(item => {
                  const isOngoing = item.status === 'Berlangsung';
                  const isDone = item.status === 'Selesai';

                  return (
                    <div
                      key={item.id}
                      className={`timeline-card ${isOngoing ? 'status-berlangsung' : isDone ? 'status-selesai' : ''}`}
                    >
                      <div className="timeline-card-header">
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary-blue-light)', fontSize: '0.9rem' }}>
                              {item.startTime} - {item.endTime} WITA
                            </span>
                            <span className="badge badge-category">{item.category}</span>
                            {item.priority === 'Tinggi' && (
                              <span className="badge badge-priority-tinggi">Tinggi</span>
                            )}
                          </div>
                          <h3 className="timeline-title">{item.title}</h3>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            className={`badge ${
                              isDone
                                ? 'badge-selesai'
                                : isOngoing
                                ? 'badge-berlangsung'
                                : 'badge-mendatang'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <div className="timeline-meta">
                        <div className="timeline-meta-item">
                          <MapPin size={15} color="var(--accent-orange)" />
                          <span>{item.location}</span>
                        </div>
                        {item.isOnline && item.meetingUrl && (
                          <div className="timeline-meta-item" style={{ color: '#2563EB', fontWeight: 600 }}>
                            <span>💻 Zoom Online</span>
                          </div>
                        )}
                        {item.notes && (
                          <div className="timeline-meta-item" style={{ color: 'var(--text-muted)' }}>
                            <span>📝 {item.notes}</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)', marginTop: '0.25rem' }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Ubah Status Cepat:
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            className={`btn btn-sm ${isDone ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => onQuickUpdateStatus(item.id, 'Selesai')}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                          >
                            Selesai
                          </button>
                          <button
                            className={`btn btn-sm ${isOngoing ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => onQuickUpdateStatus(item.id, 'Berlangsung')}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                          >
                            Berlangsung
                          </button>
                          <button
                            className={`btn btn-sm ${!isDone && !isOngoing ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => onQuickUpdateStatus(item.id, 'Mendatang')}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                          >
                            Mendatang
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Weekly Strip & Category Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {/* Weekly Glance Strip */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--primary-blue-light)" />
              Agenda 7 Hari Ke Depan
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              {getNextDaysAgendas().map((day, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('agendas')}
                  style={{
                    background: day.isToday ? 'var(--primary-navy)' : '#F8FAFC',
                    color: day.isToday ? 'white' : 'var(--primary-navy)',
                    padding: '0.75rem 0.25rem',
                    borderRadius: '12px',
                    border: day.isToday ? '2px solid var(--accent-orange)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: day.isToday ? 0.9 : 0.6 }}>
                    {day.dayName}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.15rem 0' }}>
                    {day.dayNum}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      background: day.count > 0 ? (day.isToday ? 'var(--accent-orange)' : 'var(--primary-blue-light)') : 'transparent',
                      color: day.count > 0 ? 'white' : '#94A3B8',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '99px',
                      display: 'inline-block'
                    }}
                  >
                    {day.count} Agd
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Breakdown */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={20} color="var(--accent-orange)" />
              Statistik Kategori Agenda
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {categoryStats.map(stat => (
                <div key={stat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--primary-navy)' }}>{stat.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{stat.count} Kegiatan ({stat.percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${stat.percentage}%`,
                        background: 'linear-gradient(90deg, var(--primary-blue-light), var(--accent-orange))',
                        borderRadius: '99px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
