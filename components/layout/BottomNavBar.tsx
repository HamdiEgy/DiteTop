import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';
import ProfileModal from '../ui/ProfileModal';

// Icon and Label container component
const NavIcon: React.FC<{ children: React.ReactNode, label: string }> = ({ children, label }) => (
  <div className="flex flex-col items-center justify-center h-full">
    {children}
    <span className="text-xs mt-1">{label}</span>
  </div>
);

const BottomNavBar: React.FC = () => {
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex-1 transition-colors duration-200 ${isActive ? 'text-amber-500' : 'text-gray-400 hover:text-gray-600'}`;
    
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:hidden z-40 rounded-t-3xl">
        <nav className="flex items-center justify-around h-full max-w-md mx-auto text-center">
          <NavLink to="/" className={navLinkClass} end>
            <NavIcon label={t('navHome')}>
              <i className="fa-solid fa-house fa-fw text-xl"></i>
            </NavIcon>
          </NavLink>
          
          <NavLink to="/menu" className={navLinkClass}>
             <NavIcon label={t('navMenu')}>
              <i className="fa-solid fa-utensils fa-fw text-xl"></i>
            </NavIcon>
          </NavLink>

          <NavLink to="/cart" className={navLinkClass}>
            <NavIcon label={t('cart')}>
              <div className="relative">
                <i className="fa-solid fa-shopping-bag fa-fw text-xl"></i>
                {itemCount > 0 && (
                  <span className="absolute top-[-4px] right-[-8px] inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
            </NavIcon>
          </NavLink>

          <NavLink to="/subscriptions" className={navLinkClass}>
            <NavIcon label={t('navSubscriptions')}>
              <i className="fa-solid fa-calendar-days fa-fw text-xl"></i>
            </NavIcon>
          </NavLink>

          <button onClick={() => setIsProfileModalOpen(true)} className="flex-1 transition-colors duration-200 text-gray-400 hover:text-gray-600">
            <NavIcon label={t('navProfile')}>
              <i className="fa-solid fa-user fa-fw text-xl"></i>
            </NavIcon>
          </button>
        </nav>
      </div>
      {isProfileModalOpen && <ProfileModal onClose={() => setIsProfileModalOpen(false)} />}
    </>
  );
};

export default BottomNavBar;