
import React, { useState } from 'react';
import { Plus, MapPin, User as UserIcon, MoreVertical, Edit2, Trash2, Search } from 'lucide-react';
import { AppData, Warehouse, User, Role } from '../types';
import { REGIONS } from '../constants';

interface WarehousesProps {
  data: AppData;
  updateData: (data: AppData) => void;
  user: User;
}

const Warehouses: React.FC<WarehousesProps> = ({ data, updateData, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newWarehouse, setNewWarehouse] = useState<Partial<Warehouse>>({
    name: '',
    region: 'Dakar',
    manager: '',
    lat: 14.5,
    lng: -17.0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `w${Date.now()}`;
    const warehouse: Warehouse = {
      ...newWarehouse as Warehouse,
      id,
      stock: {}
    };
    updateData({
      ...data,
      warehouses: [...data.warehouses, warehouse]
    });
    setShowModal(false);
    setNewWarehouse({ name: '', region: 'Dakar', manager: '', lat: 14.5, lng: -17.0 });
  };

  const filteredWarehouses = data.warehouses.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un entrepôt, une région..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-100 transition-all"
        >
          <Plus className="h-5 w-5" />
          Nouvel Entrepôt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWarehouses.map((w) => (
          <div key={w.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
            
            <h5 className="font-bold text-lg text-slate-800 mb-1">{w.name}</h5>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold uppercase">{w.region}</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm">
                <UserIcon className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600"><span className="font-medium">Responsable:</span> {w.manager}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {Object.keys(w.stock).length > 0 ? (
                  Object.entries(w.stock).map(([crop, qty]) => (
                    <span key={crop} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg uppercase">
                      {crop}: {qty}kg
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg uppercase italic">
                    Aucun stock
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Ajouter un Entrepôt</h3>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white transition-colors">
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entrepôt</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="ex: Central Diamniadio"
                    value={newWarehouse.name}
                    onChange={e => setNewWarehouse({...newWarehouse, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Région</label>
                  <select 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newWarehouse.region}
                    onChange={e => setNewWarehouse({...newWarehouse, region: e.target.value})}
                  >
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Responsable</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Nom complet"
                    value={newWarehouse.manager}
                    onChange={e => setNewWarehouse({...newWarehouse, manager: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    required 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    value={newWarehouse.lat}
                    onChange={e => setNewWarehouse({...newWarehouse, lat: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                  <input 
                    type="number" 
                    step="0.0001" 
                    required 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    value={newWarehouse.lng}
                    onChange={e => setNewWarehouse({...newWarehouse, lng: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all mt-6"
              >
                Créer l'Entrepôt
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouses;
