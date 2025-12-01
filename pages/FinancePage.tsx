import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppData, AppointmentStatus } from '../types';
import { CURRENCY_FORMATTER } from '../constants';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface FinancePageProps {
  data: AppData;
}

interface MonthlyMetric {
  name: string;
  total: number;
  count: number;
  sortKey: number;
}

const FinancePage: React.FC<FinancePageProps> = ({ data }) => {
  // Aggregate data by month
  const monthlyData = data.appointments
    .filter(a => a.status === AppointmentStatus.COMPLETED)
    .reduce((acc, curr) => {
      const date = new Date(curr.date);
      const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
      // Sort key for logic, display label for UI
      if (!acc[key]) {
        acc[key] = { name: key, total: 0, count: 0, sortKey: date.getTime() };
      }
      acc[key].total += curr.price;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, MonthlyMetric>);

  const chartData: MonthlyMetric[] = (Object.values(monthlyData) as MonthlyMetric[]).sort((a, b) => a.sortKey - b.sortKey);

  // Totals
  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.total, 0);
  const totalAppointments = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const currentMonth = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
  const currentMonthRevenue = monthlyData[currentMonth]?.total || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-brand-800 font-bold">Financeiro</h2>
        <p className="text-brand-500">Visão geral do faturamento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-brand-700 to-brand-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <DollarSign size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Faturamento Total</span>
          </div>
          <div className="text-3xl font-bold font-serif">{CURRENCY_FORMATTER.format(totalRevenue)}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-100">
          <div className="flex items-center gap-3 mb-2 text-brand-500">
            <Calendar size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Este Mês</span>
          </div>
          <div className="text-3xl font-bold text-brand-800 font-serif">{CURRENCY_FORMATTER.format(currentMonthRevenue)}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-brand-100">
          <div className="flex items-center gap-3 mb-2 text-brand-500">
            <TrendingUp size={20} />
            <span className="text-sm font-medium uppercase tracking-wide">Atendimentos Realizados</span>
          </div>
          <div className="text-3xl font-bold text-brand-800 font-serif">{totalAppointments}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-100 h-96">
        <h3 className="font-bold text-brand-800 mb-6">Faturamento Mensal</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#efebe9" />
              <XAxis dataKey="name" stroke="#a1887f" tick={{fill: '#795548'}} />
              <YAxis stroke="#a1887f" tick={{fill: '#795548'}} tickFormatter={(value) => `R$${value}`} />
              <Tooltip 
                formatter={(value: number) => [CURRENCY_FORMATTER.format(value), 'Faturamento']}
                contentStyle={{ backgroundColor: '#fff', borderColor: '#d7ccc8', borderRadius: '8px' }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#8d6e63" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-brand-300">
            Sem dados financeiros para exibir.
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancePage;