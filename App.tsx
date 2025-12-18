
import React, { useState, useEffect } from 'react';
import { User, AppData, Warehouse, Movement } from './types';
import { INITIAL_DATA } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Warehouses from './components/Warehouses';
import Movements from './components/Movements';
import Validations from './components/Validations';
import UserManagement from './components/UserManagement';
import WarehouseMap from './components/WarehouseMap';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('orsre_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('orsre_data', JSON.stringify(data));
  }, [data]);

  const handleLogin = (login: string, pass: string): boolean => {
    const foundUser = data.users.find(u => u.login === login && u.pass === pass);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const updateData = (newData: AppData) => setData(newData);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard data={data} user={user} />;
      case 'map': return <WarehouseMap warehouses={data.warehouses} />;
      case 'warehouses': return <Warehouses data={data} updateData={updateData} user={user} />;
      case 'movements': return <Movements data={data} updateData={updateData} user={user} />;
      case 'validations': return <Validations data={data} updateData={updateData} user={user} />;
      case 'users': return <UserManagement data={data} updateData={updateData} user={user} />;
      default: return <Dashboard data={data} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user} 
        onLogout={logout}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-emerald-800 capitalize">
            {currentView === 'dashboard' ? 'Tableau de bord' : currentView}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
