import React, { useState } from 'react';
import { MessageSquare, Copy, ExternalLink, Check, Calendar, Send, PhoneCall } from 'lucide-react';
import {
  generateTodayWADraft,
  generateTomorrowWADraft,
  generateSingleAgendaWADraft,
  formatIndonesianDate
} from '../services/waGeneratorService';

export default function WAReminderView({ agendas = [], contacts = [], currentUser }) {
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'tomorrow' | 'single'
  const [copied, setCopied] = useState(false);

  // Single Agenda State
  const [selectedAgendaId, setSelectedAgendaId] = useState(agendas[0]?.id || '');
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDateObj = new Date();
  tomorrowDateObj.setDate(tomorrowDateObj.getDate() + 1);
  const tomorrowStr = tomorrowDateObj.toISOString().split('T')[0];

  const todayAgendas = agendas.filter(a => a.date === todayStr);
  const tomorrowAgendas = agendas.filter(a => a.date === tomorrowStr);

  const getDraftText = () => {
    if (activeTab === 'today') {
      return generateTodayWADraft(currentUser, todayAgendas, contacts);
    } else if (activeTab === 'tomorrow') {
      return generateTomorrowWADraft(currentUser, tomorrowAgendas, contacts, tomorrowStr);
    } else {
      const selectedAgenda = agendas.find(a => a.id === selectedAgendaId) || agendas[0];
      const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0];
      return selectedAgenda ? generateSingleAgendaWADraft(selectedAgenda, selectedContact, currentUser) : '';
    }
  };

  const currentDraft = getDraftText();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    let phoneNum = '';
    if (activeTab === 'single') {
      const selectedContact = contacts.find(c => c.id === selectedContactId);
      if (selectedContact && selectedContact.phone) {
        phoneNum = selectedContact.phone.replace(/[^0-9]/g, '');
        if (phoneNum.startsWith('0')) phoneNum = '62' + phoneNum.slice(1);
      }
    }
    
    const encoded = encodeURIComponent(currentDraft);
    const waUrl = phoneNum ? `https://wa.me/${phoneNum}?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="view-wrapper">
      <div className="section-header">
        <div>
          <h1 className="section-title">
            <MessageSquare color="var(--accent-orange)" size={26} />
            WhatsApp Reminder Generator
          </h1>
          <p className="section-subtitle">Buat draf pesan laporan agenda otomatis untuk Pimpinan & Pejabat terkait</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Tab Selection */}
        <div className="card" style={{ padding: '0.75rem' }}>
          <div className="tab-group" style={{ width: '100%', justifyContent: 'stretch' }}>
            <button
              className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
              onClick={() => setActiveTab('today')}
              style={{ flex: 1, textAlign: 'center' }}
            >
              📅 Draft Agenda Hari Ini ({todayAgendas.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'tomorrow' ? 'active' : ''}`}
              onClick={() => setActiveTab('tomorrow')}
              style={{ flex: 1, textAlign: 'center' }}
            >
              📋 Draft H-1 Briefing ({tomorrowAgendas.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
              onClick={() => setActiveTab('single')}
              style={{ flex: 1, textAlign: 'center' }}
            >
              👤 Pengingat Per Agenda (Personal)
            </button>
          </div>
        </div>

        {/* Tab Content & Draft Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {activeTab === 'single' && (
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-navy)' }}>
                Pilih Agenda & Kontak Tujuan
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pilih Agenda Kegiatan</label>
                  <select
                    className="form-select"
                    value={selectedAgendaId}
                    onChange={e => setSelectedAgendaId(e.target.value)}
                  >
                    {agendas.map(a => (
                      <option key={a.id} value={a.id}>
                        [{a.date}] {a.startTime} - {a.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pilih Kontak Penerima WA</label>
                  <select
                    className="form-select"
                    value={selectedContactId}
                    onChange={e => setSelectedContactId(e.target.value)}
                  >
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.agency || c.position || 'Kontak'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Draft Box Card */}
          <div className="card" style={{ background: '#0F172A', color: 'white', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--accent-orange)' }}>
                <MessageSquare size={18} />
                <span>PRATINJAU DRAF PESAN WHATSAPP</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`btn btn-sm ${copied ? 'btn-primary' : 'btn-outline'}`}
                  onClick={handleCopy}
                  style={{ background: copied ? 'var(--accent-orange)' : 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleOpenWhatsApp}
                >
                  <Send size={16} />
                  <span>Kirim via WhatsApp</span>
                </button>
              </div>
            </div>

            <pre
              style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                background: 'rgba(255,255,255,0.05)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                lineHeight: '1.6',
                color: '#E2E8F0',
                maxHeight: '450px',
                overflowY: 'auto'
              }}
            >
              {currentDraft}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
