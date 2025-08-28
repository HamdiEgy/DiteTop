
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };
  
  const handleLogout = () => {
    logout();
    onClose();
  };

  const ActionButton: React.FC<{ onClick: () => void, children: React.ReactNode, className?: string }> = ({ onClick, children, className = ''}) => (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-4 text-lg font-medium text-text-primary hover:bg-secondary transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="bg-surface w-full rounded-t-3xl shadow-lg animate-slide-in-up pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-center text-text-primary">
            {user ? `${t('welcome')}, ${user.name}` : t('myProfile')}
          </h3>
        </div>
        <div className="py-2">
          {user ? (
            <>
              <ActionButton onClick={() => handleNavigation('/profile')}>{t('navProfile')}</ActionButton>
              {user.role === 'admin' && <ActionButton onClick={() => handleNavigation('/admin')}>{t('navAdmin')}</ActionButton>}
              <ActionButton onClick={handleLogout} className="text-red-600">{t('logout')}</ActionButton>
            </>
          ) : (
            <>
              <ActionButton onClick={() => handleNavigation('/login')}>{t('login')}</ActionButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
