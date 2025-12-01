import React, { useEffect, useState, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import SchedulePage from './pages/SchedulePage';
import ClientsPage from './pages/ClientsPage';
import ProceduresPage from './pages/ProceduresPage';
import FinancePage from './pages/FinancePage';
import SettingsPage from './pages/SettingsPage';
import { loadData, saveData } from './services/storageService';
import { AppData, Appointment, AppointmentStatus, Client, Procedure } from './types';

function App() {
  const [data, setData] = useState<AppData>({ clients: [], procedures: [], appointments: [] });
  const [loaded, setLoaded] = useState(false);
  
  // Track which appointments have already triggered a notification to avoid duplicates
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const storedData = loadData();
    setData(storedData);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveData(data);
    }
  }, [data, loaded]);

  // Notification Logic
  useEffect(() => {
    const checkInterval = setInterval(() => {
      // Only proceed if browser supports notifications and permission is granted
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const now = new Date();
      
      data.appointments.forEach(apt => {
        // Only check active appointments
        if (apt.status !== AppointmentStatus.SCHEDULED) return;

        // Parse appointment date and time carefully
        const [year, month, day] = apt.date.split('-').map(Number);
        const [hours, minutes] = apt.time.split(':').map(Number);
        const aptDate = new Date(year, month - 1, day, hours, minutes);

        // Calculate difference in minutes
        const diffMs = aptDate.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);

        // Define triggers: 15 minutes before and 0 minutes (now)
        const triggers = [15, 0];

        triggers.forEach(triggerTime => {
          // Check if we are within the minute of the trigger (using exact match on rounded int)
          if (diffMins === triggerTime) {
            const notificationKey = `${apt.id}-${triggerTime}`;
            
            if (!notifiedRef.current.has(notificationKey)) {
              // Determine message
              const title = triggerTime === 0 
                ? `⏰ Atendimento Agora: ${apt.clientName}` 
                : `⏳ Atendimento em ${triggerTime} min: ${apt.clientName}`;
              
              const body = `${apt.procedureName} agendado para as ${apt.time}.`;

              try {
                new Notification(title, { 
                  body,
                  icon: '/favicon.ico', // Tries to use favicon if available
                  tag: notificationKey // Prevent duplicate notifications visually on some OS
                });
              } catch (e) {
                console.error("Erro ao enviar notificação:", e);
              }

              // Mark as notified
              notifiedRef.current.add(notificationKey);
            }
          }
        });
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [data.appointments]); // Re-run effect if appointments change to ensure we have latest data

  const addAppointment = (apt: Appointment) => {
    setData(prev => ({
      ...prev,
      appointments: [...prev.appointments, apt]
    }));
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setData(prev => ({
      ...prev,
      appointments: prev.appointments.map(a => a.id === id ? { ...a, status } : a)
    }));
  };

  const deleteAppointment = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      setData(prev => ({
        ...prev,
        appointments: prev.appointments.filter(a => a.id !== id)
      }));
    }
  };

  const addClient = (client: Client) => {
    setData(prev => ({
      ...prev,
      clients: [...prev.clients, client]
    }));
  };

  const updateProcedure = (proc: Procedure) => {
    setData(prev => ({
      ...prev,
      procedures: prev.procedures.map(p => p.id === proc.id ? proc : p)
    }));
  };

  const addProcedure = (proc: Procedure) => {
    setData(prev => ({
      ...prev,
      procedures: [...prev.procedures, proc]
    }));
  };

  const importDataHandler = (newData: AppData) => {
    setData(newData);
  };

  if (!loaded) return <div className="h-screen w-screen flex items-center justify-center bg-brand-50 text-brand-600 font-serif text-xl">Carregando...</div>;

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={
            <SchedulePage 
              data={data} 
              onAddAppointment={addAppointment}
              onUpdateStatus={updateAppointmentStatus}
              onDeleteAppointment={deleteAppointment}
            />
          } />
          <Route path="/clients" element={<ClientsPage data={data} onAddClient={addClient} />} />
          <Route path="/procedures" element={<ProceduresPage data={data} onUpdateProcedure={updateProcedure} onAddProcedure={addProcedure} />} />
          <Route path="/finance" element={<FinancePage data={data} />} />
          <Route path="/settings" element={<SettingsPage data={data} onImport={importDataHandler} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;