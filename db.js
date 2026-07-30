// LocalStorage Database Service for MySESPRI

const STORAGE_KEYS = {
  USERS: 'mysespri_users',
  CURRENT_USER: 'mysespri_current_user',
  AGENDAS: 'mysespri_agendas',
  CONTACTS: 'mysespri_contacts',
  RECURRENCES: 'mysespri_recurrences',
  SETTINGS: 'mysespri_settings'
};

// Seed Data
const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const DEFAULT_USERS = [
  {
    id: 'usr-1',
    name: 'Sari Rahmayanti, S.STP',
    title: 'Sespri Utama Pimpinan',
    email: 'sespri@pimpinan.go.id',
    phone: '081234567890',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    pimpinanTitle: 'Bapak Head Executive / Pimpinan',
    department: 'Sekretariat Utama & Hubungan Antar Lembaga',
    role: 'Sespri'
  },
  {
    id: 'usr-2',
    name: 'Dr. H. Hendra Wijaya, M.Si',
    title: 'Pimpinan / Kepala Instansi',
    email: 'pimpinan@go.id',
    phone: '081199887766',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    pimpinanTitle: 'Bapak Kepala',
    department: 'Pimpinan Tinggi Utama',
    role: 'Pimpinan'
  }
];

const DEFAULT_CONTACTS = [
  {
    id: 'cnt-1',
    name: 'Ir. Budi Santoso, M.Eng',
    agency: 'Kementerian ESDM',
    position: 'Direktur Jenderal EBTKE',
    category: 'VIP',
    phone: '081298765432',
    email: 'budi.santoso@esdm.go.id',
    notes: 'Kerap hadir dalam rapat lintas sektoral energi hijau.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cnt-2',
    name: 'Dra. Ratna Lestari',
    agency: 'Kementerian Keuangan',
    position: 'Kepala Biro Perencanaan & Anggaran',
    category: 'Internal',
    phone: '081388776655',
    email: 'ratna.l@kemenkeu.go.id',
    notes: 'Kontak utama koordinasi DIPA & Pagu Indikatif.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cnt-3',
    name: 'Deni Kurniawan, S.H.',
    agency: 'PT Trans Nusantara',
    position: 'Chief Executive Officer',
    category: 'Eksternal',
    phone: '081122334455',
    email: 'deni@transnusantara.co.id',
    notes: 'Mitra strategis pembangunan infrastruktur digital.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cnt-4',
    name: 'Anita Wijaya',
    agency: 'Media Kompas Utama',
    position: 'Jurnalis / Redaktur Eksekutif',
    category: 'Media',
    phone: '081544332211',
    email: 'anita.w@media.com',
    notes: 'Narahubung liputan khusus dan doorstop pimpinan.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cnt-5',
    name: 'Capt. Rizal Pratama',
    agency: 'Tim Protokol Pimpinan',
    position: 'Koordinator ADC & Pengawalan',
    category: 'Protokol',
    phone: '081899001122',
    email: 'adc.pimpinan@go.id',
    notes: 'Penanggung jawab rute VIP & pengawalan darat.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  }
];

const DEFAULT_RECURRENCES = [
  {
    id: 'rec-1',
    frequency: 'Mingguan',
    interval: 1,
    endType: 'never',
    endDate: null
  },
  {
    id: 'rec-2',
    frequency: 'Bulanan',
    interval: 1,
    endType: 'never',
    endDate: null
  }
];

const DEFAULT_AGENDAS = [
  {
    id: 'agd-101',
    title: 'Briefing Internal Pagi & Evaluasi Tim Sespri',
    date: getTodayStr(0),
    startTime: '08:30',
    endTime: '09:30',
    location: 'Ruang Rapat Pimpinan Lt. 5',
    isOnline: false,
    meetingUrl: '',
    category: 'Rapat Internal',
    priority: 'Sedang',
    status: 'Selesai',
    contactIds: ['cnt-2', 'cnt-5'],
    notes: 'Penyiapan paparan DIPA Triwulan III dan jadwal pendampingan pimpinan.',
    recurrenceId: 'rec-1',
    reminderMinutes: 30
  },
  {
    id: 'agd-102',
    title: 'Rapat Koordinasi Anggaran Strategis TA 2027',
    date: getTodayStr(0),
    startTime: '10:00',
    endTime: '12:00',
    location: 'Gedung Utama Kemenkeu / Hybrid Zoom',
    isOnline: true,
    meetingUrl: 'https://zoom.us/j/998877665544',
    category: 'Audiensi',
    priority: 'Tinggi',
    status: 'Berlangsung',
    contactIds: ['cnt-1', 'cnt-2'],
    notes: 'Membahas alokasi anggaran infrastruktur dan koordinasi inter-kementerian.',
    recurrenceId: null,
    reminderMinutes: 15
  },
  {
    id: 'agd-103',
    title: 'Audiensi & MoU PT Trans Nusantara',
    date: getTodayStr(0),
    startTime: '14:00',
    endTime: '15:30',
    location: 'Executive Lounge Lt. 2',
    isOnline: false,
    meetingUrl: '',
    category: 'Acara Resmi',
    priority: 'Tinggi',
    status: 'Mendatang',
    contactIds: ['cnt-3'],
    notes: 'Penandatanganan kerjasama transformasi digital instansi.',
    recurrenceId: null,
    reminderMinutes: 60
  },
  {
    id: 'agd-104',
    title: 'Doorstop Wawancara & Conference Media',
    date: getTodayStr(0),
    startTime: '16:00',
    endTime: '17:00',
    location: 'Press Room Utama',
    isOnline: false,
    meetingUrl: '',
    category: 'Acara Resmi',
    priority: 'Sedang',
    status: 'Mendatang',
    contactIds: ['cnt-4'],
    notes: 'Klarifikasi isu terkini terkait kebijakan pelayanan publik.',
    recurrenceId: null,
    reminderMinutes: 30
  },
  {
    id: 'agd-105',
    title: 'Kunjungan Kerja Lapangan & Peninjauan Proyek',
    date: getTodayStr(1),
    startTime: '09:00',
    endTime: '13:00',
    location: 'Kawasan Industri Terpadu Cikarang',
    isOnline: false,
    meetingUrl: '',
    category: 'Kunjungan Kerja',
    priority: 'Tinggi',
    status: 'Mendatang',
    contactIds: ['cnt-1', 'cnt-5'],
    notes: 'Di dampingi tim ADC dan perwakilan Dirjen ESDM.',
    recurrenceId: null,
    reminderMinutes: 1440
  },
  {
    id: 'agd-106',
    title: 'Rapat Paripurna Lintas Kementerian',
    date: getTodayStr(2),
    startTime: '10:00',
    endTime: '12:30',
    location: 'Aula Utama Istana Negara',
    isOnline: false,
    meetingUrl: '',
    category: 'Acara Resmi',
    priority: 'Tinggi',
    status: 'Mendatang',
    contactIds: ['cnt-1', 'cnt-2'],
    notes: 'Pakaian PDU II / PSH lengkap.',
    recurrenceId: null,
    reminderMinutes: 60
  },
  {
    id: 'agd-107',
    title: 'Check-up Kesehatan Rutin Pimpinan',
    date: getTodayStr(3),
    startTime: '08:00',
    endTime: '10:00',
    location: 'RSPAD Gatot Soebroto VIP Wing',
    isOnline: false,
    meetingUrl: '',
    category: 'Personal',
    priority: 'Sedang',
    status: 'Mendatang',
    contactIds: ['cnt-5'],
    notes: 'Jadwal puasa 8 jam sebelum tindakan.',
    recurrenceId: 'rec-2',
    reminderMinutes: 1440
  }
];

export const db = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECURRENCES)) {
      localStorage.setItem(STORAGE_KEYS.RECURRENCES, JSON.stringify(DEFAULT_RECURRENCES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AGENDAS)) {
      localStorage.setItem(STORAGE_KEYS.AGENDAS, JSON.stringify(DEFAULT_AGENDAS));
    }
  },

  // USERS
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
  },
  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },
  updateUser(updatedUser) {
    const users = this.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    const current = this.getCurrentUser();
    if (current && current.id === updatedUser.id) {
      this.setCurrentUser(updatedUser);
    }
    return updatedUser;
  },

  // CONTACTS
  getContacts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
  },
  saveContact(contact) {
    const contacts = this.getContacts();
    if (contact.id) {
      const idx = contacts.findIndex(c => c.id === contact.id);
      if (idx !== -1) contacts[idx] = contact;
    } else {
      contact.id = 'cnt-' + Date.now();
      contacts.unshift(contact);
    }
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return contact;
  },
  deleteContact(id) {
    const contacts = this.getContacts().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  },

  // RECURRENCES
  getRecurrences() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECURRENCES) || '[]');
  },
  saveRecurrence(rec) {
    const recs = this.getRecurrences();
    if (!rec.id) {
      rec.id = 'rec-' + Date.now();
      recs.push(rec);
    } else {
      const idx = recs.findIndex(r => r.id === rec.id);
      if (idx !== -1) recs[idx] = rec;
    }
    localStorage.setItem(STORAGE_KEYS.RECURRENCES, JSON.stringify(recs));
    return rec;
  },

  // AGENDAS
  getAgendas() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.AGENDAS) || '[]');
  },
  getAgendaById(id) {
    return this.getAgendas().find(a => a.id === id);
  },
  saveAgenda(agenda) {
    const agendas = this.getAgendas();
    if (agenda.id) {
      const idx = agendas.findIndex(a => a.id === agenda.id);
      if (idx !== -1) agendas[idx] = agenda;
    } else {
      agenda.id = 'agd-' + Date.now();
      agendas.unshift(agenda);
    }
    localStorage.setItem(STORAGE_KEYS.AGENDAS, JSON.stringify(agendas));
    return agenda;
  },
  deleteAgenda(id) {
    const agendas = this.getAgendas().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.AGENDAS, JSON.stringify(agendas));
  },

  // Reset to default seed
  resetData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
    localStorage.setItem(STORAGE_KEYS.RECURRENCES, JSON.stringify(DEFAULT_RECURRENCES));
    localStorage.setItem(STORAGE_KEYS.AGENDAS, JSON.stringify(DEFAULT_AGENDAS));
    return true;
  }
};

db.init();
