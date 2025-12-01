import { AppData, Appointment, Client, Procedure } from '../types';
import { INITIAL_PROCEDURES } from '../constants';

const STORAGE_KEY = 'bruna_maranhao_app_v1';

const getInitialData = (): AppData => {
  return {
    clients: [],
    procedures: INITIAL_PROCEDURES,
    appointments: []
  };
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getInitialData();
    const parsed = JSON.parse(stored);
    
    // Ensure structure integrity merge with defaults if needed
    return {
        ...getInitialData(),
        ...parsed,
        procedures: parsed.procedures.length > 0 ? parsed.procedures : INITIAL_PROCEDURES
    };
  } catch (e) {
    console.error("Failed to load data", e);
    return getInitialData();
  }
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = (data: AppData) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_bruna_maranhao_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        if (parsed.clients && parsed.procedures && parsed.appointments) {
          resolve(parsed);
        } else {
          reject(new Error("Formato de arquivo inválido"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};