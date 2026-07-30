// WhatsApp Message Generator Service for MySESPRI

export const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const generateTodayWADraft = (user, todayAgendas, contacts) => {
  const pimpinanTitle = user?.pimpinanTitle || 'Bapak/Ibu Pimpinan';
  const todayDateFormatted = formatIndonesianDate(new Date().toISOString().split('T')[0]);

  let msg = `*Yth. ${pimpinanTitle},*\n\n`;
  msg += `Berikut disampaikan *Laporan Agenda Kegiatan Hari Ini*\n`;
  msg += `🗓️ *${todayDateFormatted}*\n`;
  msg += `-------------------------------------------\n\n`;

  if (todayAgendas.length === 0) {
    msg += `_Tidak ada agenda terjadwal untuk hari ini._\n\n`;
  } else {
    todayAgendas.forEach((item, index) => {
      const priorityBadge = item.priority === 'Tinggi' ? '🔴 [PRIORITAS TINGGI]' : item.priority === 'Sedang' ? '🟡 [PRIORITAS SEDANG]' : '🟢 [PRIORITAS BIASA]';
      const statusIcon = item.status === 'Selesai' ? '✅' : item.status === 'Berlangsung' ? '⏳' : '📌';
      
      msg += `*${index + 1}. ${item.title}*\n`;
      msg += `   ${statusIcon} Status: *${item.status}* | ${priorityBadge}\n`;
      msg += `   ⏰ *Waktu:* ${item.startTime} - ${item.endTime} WITA\n`;
      msg += `   📍 *Lokasi:* ${item.location}\n`;
      
      if (item.isOnline && item.meetingUrl) {
        msg += `   💻 *Link Meeting:* ${item.meetingUrl}\n`;
      }

      if (item.category) {
        msg += `   📂 *Kategori:* ${item.category}\n`;
      }

      if (item.contactIds && item.contactIds.length > 0) {
        const attendeeNames = item.contactIds
          .map(cid => contacts.find(c => c.id === cid))
          .filter(Boolean)
          .map(c => `${c.name} (${c.agency || c.position || 'Eksternal'})`)
          .join(', ');
        if (attendeeNames) {
          msg += `   👤 *Pendamping / Peserta:* ${attendeeNames}\n`;
        }
      }

      if (item.notes) {
        msg += `   📝 *Catatan:* ${item.notes}\n`;
      }

      msg += `\n`;
    });
  }

  msg += `-------------------------------------------\n`;
  msg += `Demikian disampaikan. Mohon arahan dan petunjuk lebih lanjut.\n\n`;
  msg += `Salam hormat,\n`;
  msg += `*${user?.name || 'Sespri Pimpinan'}*\n`;
  msg += `_${user?.title || 'Sekretariat Pimpinan'}_`;

  return msg;
};

export const generateTomorrowWADraft = (user, tomorrowAgendas, contacts, tomorrowDateStr) => {
  const pimpinanTitle = user?.pimpinanTitle || 'Bapak/Ibu Pimpinan';
  const tomorrowFormatted = formatIndonesianDate(tomorrowDateStr);

  let msg = `*Yth. ${pimpinanTitle},*\n\n`;
  msg += `Izin melaporkan *Draf Agenda Kegiatan H-1 (Esok Hari)*\n`;
  msg += `🗓️ *${tomorrowFormatted}*\n`;
  msg += `-------------------------------------------\n\n`;

  if (tomorrowAgendas.length === 0) {
    msg += `_Belum ada agenda terjadwal untuk esok hari._\n\n`;
  } else {
    tomorrowAgendas.forEach((item, index) => {
      const priorityBadge = item.priority === 'Tinggi' ? '🔴 [PRIORITAS TINGGI]' : item.priority === 'Sedang' ? '🟡 [PRIORITAS SEDANG]' : '🟢 [PRIORITAS BIASA]';
      
      msg += `*${index + 1}. ${item.title}*\n`;
      msg += `   ⏰ *Waktu:* ${item.startTime} - ${item.endTime} WITA\n`;
      msg += `   📍 *Lokasi:* ${item.location}\n`;
      msg += `   🏷️ ${priorityBadge}\n`;
      
      if (item.isOnline && item.meetingUrl) {
        msg += `   💻 *Link Online:* ${item.meetingUrl}\n`;
      }

      if (item.contactIds && item.contactIds.length > 0) {
        const attendeeNames = item.contactIds
          .map(cid => contacts.find(c => c.id === cid))
          .filter(Boolean)
          .map(c => `${c.name} (${c.agency || ''})`)
          .join(', ');
        if (attendeeNames) {
          msg += `   👤 *Kontak / Peserta:* ${attendeeNames}\n`;
        }
      }

      if (item.notes) {
        msg += `   📝 *Catatan Preparasi:* ${item.notes}\n`;
      }

      msg += `\n`;
    });
  }

  msg += `-------------------------------------------\n`;
  msg += `Mohon konfirmasi jika ada perubahan atau penyesuaian jadwal.\n\n`;
  msg += `Terima kasih,\n`;
  msg += `*${user?.name || 'Sespri Pimpinan'}*\n`;
  msg += `_${user?.title || 'Sekretariat Pimpinan'}_`;

  return msg;
};

export const generateSingleAgendaWADraft = (agenda, contact, user) => {
  const pimpinanTitle = user?.pimpinanTitle || 'Bapak/Ibu Pimpinan';
  let msg = `*Pengingat Agenda Kegiatan*\n\n`;
  msg += `Yth. *${contact?.name || 'Bapak/Ibu'}*,\n\n`;
  msg += `Menginformasikan pengingat jadwal kegiatan bersama ${pimpinanTitle}:\n\n`;
  msg += `📌 *Agenda:* ${agenda.title}\n`;
  msg += `🗓️ *Tanggal:* ${formatIndonesianDate(agenda.date)}\n`;
  msg += `⏰ *Waktu:* ${agenda.startTime} - ${agenda.endTime} WITA\n`;
  msg += `📍 *Lokasi:* ${agenda.location}\n`;
  if (agenda.isOnline && agenda.meetingUrl) {
    msg += `💻 *Link Zoom/Meeting:* ${agenda.meetingUrl}\n`;
  }
  if (agenda.notes) {
    msg += `📝 *Catatan:* ${agenda.notes}\n`;
  }
  msg += `\nMohon hadir 15 menit sebelum acara dimulai.\n\n`;
  msg += `Salam hormat,\n`;
  msg += `*${user?.name || 'Sespri'}*\n`;
  msg += `_${user?.department || 'Sekretariat Pimpinan'}_`;

  return msg;
};
