import React, { useState } from 'react';
import { Search, UserPlus, Phone, History, X } from 'lucide-react';
import { AppData, Client, AppointmentStatus } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface ClientsPageProps {
  data: AppData;
  onAddClient: (client: Client) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ data, onAddClient }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // New Client Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClient({
      id: crypto.randomUUID(),
      name,
      phone,
      createdAt: new Date().toISOString()
    });
    setIsAddModalOpen(false);
    setName('');
    setPhone('');
  };

  const filteredClients = data.clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const getClientHistory = (clientId: string) => {
    return data.appointments
      .filter(a => a.clientId === clientId && a.status === AppointmentStatus.COMPLETED)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-brand-800 font-bold">Clientes</h2>
          <p className="text-brand-500">Gerencie sua lista de contatos e histórico.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-700 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-brand-800 transition shadow-lg"
        >
          <UserPlus size={20} /> Adicionar Cliente
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-brand-100 flex items-center gap-2">
        <Search className="text-brand-400" />
        <input 
          type="text" 
          placeholder="Buscar por nome ou telefone..." 
          className="flex-1 outline-none text-brand-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-brand-50 group">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-serif font-bold text-xl">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <button 
                onClick={() => setSelectedClient(client)}
                className="text-brand-300 hover:text-brand-600 transition"
                title="Ver Histórico"
              >
                <History size={20} />
              </button>
            </div>
            <h3 className="font-bold text-lg text-brand-800 mb-1">{client.name}</h3>
            <div className="flex items-center text-brand-500 text-sm mb-4">
              <Phone size={14} className="mr-2" />
              {client.phone}
            </div>
            <div className="text-xs text-brand-400 pt-4 border-t border-brand-50">
              Cliente desde {new Date(client.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-serif font-bold text-brand-800 mb-4">Novo Cliente</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Nome Completo" required 
                className="w-full border border-brand-200 rounded-lg p-3 outline-none focus:border-brand-500"
                value={name} onChange={e => setName(e.target.value)}
              />
              <input 
                type="tel" placeholder="Telefone / WhatsApp" required 
                className="w-full border border-brand-200 rounded-lg p-3 outline-none focus:border-brand-500"
                value={phone} onChange={e => setPhone(e.target.value)}
              />
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-brand-700 text-white rounded-lg hover:bg-brand-800">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-brand-100 flex justify-between items-center bg-brand-50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-brand-800">{selectedClient.name}</h3>
                <p className="text-sm text-brand-500">Histórico de Procedimentos</p>
              </div>
              <button onClick={() => setSelectedClient(null)}><X className="text-brand-400 hover:text-brand-800" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {getClientHistory(selectedClient.id).length === 0 ? (
                <p className="text-center text-brand-400 py-8">Nenhum procedimento realizado ainda.</p>
              ) : (
                <ul className="space-y-4">
                  {getClientHistory(selectedClient.id).map(apt => (
                    <li key={apt.id} className="relative pl-6 border-l-2 border-brand-200 pb-2 last:pb-0">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-brand-500 border-2 border-white"></div>
                      <div className="text-xs font-bold text-brand-400 mb-1">{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="font-bold text-brand-800">{apt.procedureName}</div>
                      <div className="text-sm text-brand-600">{CURRENCY_FORMATTER.format(apt.price)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;