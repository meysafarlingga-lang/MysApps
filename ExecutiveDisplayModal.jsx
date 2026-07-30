import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, CheckCircle, Award, ChevronRight } from 'lucide-react';
import { formatIndonesianDate } from '../services/waGeneratorService';

export default function ExecutiveDisplayModal({ isOpen, onClose, agendas = [], currentUser }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAgendas = agendas.filter(a => a.date === todayStr);

  const completedCount = todayAgendas.filter(a => a.status === 'Selesai').length;
  const ongoingCount  = todayAgendas.filter(a => a.status === 'Berlangsung').length;
  const upcomingCount = todayAgendas.filter(a => a.status === 'Mendatang').length;

  // Build 7-day weekly agenda (today + 6 days ahead)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().split('T')[0];
    return {
      dateStr: dStr,
      dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase(),
      dayNum: d.getDate(),
      monthShort: d.toLocaleDateString('id-ID', { month: 'short' }),
      isToday: i === 0,
      items: agendas.filter(a => a.date === dStr)
    };
  });

  return (
    <div className="executive-mode-container">
      {/* ─── HEADER ─── */}
      <div className="executive-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-priority-tinggi" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
              EXECUTIVE MONITORING DISPLAY
            </span>
            <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              {currentUser?.department || 'Sekretariat Pimpinan Utama'}
            </span>
          </div>
          <h1 className="executive-title">{currentUser?.pimpinanTitle || 'Bapak/Ibu Pimpinan'}</h1>
          <p className="executive-subtitle">
            🗓️ {formatIndonesianDate(todayStr)}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="executive-clock">
              {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>WAKTU INDONESIA TENGAH</div>
          </div>

          <button
            className="btn btn-outline"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '50%',
              padding: '0.75rem'
            }}
            title="Tutup Mode Layar Pimpinan"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* ─── MAIN GRID: today (left) | right panel (right) ─── */}
      <div className="executive-grid">

        {/* ════ LEFT: Agenda Hari Ini ════ */}
        <div className="executive-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Calendar color="var(--accent-orange)" size={24} />
              JADWAL AGENDA HARI INI
            </h2>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
              {todayAgendas.length} Kegiatan Terjadwal
            </span>
          </div>

          {todayAgendas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94A3B8' }}>
              <CheckCircle size={48} color="#10B981" style={{ marginBottom: '1rem' }} />
              <h3>Tidak Ada Agenda Terjadwal Hari Ini</h3>
              <p style={{ marginTop: '0.5rem' }}>Semua tugas dan kegiatan hari ini dalam kondisi kosong/bebas.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
              {todayAgendas.map(item => {
                const isOngoing = item.status === 'Berlangsung';
                const isDone    = item.status === 'Selesai';

                return (
                  <div
                    key={item.id}
                    style={{
                      background: isOngoing
                        ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(30, 41, 59, 0.9))'
                        : isDone
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: isOngoing
                        ? '2px solid var(--accent-orange)'
                        : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            background: isOngoing ? 'var(--accent-orange)' : isDone ? '#10B981' : '#2563EB',
                            color: 'white',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 800
                          }}
                        >
                          {item.startTime} - {item.endTime} WITA
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{item.category}</span>
                        {item.priority === 'Tinggi' && (
                          <span style={{ background: '#7F1D1D', color: '#FECACA', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                            PRIORITAS TINGGI
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.35rem' }}>
                        {item.title}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.9rem', color: '#CBD5E1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={16} color="var(--accent-orange)" />
                          <span>{item.location}</span>
                        </div>
                        {item.isOnline && item.meetingUrl && (
                          <span style={{ color: '#60A5FA' }}>💻 Online Zoom</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`badge ${isDone ? 'badge-selesai' : isOngoing ? 'badge-berlangsung' : 'badge-mendatang'}`}
                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ── Status Ringkasan ── */}
          <div className="executive-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#94A3B8', letterSpacing: '0.5px' }}>
              RINGKASAN STATUS HARI INI
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(16,185,129,0.12)', padding: '0.9rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)' }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10B981' }}>{completedCount}</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>SELESAI</div>
              </div>
              <div style={{ background: 'rgba(249,115,22,0.12)', padding: '0.9rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(249,115,22,0.35)' }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-orange)' }}>{ongoingCount}</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>BERLANGSUNG</div>
              </div>
              <div style={{ background: 'rgba(96,165,250,0.12)', padding: '0.9rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(96,165,250,0.3)' }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#60A5FA' }}>{upcomingCount}</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>MENDATANG</div>
              </div>
            </div>
          </div>

          {/* ── Jadwal Mingguan ── */}
          <div className="executive-card" style={{ flex: 1, overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#94A3B8', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="var(--accent-orange)" />
              AGENDA MINGGUAN (7 HARI)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {weekDays.map(day => (
                <div
                  key={day.dateStr}
                  style={{
                    background: day.isToday
                      ? 'linear-gradient(135deg, rgba(249,115,22,0.18), rgba(30,41,59,0.9))'
                      : 'rgba(255,255,255,0.04)',
                    border: day.isToday
                      ? '1px solid rgba(249,115,22,0.55)'
                      : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '0.65rem 0.9rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem'
                  }}
                >
                  {/* Day Badge */}
                  <div
                    style={{
                      minWidth: '46px',
                      textAlign: 'center',
                      background: day.isToday ? 'var(--accent-orange)' : 'rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '0.35rem 0.5rem'
                    }}
                  >
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: day.isToday ? 'rgba(255,255,255,0.85)' : '#64748B', letterSpacing: '0.5px' }}>
                      {day.dayName}
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
                      {day.dayNum}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: day.isToday ? 'rgba(255,255,255,0.7)' : '#64748B', fontWeight: 600 }}>
                      {day.monthShort}
                    </div>
                  </div>

                  {/* Events for that day */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 0 }}>
                    {day.items.length === 0 ? (
                      <span style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic' }}>
                        – Tidak ada agenda –
                      </span>
                    ) : (
                      day.items.map(evt => (
                        <div
                          key={evt.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                            padding: '0.3rem 0.6rem',
                            borderLeft: `3px solid ${evt.priority === 'Tinggi' ? '#EF4444' : evt.status === 'Selesai' ? '#10B981' : 'var(--accent-orange)'}`
                          }}
                        >
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                            {evt.startTime}
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {evt.title}
                          </span>
                          {evt.priority === 'Tinggi' && (
                            <span style={{ marginLeft: 'auto', fontSize: '0.62rem', background: '#7F1D1D', color: '#FECACA', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                              TINGGI
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Count bubble */}
                  {day.items.length > 0 && (
                    <div
                      style={{
                        minWidth: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: day.isToday ? 'var(--accent-orange)' : '#1E3A8A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: 'white',
                        alignSelf: 'center'
                      }}
                    >
                      {day.items.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Sespri Duty Box ── */}
          <div className="executive-card" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', letterSpacing: '0.5px' }}>
              <Award color="var(--accent-orange)" size={18} />
              SESPRI BERJAGA
            </h3>
            <div style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: '1.65' }}>
              <p><strong style={{ color: 'white' }}>{currentUser?.name || 'Sari Rahmayanti, S.STP'}</strong></p>
              <p style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{currentUser?.title || 'Sespri Utama'}</p>
              <p style={{ marginTop: '0.4rem' }}>📞 {currentUser?.phone || '081234567890'}</p>
              <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.35rem' }}>
                *Layar diperbarui real-time. Hubungi Sespri untuk perubahan mendadak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
