
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Warehouse, Package, Clock, Sparkles, TrendingUp } from 'lucide-react';
import { AppData, User } from '../types';
import { getAIInsights } from '../services/geminiService';

interface DashboardProps {
  data: AppData;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ data, user }) => {
  const [aiInsight, setAiInsight] = useState<string>('Analyse en cours par Gemini IA...');
  const [loadingAI, setLoadingAI] = useState(true);

  const stats = useMemo(() => {
    let totalStockKg = 0;
    const cropTotals: Record<string, number> = {};

    data.warehouses.forEach(w => {
      Object.entries(w.stock).forEach(([crop, qty]) => {
        // Fix for lines 32-33: Explicitly cast qty to number to prevent operator errors with 'unknown' type
        const quantity = qty as number;
        totalStockKg += quantity;
        cropTotals[crop] = (cropTotals[crop] || 0) + quantity;
      });
    });

    const chartData = Object.entries(cropTotals).map(([name, value]) => ({
      name,
      value: Math.round(value / 1000) // in Tons
    }));

    return {
      warehouseCount: data.warehouses.length,
      totalTons: (totalStockKg / 1000).toFixed(1),
      pendingCount: data.movements.filter(m => m.status === 'PENDING').length,
      chartData
    };
  }, [data]);

  useEffect(() => {
    const fetchAI = async () => {
      setLoadingAI(true);
      const insight = await getAIInsights(data);
      setAiInsight(insight || 'Aucune recommandation pour le moment.');
      setLoadingAI(false);
    };
    fetchAI();
  }, [data]);

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-slate-500 text-sm font-medium">Entrepôts Actifs</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.warehouseCount}</h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl">
            <Warehouse className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 opacity-5">
            <Warehouse className="h-24 w-24 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-slate-500 text-sm font-medium">Stock Global (Tons)</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.totalTons}</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 opacity-5">
            <Package className="h-24 w-24 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-slate-500 text-sm font-medium">Validations en Attente</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats.pendingCount}</h3>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <div className="absolute -bottom-2 -right-2 opacity-5">
            <Clock className="h-24 w-24 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h4 className="font-bold text-slate-800">Répartition des Stocks par Culture (Tons)</h4>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gemini Insights */}
        <div className="bg-emerald-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h4 className="font-bold text-lg">IA Assistant ORSRE</h4>
            </div>
            <div className={`prose prose-invert max-w-none text-emerald-100/90 text-sm leading-relaxed ${loadingAI ? 'animate-pulse' : ''}`}>
              {aiInsight}
            </div>
            {!loadingAI && (
              <button 
                onClick={() => {
                  setLoadingAI(true);
                  getAIInsights(data).then(res => {
                    setAiInsight(res || 'Erreur lors du rafraîchissement.');
                    setLoadingAI(false);
                  });
                }}
                className="mt-6 text-xs font-bold uppercase tracking-widest text-emerald-300 hover:text-white transition-colors flex items-center gap-2"
              >
                Rafraîchir l'analyse
              </button>
            )}
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Sparkles className="h-32 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
