
import React, { useState } from 'react';
import { UserPlus, User as UserIcon, Shield, Key, Trash2, Search, UserCheck } from 'lucide-react';
import { AppData, User, Role } from '../types';

interface UserManagementProps {
  data: AppData;
  updateData: (data: AppData) => void;
  user: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ data, updateData, user: currentUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    login: '',
    pass: '',
    role: 'USER'
  });

  if (currentUser.role !== 'ADMIN') {
    return <div className="text-center py-20">Accès réservé aux administrateurs.</div>;
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = {
      ...newUser as User,
      id: `u${Date.now()}`
    };
    updateData({
      ...data,
      users: [...data.users, user]
    });
    setShowModal(false);
    setNewUser({ name: '', login: '', pass: '', role: 'USER' });
  };

  const deleteUser = (id: string) => {
    if (id === '1') {
      alert("Le compte administrateur racine ne peut pas être supprimé.");
      return;
    }
    if (confirm("Supprimer cet utilisateur ?")) {
      updateData({
        ...data,
        users: data.users.filter(u => u.id !== id)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Gestion des Utilisateurs</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-blue-100 transition-all"
        >
          <UserPlus className="h-5 w-5" />
          Nouveau Membre
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest text-left">
                <th className="px-6 py-4">Nom Complet</th>
                <th className="px-6 py-4">Identifiant</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Mot de passe</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{u.login}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">••••••••</td>
                  <td className="px-6 py-4 text-right">
                    {u.id !== '1' && (
                      <button 
                        onClick={() => deleteUser(u.id)}
                        className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Nouveau Compte</h3>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white transition-colors">
                <Plus className="h-6 w-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Login (Identifiant)</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  value={newUser.login}
                  onChange={e => setNewUser({...newUser, login: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                <input 
                  type="password" 
                  required 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  value={newUser.pass}
                  onChange={e => setNewUser({...newUser, pass: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
                <select 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
                >
                  <option value="USER">Magasinier (Saisie)</option>
                  <option value="ADMIN">SuperAdmin (Validation)</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all mt-6"
              >
                Créer l'utilisateur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for closing modal
const Plus = ({ className, ...props }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <path d="M5 12h14M12 5v14" />
  </svg>
);

export default UserManagement;
