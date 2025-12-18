
import React, { useState } from 'react';
import { Lock, User as UserIcon, Loader2, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (login: string, pass: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [login, setLogin] = useState('orse');
  const [pass, setPass] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulate network delay for "realism" as requested
    setTimeout(() => {
      const success = onLogin(login, pass);
      if (!success) {
        setError(true);
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-700 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 transform transition-all">
        <div className="text-center mb-10">
          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <span className="text-2xl font-black text-emerald-700">ORSRE</span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                <span className="text-2xl font-black text-amber-500">TOLBI</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Bienvenue</h2>
          <p className="text-slate-500 mt-2">Accédez à votre espace de gestion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Identifiant</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                placeholder="Votre identifiant"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm animate-pulse">
              <AlertCircle className="h-4 w-4" />
              <span>Identifiants incorrects. Veuillez réessayer.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-slate-400">
          Système Sécurisé de Gestion des Récépissés © 2024
        </div>
      </div>
    </div>
  );
};

export default Login;
