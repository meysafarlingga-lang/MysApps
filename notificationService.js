// Notification and Auto Reminder Service for MySESPRI

class NotificationService {
  constructor() {
    this.listeners = [];
    this.timer = null;
    this.notifiedAgendaIds = new Set();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(notification) {
    this.listeners.forEach(cb => cb(notification));
  }

  requestBrowserPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.permission !== 'granted' && Notification.requestPermission();
    }
  }

  showBrowserNotification(title, options) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, options);
      } catch (e) {
        console.log('Browser notification error:', e);
      }
    }
  }

  startAutoReminder(getAgendasCallback) {
    this.requestBrowserPermission();
    
    // Check every 30 seconds
    if (this.timer) clearInterval(this.timer);
    
    const checkFn = () => {
      const agendas = getAgendasCallback();
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      agendas.forEach(item => {
        if (item.date !== todayStr || item.status === 'Selesai' || item.status === 'Dibatalkan') return;

        const [h, m] = item.startTime.split(':').map(Number);
        const agendaMinutes = h * 60 + m;
        const diffMinutes = agendaMinutes - currentMinutes;

        const reminderWindow = item.reminderMinutes || 15;
        const reminderKey = `${item.id}-${reminderWindow}-${item.date}`;

        // Trigger if within 0 to reminderWindow minutes and not yet notified
        if (diffMinutes >= 0 && diffMinutes <= reminderWindow && !this.notifiedAgendaIds.has(reminderKey)) {
          this.notifiedAgendaIds.add(reminderKey);
          
          const notif = {
            id: Date.now(),
            title: `⏰ Pengingat Agenda: ${item.title}`,
            message: `Agenda dimulai dalam ${diffMinutes} menit (${item.startTime} WITA) di ${item.location}.`,
            agenda: item,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          };

          // Audio chime using Web Audio API
          this.playChimeSound();

          // Internal app toast notify
          this.notify(notif);

          // Browser notification
          this.showBrowserNotification(notif.title, {
            body: notif.message,
            icon: '/favicon.ico'
          });
        }
      });
    };

    checkFn();
    this.timer = setInterval(checkFn, 30000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  playChimeSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.log('Audio autoplay prevented:', e);
    }
  }
}

export const notificationService = new NotificationService();
