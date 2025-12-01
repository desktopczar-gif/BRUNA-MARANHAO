import { Procedure } from './types';

export const INITIAL_PROCEDURES: Procedure[] = [
  { id: '1', name: 'Selagem Tradicional', category: 'SELAGEM', price: 150.00 },
  { id: '2', name: 'Selagem Promoção', category: 'SELAGEM PROMO', price: 100.00 },
  { id: '3', name: 'Pintura Completa', category: 'PINTURA', price: 120.00 },
  { id: '4', name: 'Retoque de Raiz', category: 'PINTURA', price: 80.00 },
  { id: '5', name: 'Luzes / Mechas', category: 'LUZES', price: 250.00 },
  { id: '6', name: 'Permanente Afro', category: 'PERMANENTE AFRO', price: 200.00 },
  { id: '7', name: 'Hidratação Profunda', category: 'TRATAMENTO', price: 80.00 },
  { id: '8', name: 'Botox Capilar', category: 'BOTOX', price: 120.00 },
  { id: '9', name: 'Cauterização', category: 'CAUTERIZAÇÃO', price: 150.00 },
  { id: '10', name: 'Escova Modelada', category: 'ESCOVA', price: 45.00 },
  { id: '11', name: 'Chapinha', category: 'CHAPINHA', price: 35.00 },
];

export const APP_LOGO_URL = "https://files.catbox.moe/example_placeholder.png"; // Placeholder if user provided fails, but we use the user's provided prompt logic in App structure.
export const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});