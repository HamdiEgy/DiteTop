
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login({ email, password });
    if (user) {
      navigate('/profile');
    } else {
      addToast(t('loginFailed'));
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-4xl font-bold text-text-primary mb-2 font-tajawal">{t('loginTitle')}</h2>
        <p className="text-md text-text-secondary">{t('loginSubtitle')}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">{t('email')}</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">{t('password')}</label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end">
                <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">{t('forgotPassword')}</Link>
                </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:bg-gray-400"
              >
                {loading ? '...' : t('signIn')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-secondary">{t('orContinueWith')}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => console.log('Google login clicked')}
                  className="w-full inline-flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <i className="fab fa-google text-red-500 fa-lg ltr:mr-3 rtl:ml-3 self-center"></i>
                  <span>{t('continueWithGoogle')}</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => console.log('Facebook login clicked')}
                  className="w-full inline-flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] transition-colors"
                >
                  <i className="fab fa-facebook-f fa-lg ltr:mr-3 rtl:ml-3 self-center"></i>
                  <span>{t('continueWithFacebook')}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-text-secondary">
              {t('noAccount')}{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary-dark">{t('signUp')}</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
