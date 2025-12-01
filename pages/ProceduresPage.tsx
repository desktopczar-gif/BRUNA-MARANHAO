import React, { useState } from 'react';
import { Edit2, Save, X, Plus } from 'lucide-react';
import { AppData, Procedure } from '../types';
import { CURRENCY_FORMATTER } from '../constants';

interface ProceduresPageProps {
  data: AppData;
  onUpdateProcedure: (procedure: Procedure) => void;
  onAddProcedure: (procedure: Procedure) => void;
}

const ProceduresPage: React.FC<ProceduresPageProps> = ({ data, onUpdateProcedure, onAddProcedure }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  
  // New procedure state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('SELAGEM');
  const [newPrice, setNewPrice] = useState('');

  const categories = Array.from(new Set(data.procedures.map(p => p.category)));

  const startEdit = (p: Procedure) => {
    setEditingId(p.id);
    setEditPrice(p.price);
  };

  const saveEdit = (p: Procedure) => {
    onUpdateProcedure({ ...p, price: editPrice });
    setEditingId(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProcedure({
        id: crypto.randomUUID(),
        name: newName,
        category: newCategory,
        price: parseFloat(newPrice) || 0
    });
    setIsAdding(false);
    setNewName('');
    setNewPrice('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-brand-800 font-bold">Procedimentos</h2>
          <p className="text-brand-500">Gerencie seus serviços e tabela de preços.</p>
        </div>
        <button 
           onClick={() => setIsAdding(true)}
           className="bg-brand-600 text-white p-3 rounded-full shadow hover:bg-brand-700"
        >
            <Plus />
        </button>
      </div>

      {isAdding && (
          <div className="bg-white p-4 rounded-xl shadow border border-brand-200 mb-6 animate-fade-in">
              <h3 className="font-bold text-brand-800 mb-3">Novo Serviço</h3>
              <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                      <label className="text-xs font-bold text-brand-500">Nome</label>
                      <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full border rounded p-2" />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-brand-500">Categoria</label>
                      <input list="categories" required value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full border rounded p-2" />
                      <datalist id="categories">
                          {categories.map(c => <option key={c} value={c} />)}
                      </datalist>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-brand-500">Preço</label>
                      <input required type="number" min="0" step="0.01" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full border rounded p-2" />
                  </div>
                  <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-green-600 text-white p-2 rounded">Salvar</button>
                      <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-700 p-2 rounded">Cancelar</button>
                  </div>
              </form>
          </div>
      )}

      <div className="grid gap-6">
        {categories.map(category => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-brand-100 overflow-hidden">
            <div className="bg-brand-50 px-6 py-3 border-b border-brand-100">
              <h3 className="font-serif font-bold text-lg text-brand-800">{category}</h3>
            </div>
            <div className="divide-y divide-brand-50">
              {data.procedures.filter(p => p.category === category).map(procedure => (
                <div key={procedure.id} className="p-4 flex items-center justify-between hover:bg-brand-50/50 transition">
                  <span className="font-medium text-brand-900">{procedure.name}</span>
                  
                  <div className="flex items-center gap-3">
                    {editingId === procedure.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          className="w-24 border border-brand-300 rounded px-2 py-1 text-right focus:ring-brand-500 outline-none"
                          value={editPrice}
                          onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                          autoFocus
                        />
                        <button onClick={() => saveEdit(procedure)} className="text-green-600 p-1 hover:bg-green-50 rounded"><Save size={18}/></button>
                        <button onClick={() => setEditingId(null)} className="text-red-500 p-1 hover:bg-red-50 rounded"><X size={18}/></button>
                      </div>
                    ) : (
                      <>
                        <span className="font-bold text-brand-700">{CURRENCY_FORMATTER.format(procedure.price)}</span>
                        <button 
                          onClick={() => startEdit(procedure)}
                          className="text-brand-300 hover:text-brand-600 p-1"
                        >
                          <Edit2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProceduresPage;