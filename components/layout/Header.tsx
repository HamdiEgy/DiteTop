
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { UserRole } from '../../types';

const Header: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const socialLinks = [
    { href: '#', icon: 'fab fa-tiktok', label: 'TikTok' },
    { href: '#', icon: 'fab fa-snapchat', label: 'Snapchat' },
    { href: '#', icon: 'fab fa-facebook', label: 'Facebook' },
    { href: '#', icon: 'fab fa-instagram', label: 'Instagram' },
    { href: 'tel:9660000000', icon: 'fas fa-phone', label: 'Phone' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 rounded-t-2xl ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0">
               <img src="https://file.hamdi.top/apps/photos/api/v1/publicPreview/277?etag=4f85cdaef45e9883a9516e04c97c547e&x=512&y=512&token=7tvTTuUjbmgrgTyVLaolEZymmP1MI6YK" alt="Diet Top Logo" className="h-10 w-auto" />
            </NavLink>
            <nav className="hidden md:block ltr:ml-10 rtl:mr-10">
              <div className="flex items-center space-x-6 rtl:space-x-reverse">
                {socialLinks.map(link => (
                  <a key={link.label} href={link.href} aria-label={link.label} className="text-text-secondary hover:text-primary transition-colors duration-300">
                    <i className={`${link.icon} fa-lg`}></i>
                  </a>
                ))}
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="relative">
              <NavLink to="/cart" className="p-2 text-text-secondary rounded-full hover:bg-gray-200/50 hover:text-text-primary transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-accent rounded-full">
                    {itemCount}
                  </span>
                )}
              </NavLink>
            </div>
            
            <LanguageSwitcher />

            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-1 text-text-secondary rounded-full hover:bg-gray-200/50 hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
              </button>
              {isProfileOpen && (
                <div className="origin-top-right absolute ltr:right-0 rtl:left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-surface ring-1 ring-black ring-opacity-5 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-text-secondary border-b">{user.name}</div>
                      <NavLink to="/profile" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary" onClick={() => setIsProfileOpen(false)}>{t('navProfile')}</NavLink>
                      {user.role === 'admin' && <NavLink to="/admin" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary" onClick={() => setIsProfileOpen(false)}>{t('navAdmin')}</NavLink>}
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-text-primary hover:bg-secondary">{t('logout')}</button>
                    </>
                  ) : (
                    <NavLink to="/login" className="w-full text-left block px-4 py-2 text-sm text-text-primary hover:bg-secondary" onClick={() => setIsProfileOpen(false)}>{t('login')}</NavLink>
                  )}
                </div>
              )}
            </div>
            
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-text-secondary rounded-md hover:bg-gray-200/50 hover:text-text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
            <div className="md:hidden pb-4">
                <nav className="flex flex-col space-y-2">
                    {/* Mobile nav could be different if needed */}
                </nav>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
