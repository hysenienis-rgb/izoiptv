import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle, Tv } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Input } from '../components/ui/input';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/login`, credentials);
      localStorage.setItem('izo-admin-token', response.data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-12">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 mb-4">
              <Tv className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-['Outfit']">{t('admin.login')}</h1>
            <p className="text-slate-400 text-sm mt-2">Izo IPTV Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('admin.username')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                  className="w-full input-dark rounded-xl pl-12 pr-4 py-3"
                  placeholder={t('admin.username')}
                  data-testid="admin-username-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('admin.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  className="w-full input-dark rounded-xl pl-12 pr-4 py-3"
                  placeholder={t('admin.password')}
                  data-testid="admin-password-input"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-4 rounded-xl bg-red-500/20 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="admin-login-btn"
            >
              {loading ? 'Loading...' : t('admin.login_btn')}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Default credentials: admin / admin123
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
