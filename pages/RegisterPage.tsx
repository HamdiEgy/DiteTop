
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import Card from '../components/ui/Card';

const RegisterPage: React.FC = () => {
  const { t } = useLanguage();
  const { register, loading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addToast(t('passwordsDoNotMatch'));
      return;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registrationData } = formData;
    
    const newUser = await register(registrationData);
    if (newUser) {
      addToast(t('registrationSuccess'));
      navigate('/profile');
    } else {
      addToast(t('registrationFailed'));
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-4xl font-bold text-text-primary mb-2 font-tajawal">{t('registerTitle')}</h2>
        <p className="text-md text-text-secondary">{t('registerSubtitle')}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-sm font-medium text-text-primary">{t('fullName')}</label>
              <input name="name" type="text" required onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary">{t('email')}</label>
              <input name="email" type="email" required onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary">{t('phoneNumber')}</label>
              <input name="phone" type="tel" required onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary">{t('address')}</label>
              <input name="address" type="text" required onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary">{t('password')}</label>
              <input name="password" type="password" required onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary">{t('confirmPassword')}</label>
              <input name="confirmPassword" type="password" required onChange={handleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-dark disabled:bg-gray-400"
              >
                {loading ? '...' : t('signUp')}
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
              {t('haveAccount')}{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">{t('signIn')}</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
