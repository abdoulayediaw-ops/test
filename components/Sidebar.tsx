
import React from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Warehouse, 
  ArrowLeftRight, 
  CheckCircle2, 
  Users, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User, Role } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  user: User;
  onLogout: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, user, onLogout, isOpen, toggleSidebar }) => {
  const isAdmin = user.role === 'ADMIN';

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'map', label: 'Géolocalisation', icon: MapIcon },
    { id: 'warehouses', label: 'Entrepôts', icon: Warehouse },
    { id: 'movements', label: 'Mouvements', icon: ArrowLeftRight },
  ];

  const adminItems = [
    { id: 'validations', label: 'Validations', icon: CheckCircle2 },
    { id: 'users', label: 'Gestion Membres', icon: Users },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-emerald-900 text-white transition-all duration-300 z-50 flex flex-col shadow-2xl ${isOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-emerald-800">
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
          <div className="bg-white rounded px-3 py-1">
             <span className="text-emerald-900 font-black text-lg">ORSRE</span>
          </div>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-emerald-800 rounded-lg transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
            }`}
            title={item.label}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className={`font-medium transition-all ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
              {item.label}
            </span>
          </button>
        ))}

        {isAdmin && (
          <>
            <div className={`mt-8 mb-2 px-4 transition-all ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400/60">Admin</span>
            </div>
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  currentView === item.id 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 shadow-lg' 
                    : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                }`}
                title={item.label}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={`font-medium transition-all ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-emerald-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-emerald-200 hover:bg-red-500/20 hover:text-red-300 transition-all"
          title="Déconnexion"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className={`font-medium transition-all ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
