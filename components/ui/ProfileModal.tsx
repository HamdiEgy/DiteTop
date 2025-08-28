
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
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
            {t('myProfile')}
          </h3>
        </div>
        <div className="py-2">
            <ActionButton onClick={() => handleNavigation('/profile')}>{t('navProfile')}</ActionButton>
            <ActionButton onClick={() => handleNavigation('/admin')}>{t('navAdmin')}</ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
