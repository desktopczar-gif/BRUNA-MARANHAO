
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, X, DollarSign } from 'lucide-react';
import { AppData, Appointment, AppointmentStatus, Procedure } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface SchedulePageProps {
  data: AppData;
  onAddAppointment: (apt: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onDeleteAppointment: (id: string) => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ data, onAddAppointment, onUpdateStatus, onDeleteAppointment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State
  const [selectedClientId, setSelectedClientId] = useState('');
  
  // Multi-procedure selection state
  const [currentProcedureId, setCurrentProcedureId] = useState('');
  const [selectedProcedures, setSelectedProcedures] = useState<Procedure[]>([]);
  const [customTotal, setCustomTotal] = useState<string>('');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');

  // Calculate total automatically when procedures change
  useEffect(() => {
    const total = selectedProcedures.reduce((sum, p) => sum + p.price, 0);
    setCustomTotal(total.toFixed(2));
  }, [selectedProcedures]);

  const handleAddProcedure = () => {
    const procedureToAdd = data.procedures.find(p => p.id === currentProcedureId);
    if (procedureToAdd) {
      // Allow duplicates? Usually not for the same appointment, but let's prevent exact ID duplicates for sanity
      if (!selectedProcedures.some(p => p.id === procedureToAdd.id)) {
        setSelectedProcedures([...selectedProcedures, procedureToAdd]);
      }
      setCurrentProcedureId(''); // Reset dropdown
    }
  };

  const handleRemoveProcedure = (procedureId: string) => {
    setSelectedProcedures(selectedProcedures.filter(p => p.id !== procedureId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = data.clients.find(c => c.id === selectedClientId);

    if (client && selectedProcedures.length > 0) {
      // Construct a combined name and ID for the record
      const combinedProcedureName = selectedProcedures.map(p => p.name).join(' + ');
      const combinedProcedureIds = selectedProcedures.map(p => p.id).join(',');
      const finalPrice = parseFloat(customTotal) || 0;

      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        clientId: client.id,
        clientName: client.name,
        procedureId: combinedProcedureIds, // Storing multiple IDs as comma separated
        procedureName: combinedProcedureName,
        price: finalPrice,
        date,
        time,
        status: AppointmentStatus.SCHEDULED,
      };
      onAddAppointment(newAppointment);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form
    setSelectedClientId('');
    setSelectedProcedures([]);
    setCurrentProcedureId('');
    setCustomTotal('');
    setTime('09:00');
  };

  const filteredAppointments = data.appointments
    .filter(a => a.date === filterDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const totalDaily = filteredAppointments
    .filter(a => a.status !== AppointmentStatus.CANCELLED)
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-brand-800 font-bold">Agenda</h2>
          <p className="text-brand-500">Gerencie seus atendimentos do dia.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-700 text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-brand-800 transition shadow-lg"
        >
          <Plus size={20} /> Novo Agendamento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-brand-100">
        <div className="flex items-center gap-4 mb-6">
          <label className="font-bold text-brand-700">Data:</label>
          <input 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)}
            className="border-brand-200 rounded-md shadow-sm focus:border-brand-500 focus:ring focus:ring-brand-200 p-2"
          />
          <div className="ml-auto text-sm md:text-base font-medium text-brand-600">
            Previsão do dia: <span className="font-bold text-brand-800">{CURRENCY_FORMATTER.format(totalDaily)}</span>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-brand-400 italic">
              Nenhum agendamento para este dia.
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div key={apt.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-brand-50 rounded-lg border-l-4 border-brand-500 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-3 md:mb-0">
                  <div className="bg-white p-2 rounded text-brand-700 font-bold font-mono">
                    {apt.time}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-brand-900">{apt.clientName}</h3>
                    <p className="text-brand-600 text-sm">{apt.procedureName} - {CURRENCY_FORMATTER.format(apt.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                   {apt.status === AppointmentStatus.SCHEDULED && (
                     <button 
                       onClick={() => onUpdateStatus(apt.id, AppointmentStatus.COMPLETED)}
                       className="text-green-600 hover:bg-green-50 p-2 rounded-full tooltip"
                       title="Marcar como realizado"
                     >
                       <CheckCircle size={20} />
                     </button>
                   )}
                   
                   <span className={`
                     px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                     ${apt.status === AppointmentStatus.SCHEDULED ? 'bg-blue-100 text-blue-700' : ''}
                     ${apt.status === AppointmentStatus.COMPLETED ? 'bg-green-100 text-green-700' : ''}
                     ${apt.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-700' : ''}
                   `}>
                     {apt.status}
                   </span>

                   <button 
                     onClick={() => onDeleteAppointment(apt.id)}
                     className="text-brand-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full ml-2"
                   >
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-brand-700 p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-serif font-bold text-xl">Novo Agendamento</h3>
              <button onClick={closeModal}><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Cliente</label>
                <select 
                  required 
                  className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="">Selecione um cliente...</option>
                  {data.clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {data.clients.length === 0 && <p className="text-xs text-red-500 mt-1">Cadastre clientes primeiro.</p>}
              </div>

              {/* Multi-Procedure Selection */}
              <div className="bg-brand-50 p-4 rounded-lg border border-brand-100">
                <label className="block text-sm font-medium text-brand-700 mb-2">Serviços</label>
                
                <div className="flex gap-2 mb-3">
                  <select 
                    className="flex-1 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    value={currentProcedureId}
                    onChange={(e) => setCurrentProcedureId(e.target.value)}
                  >
                    <option value="">Selecione para adicionar...</option>
                    {data.procedures.map(p => (
                      <option key={p.id} value={p.id}>{p.category} - {p.name} ({CURRENCY_FORMATTER.format(p.price)})</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={handleAddProcedure}
                    disabled={!currentProcedureId}
                    className="bg-brand-600 text-white p-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {selectedProcedures.length === 0 ? (
                    <p className="text-xs text-brand-400 italic text-center py-2">Nenhum serviço selecionado</p>
                  ) : (
                    selectedProcedures.map((proc, idx) => (
                      <div key={`${proc.id}-${idx}`} className="flex items-center justify-between bg-white p-2 rounded border border-brand-200 shadow-sm text-sm">
                        <span className="text-brand-800 font-medium truncate flex-1 mr-2">{proc.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-brand-600">{CURRENCY_FORMATTER.format(proc.price)}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveProcedure(proc.id)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedProcedures.length > 0 && (
                   <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-200">
                      <label className="text-sm font-bold text-brand-700">Total:</label>
                      <div className="relative w-32">
                        <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-brand-400" />
                        <input 
                          type="number" 
                          min="0"
                          step="0.01"
                          required
                          value={customTotal}
                          onChange={(e) => setCustomTotal(e.target.value)}
                          className="w-full pl-6 pr-2 py-1 border border-brand-300 rounded text-right font-bold text-brand-800 focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                      </div>
                   </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-brand-700 mb-1">Data</label>
                   <input 
                     type="date" 
                     required 
                     className="w-full border rounded-lg p-2.5 outline-none focus:ring-brand-500"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-brand-700 mb-1">Hora</label>
                   <input 
                     type="time" 
                     required 
                     className="w-full border rounded-lg p-2.5 outline-none focus:ring-brand-500"
                     value={time}
                     onChange={(e) => setTime(e.target.value)}
                   />
                </div>
              </div>

              <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={selectedProcedures.length === 0}
                    className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    Confirmar Agendamento
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
