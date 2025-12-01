import React, { useRef } from 'react';
import { Download, Upload, Database, AlertCircle, Bell, CheckCircle } from 'lucide-react';
import { AppData } from '../types';
import { exportData, importData } from '../services/storageService';

interface SettingsPageProps {
  data: AppData;
  onImport: (data: AppData) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm("Isso substituirá todos os dados atuais pelos do backup. Deseja continuar?")) {
      try {
        const importedData = await importData(file);
        onImport(importedData);
        alert("Backup restaurado com sucesso!");
      } catch (err) {
        alert("Erro ao ler arquivo de backup. Verifique se o formato está correto.");
        console.error(err);
      }
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      alert("Este navegador não suporta notificações.");
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Notificações Ativadas!", { body: "Você será avisado 15 minutos antes de cada agendamento." });
        } else if (permission === "denied") {
          alert("As notificações foram bloqueadas. Por favor, habilite-as nas configurações do navegador para receber alertas.");
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-brand-800 font-bold">Configurações</h2>
        <p className="text-brand-500">Segurança e notificações do sistema.</p>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl shadow-sm border border-brand-100 p-8">
        <div className="flex items-center gap-3 mb-6 text-brand-700">
          <Bell size={24} />
          <h3 className="text-xl font-bold">Notificações</h3>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm text-brand-500 max-w-2xl">
                O sistema pode enviar alertas automáticos 15 minutos antes de cada atendimento e no horário exato do agendamento. 
                Para isso funcionar, você precisa permitir as notificações no seu navegador.
            </p>
            <button 
                onClick={requestNotificationPermission}
                className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition flex items-center gap-2 whitespace-nowrap"
            >
                <CheckCircle size={18} />
                Ativar Notificações
            </button>
        </div>
      </div>

      {/* Backup Section */}
      <div className="bg-white rounded-xl shadow-sm border border-brand-100 p-8">
        <div className="flex items-center gap-3 mb-6 text-brand-700">
          <Database size={24} />
          <h3 className="text-xl font-bold">Backup & Restauração</h3>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-yellow-700">
              Faça backups regulares para garantir que você nunca perca seus dados. 
              O backup gera um arquivo que você pode salvar no seu computador ou celular.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-brand-200 rounded-xl p-6 flex flex-col items-center text-center hover:border-brand-400 transition cursor-pointer bg-brand-50"
               onClick={() => exportData(data)}>
            <div className="h-16 w-16 bg-brand-200 rounded-full flex items-center justify-center text-brand-700 mb-4">
              <Download size={32} />
            </div>
            <h4 className="font-bold text-lg text-brand-800 mb-2">Fazer Backup</h4>
            <p className="text-sm text-brand-500">Baixar cópia de todos os dados (Clientes, Agendamentos e Preços).</p>
            <button className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
              Baixar Arquivo
            </button>
          </div>

          <div className="border border-brand-200 rounded-xl p-6 flex flex-col items-center text-center hover:border-brand-400 transition cursor-pointer relative bg-white">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-4">
              <Upload size={32} />
            </div>
            <h4 className="font-bold text-lg text-brand-800 mb-2">Restaurar Dados</h4>
            <p className="text-sm text-brand-500">Carregar um arquivo de backup salvo anteriormente.</p>
            <button className="mt-4 px-4 py-2 border border-brand-300 text-brand-700 rounded-lg hover:bg-brand-50">
              Selecionar Arquivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;