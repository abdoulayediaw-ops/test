
import React from 'react';
import { Check, X, ShieldAlert, Package, Calendar, User as UserIcon } from 'lucide-react';
import { AppData, User, Movement } from '../types';

interface ValidationsProps {
  data: AppData;
  updateData: (data: AppData) => void;
  user: User;
}

const Validations: React.FC<ValidationsProps> = ({ data, updateData, user }) => {
  if (user.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
        <ShieldAlert className="h-16 w-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-500">Accès Refusé</h3>
        <p className="text-slate-400 mt-2">Vous n'avez pas les droits nécessaires pour accéder à cet espace.</p>
      </div>
    );
  }

  const pendingMovements = data.movements.filter(m => m.status === 'PENDING');

  const handleValidation = (id: string, action: 'VALIDATE' | 'REJECT') => {
    const updatedMovements = data.movements.map(m => {
      if (m.id === id) {
        return { ...m, status: action === 'VALIDATE' ? 'VALIDATED' : 'REJECTED' as any };
      }
      return m;
    });

    // Update warehouse stock if validated
    let updatedWarehouses = [...data.warehouses];
    if (action === 'VALIDATE') {
      const movement = data.movements.find(m => m.id === id)!;
      updatedWarehouses = data.warehouses.map(w => {
        if (w.id === movement.warehouseId) {
          const currentStock = w.stock[movement.crop] || 0;
          const newQty = movement.type === 'ENTREE' 
            ? currentStock + movement.weight 
            : currentStock - movement.weight;
          
          if (newQty < 0 && movement.type === 'SORTIE') {
            alert(`Attention: Stock insuffisant pour ${movement.crop} dans l'entrepôt ${w.name}`);
            return w;
          }
          
          return {
            ...w,
            stock: { ...w.stock, [movement.crop]: newQty }
          };
        }
        return w;
      });
    }

    updateData({
      ...data,
      movements: updatedMovements,
      warehouses: updatedWarehouses
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center gap-4">
        <div className="bg-amber-100 p-3 rounded-2xl">
          <ShieldAlert className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-amber-900">Espace Validation</h3>
          <p className="text-sm text-amber-700">Vous avez <span className="font-black underline">{pendingMovements.length}</span> opérations en attente de traitement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingMovements.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400">
            Aucun mouvement en attente.
          </div>
        ) : (
          pendingMovements.map((m) => {
            const wh = data.warehouses.find(w => w.id === m.warehouseId);
            return (
              <div key={m.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${m.type === 'ENTREE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {m.type}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                    <Calendar className="h-3 w-3" />
                    {new Date(m.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-black text-2xl text-slate-900">{m.weight.toLocaleString()} kg</h4>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{m.crop} • {m.bags} sacs</p>
                </div>

                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 font-medium truncate">{wh?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 truncate"><span className="font-bold">Auteur:</span> {m.createdBy}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleValidation(m.id, 'REJECT')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors"
                  >
                    <X className="h-4 w-4" /> Rejeter
                  </button>
                  <button 
                    onClick={() => handleValidation(m.id, 'VALIDATE')}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-colors"
                  >
                    <Check className="h-4 w-4" /> Valider
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Validations;
