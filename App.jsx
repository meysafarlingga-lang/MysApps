import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationToast from './components/NotificationToast';
import ExecutiveDisplayModal from './components/ExecutiveDisplayModal';

import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import AgendaView from './views/AgendaView';
import WAReminderView from './views/WAReminderView';
import ContactsView from './views/ContactsView';
import ProfileView from './views/ProfileView';

import { db } from './services/db';
import { notificationService } from './services/notificationService';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => db.getCurrentUser());
  const [currentView, setCurrentView] = useState('dashboard');
  const [isExecutiveOpen, setIsExecutiveOpen] = useState(false);

  // App Data state
  const [agendas, setAgendas] = useState(() => db.getAgendas());
  const [contacts, setContacts] = useState(() => db.getContacts());

  const refreshData = () => {
    setAgendas(db.getAgendas());
    setContacts(db.getContacts());
    setCurrentUser(db.getCurrentUser());
  };

  // Start auto reminder check
  useEffect(() => {
    notificationService.startAutoReminder(() => db.getAgendas());
    return () => notificationService.stop();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    refreshData();
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleQuickUpdateStatus = (agendaId, newStatus) => {
    const agenda = db.getAgendaById(agendaId);
    if (agenda) {
      agenda.status = newStatus;
      db.saveAgenda(agenda);
      refreshData();
    }
  };

  // If not logged in, show Login Screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar for Desktop & Mobile Bottom Nav */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenExecutive={() => setIsExecutiveOpen(true)}
      />

      <div className="main-content">
        {/* Top Navbar */}
        <Navbar
          currentUser={currentUser}
          onOpenExecutive={() => setIsExecutiveOpen(true)}
          onOpenProfile={() => setCurrentView('profile')}
          onLogout={handleLogout}
        />

        {/* Dynamic Views */}
        <main>
          {currentView === 'dashboard' && (
            <DashboardView
              agendas={agendas}
              contacts={contacts}
              currentUser={currentUser}
              onOpenExecutive={() => setIsExecutiveOpen(true)}
              onNavigate={setCurrentView}
              onQuickUpdateStatus={handleQuickUpdateStatus}
            />
          )}

          {currentView === 'agendas' && (
            <AgendaView
              agendas={agendas}
              contacts={contacts}
              onRefresh={refreshData}
            />
          )}

          {currentView === 'wa-generator' && (
            <WAReminderView
              agendas={agendas}
              contacts={contacts}
              currentUser={currentUser}
            />
          )}

          {currentView === 'contacts' && (
            <ContactsView
              contacts={contacts}
              onRefresh={refreshData}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}
        </main>
      </div>

      {/* Real-time Reminder Toast Overlay */}
      <NotificationToast />

      {/* Fullscreen TV Mode for Leader's Screen */}
      <ExecutiveDisplayModal
        isOpen={isExecutiveOpen}
        onClose={() => setIsExecutiveOpen(false)}
        agendas={agendas}
        currentUser={currentUser}
      />
    </div>
  );
}
