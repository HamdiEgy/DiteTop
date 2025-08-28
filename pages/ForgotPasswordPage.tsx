
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import Card from '../components/ui/Card';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const { forgotPassword, loading } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPassword(email);
    addToast(t('resetEmailSent'));
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-4xl font-bold text-text-primary mb-2 font-tajawal">{t('forgotPasswordTitle')}</h2>
        <p className="text-md text-text-secondary">{t('forgotPasswordSubtitle')}</p>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:bg-gray-400"
              >
                {loading ? '...' : t('sendResetLink')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-text-secondary">
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">{t('backToLogin')}</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
