
import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Download, 
  Search, 
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { AppData, Movement, User, MovementType } from '../types';
import { CROPS } from '../constants';

interface MovementsProps {
  data: AppData;
  updateData: (data: AppData) => void;
  user: User;
}

const Movements: React.FC<MovementsProps> = ({ data, updateData, user }) => {
  const [newMovement, setNewMovement] = useState<Partial<Movement>>({
    type: 'ENTREE',
    warehouseId: data.warehouses[0]?.id || '',
    crop: CROPS[0],
    bags: 0,
    weight: 0
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const movement: Movement = {
      ...newMovement as Movement,
      id: `m${Date.now()}`,
      date: new Date().toISOString(),
      status: 'PENDING',
      createdBy: user.name
    };
    updateData({
      ...data,
      movements: [movement, ...data.movements]
    });
    setNewMovement({ ...newMovement, bags: 0, weight: 0 });
    alert("Mouvement enregistré ! En attente de validation par un administrateur.");
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Entrepôt', 'Culture', 'Sacs', 'Poids', 'Statut', 'Auteur'];
    const rows = data.movements.map(m => {
      const wh = data.warehouses.find(w => w.id === m.warehouseId)?.name || 'Inconnu';
      return [m.id, m.date, m.type, wh, m.crop, m.bags, m.weight, m.status, m.createdBy];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rapport_mouvements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const sortedMovements = [...data.movements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* New Movement Form */}
      <div className="xl:col-span-4">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
          <div className="bg-emerald-600 p-6 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5" />
              Nouveau Mouvement
            </h3>
          </div>
          <form onSubmit={handleCreate} className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Type d'opération</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setNewMovement({...newMovement, type: 'ENTREE'})}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${newMovement.type === 'ENTREE' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                >
                  <ArrowDownLeft className="h-4 w-4" /> Entrée
                </button>
                <button 
                  type="button" 
                  onClick={() => setNewMovement({...newMovement, type: 'SORTIE'})}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold ${newMovement.type === 'SORTIE' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                >
                  <ArrowUpRight className="h-4 w-4" /> Sortie
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Entrepôt</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={newMovement.warehouseId}
                  onChange={e => setNewMovement({...newMovement, warehouseId: e.target.value})}
                  required
                >
                  {data.warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Culture</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={newMovement.crop}
                  onChange={e => setNewMovement({...newMovement, crop: e.target.value})}
                  required
                >
                  {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nombre de Sacs</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newMovement.bags}
                    onChange={e => setNewMovement({...newMovement, bags: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Poids Total (kg)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={newMovement.weight}
                    onChange={e => setNewMovement({...newMovement, weight: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all mt-4"
            >
              Enregistrer le Mouvement
            </button>
          </form>
        </div>
      </div>

      {/* History List */}
      <div className="xl:col-span-8 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <History className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Historique des Mouvements</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Temps réel</p>
              </div>
            </div>
            <button 
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 text-emerald-600 font-bold px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <Download className="h-4 w-4" />
              Exporter CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-left">
                  <th className="px-6 py-4">Date & Heure</th>
                  <th className="px-6 py-4">Opération</th>
                  <th className="px-6 py-4">Entrepôt</th>
                  <th className="px-6 py-4">Produit</th>
                  <th className="px-6 py-4">Quantité</th>
                  <th className="px-6 py-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedMovements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Aucun mouvement enregistré</td>
                  </tr>
                ) : (
                  sortedMovements.map((m) => {
                    const wh = data.warehouses.find(w => w.id === m.warehouseId)?.name || 'Inconnu';
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700">{new Date(m.date).toLocaleDateString()}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${m.type === 'ENTREE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {m.type === 'ENTREE' ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                            {m.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-600">{wh}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-800">{m.crop}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900">{m.weight.toLocaleString()} kg</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.bags} sacs</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {m.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-bold uppercase">
                              <Clock className="h-3 w-3" /> En attente
                            </span>
                          )}
                          {m.status === 'VALIDATED' && (
                            <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-bold uppercase">
                              <CheckCircle2 className="h-3 w-3" /> Validé
                            </span>
                          )}
                          {m.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold uppercase">
                              <XCircle className="h-3 w-3" /> Rejeté
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movements;
