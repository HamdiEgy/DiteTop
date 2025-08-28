import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const FooterLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
    <li>
      <NavLink to={to} className="text-text-secondary hover:text-primary transition-colors duration-300">
        {children}
      </NavLink>
    </li>
  );

  return (
    <footer className="bg-white/50 mt-24 border-t border-white/20 pb-24 md:pb-0 rounded-b-2xl">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
             <div className="flex-shrink-0">
               <img src="https://file.hamdi.top/apps/photos/api/v1/publicPreview/277?etag=4f85cdaef45e9883a9516e04c97c547e&x=512&y=512&token=7tvTTuUjbmgrgTyVLaolEZymmP1MI6YK" alt="Diet Top Logo" className="h-10 w-auto" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-text-primary tracking-wider uppercase">{t('ourServices')}</h3>
            <ul className="mt-4 space-y-2">
              <FooterLink to="/menu">{t('navMenu')}</FooterLink>
              <FooterLink to="/subscriptions">{t('navSubscriptions')}</FooterLink>
              <FooterLink to="#">{t('faq')}</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-text-primary tracking-wider uppercase">{t('ourCompany')}</h3>
            <ul className="mt-4 space-y-2">
               <FooterLink to="#">{t('aboutUs')}</FooterLink>
               <FooterLink to="#">{t('contactUs')}</FooterLink>
               <FooterLink to="#">{t('privacyPolicy')}</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-text-primary tracking-wider uppercase">{t('getInTouch')}</h3>
            <p className="mt-4 text-text-secondary">
              Buraydah, Qassim<br/>
              Saudi Arabia
            </p>
          </div>
          <div>
            <h3 className="font-bold text-text-primary tracking-wider uppercase">{t('followUs')}</h3>
            <div className="flex space-x-4 rtl:space-x-reverse mt-4">
              <a href="#" className="text-text-secondary hover:text-primary"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-text-secondary hover:text-primary"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" /></svg></a>
              <a href="#" className="text-text-secondary hover:text-primary"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-900/10 pt-8 text-center text-text-secondary text-sm">
          <p>{t('rightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;