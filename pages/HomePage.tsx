
import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { Meal, Category } from '../types';
import { api } from '../services/api';
import MealCard from '../components/ui/MealCard';
import MobileMealCard from '../components/ui/MobileMealCard';

// FIX: Make gsap available globally after being imported from CDN
declare const gsap: any;

// Mobile Home Page Component
const MobileHomePage: React.FC = () => {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [recommendedMeals, setRecommendedMeals] = useState<Meal[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            const [allMeals, categoriesData] = await Promise.all([
                api.fetchMeals(),
                api.fetchCategories()
            ]);

            const filtered = allMeals.filter(meal => {
                const name = language === 'ar' ? meal.name_ar : meal.name_en;
                const matchesCategory = selectedCategory === 'all' || meal.categoryId === selectedCategory;
                const matchesSearch = searchTerm === '' || name.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesCategory && matchesSearch;
            });

            setRecommendedMeals(filtered);
            setCategories(categoriesData);
        };
        fetchData();
    }, [selectedCategory, searchTerm, language]);
    
    const greeting = user 
        ? t('mobileGreetingUser').replace('{{name}}', user.name) 
        : t('mobileGreetingGuest');

    return (
        <div className="bg-stone-50 min-h-full p-5">
            <header className="flex justify-between items-center mb-6 rtl:flex-row-reverse">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 rtl:text-right ltr:text-left">{greeting}</h1>
                    <p className="text-gray-500 rtl:text-right ltr:text-left">{t('mobileGreetingSubtitle')}</p>
                </div>
                <Link to="/profile" className="flex-shrink-0">
                     <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format=fit=crop" alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                </Link>
            </header>

            <section className="relative h-48 mb-6 rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format=fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Healthy food" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
                <div className="relative z-10 flex flex-col justify-end h-full p-4 text-white">
                    <h2 className="font-tajawal font-bold text-2xl drop-shadow-md">{t('heroTitlePart1' as any)} {t('heroTitlePart2' as any)}</h2>
                    <p className="text-sm drop-shadow mt-1 max-w-xs">{t('heroSubtitle')}</p>
                    <Link to="/menu" className="mt-3 self-start bg-amber-400 text-gray-900 font-bold py-2 px-5 rounded-lg text-sm transition-transform hover:scale-105 active:scale-95">
                        {t('heroCtaBrowseMenu')}
                    </Link>
                </div>
            </section>
            
            <div className="sticky top-0 bg-stone-50/50 backdrop-blur-lg z-10 py-3 -mx-5">
                <div className="px-5">
                    <div className="relative mb-3">
                        <input 
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3 ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 bg-white/70 rounded-full border border-white/50 focus:ring-2 focus:ring-amber-400 focus:border-transparent backdrop-blur-sm"
                        />
                        <i className="fa-solid fa-search absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400"></i>
                    </div>
                </div>
                 <div className="flex space-x-3 rtl:space-x-reverse overflow-x-auto pb-2 no-scrollbar -mx-5 px-5">
                    <button 
                        onClick={() => setSelectedCategory('all')} 
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                            selectedCategory === 'all' 
                            ? 'bg-amber-400 text-gray-900 shadow-lg' 
                            : 'bg-white/40 backdrop-blur-md text-gray-800 border border-white/50 shadow-sm hover:bg-white/60'
                        }`}
                    >
                        <i className="fas fa-utensils"></i>
                        <span>{t('allCategories')}</span>
                    </button>
                    {categories.map(category => (
                        <button 
                            key={category.id} 
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                                selectedCategory === category.id 
                                ? 'bg-amber-400 text-gray-900 shadow-lg' 
                                : 'bg-white/40 backdrop-blur-md text-gray-800 border border-white/50 shadow-sm hover:bg-white/60'
                            }`}
                        >
                            <i className={category.icon}></i>
                            <span>{language === 'ar' ? category.name_ar : category.name_en}</span>
                        </button>
                    ))}
                </div>
            </div>


            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 rtl:text-right ltr:text-left mt-4">{t('recommended')}</h2>
                <div className="grid grid-cols-2 gap-5">
                    {recommendedMeals.map(meal => (
                        <MobileMealCard key={meal.id} meal={meal} />
                    ))}
                </div>
            </div>

            <div className="my-10 pt-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{t('howItWorksTitle')}</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-white rounded-full p-3 mb-2 shadow"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div>
                        <h3 className="text-sm font-bold mb-1">{t('step1Title')}</h3>
                        <p className="text-xs text-gray-500">{t('step1Desc')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white rounded-full p-3 mb-2 shadow"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
                        <h3 className="text-sm font-bold mb-1">{t('step2Title')}</h3>
                        <p className="text-xs text-gray-500">{t('step2Desc')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white rounded-full p-3 mb-2 shadow"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10" /></svg></div>
                        <h3 className="text-sm font-bold mb-1">{t('step3Title')}</h3>
                        <p className="text-xs text-gray-500">{t('step3Desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Desktop Home Page Component (original content)
const DesktopHomePage: React.FC = () => {
    const { t } = useLanguage();
    const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
    const location = useLocation();

    const heroRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const textContentRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const leaf1Ref = useRef<SVGSVGElement>(null);
    const leaf2Ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (typeof gsap === 'undefined') return;

        const ctx = gsap.context(() => {
            // Entrance Animation
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from(imageRef.current, { scale: 0.8, opacity: 0, duration: 1.2 })
              .from(textContentRef.current!.children, { y: 50, opacity: 0, stagger: 0.15, duration: 0.8 }, "-=0.8")
              .from(buttonsRef.current!.children, { y: 30, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.6");
            
            // Ambient Floating Animation
            gsap.to(leaf1Ref.current, {
                y: '+=20', x: '+=15', rotation: '+=10', yoyo: true, repeat: -1,
                duration: 10, ease: 'sine.inOut',
            });
            gsap.to(leaf2Ref.current, {
                y: '-=15', x: '-=10', rotation: '-=8', yoyo: true, repeat: -1,
                duration: 12, ease: 'sine.inOut', delay: 1,
            });

            // Mouse Parallax Effect
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const x = (clientX / window.innerWidth - 0.5) * 50;
                const y = (clientY / window.innerHeight - 0.5) * 50;
                
                gsap.to(imageRef.current, { x: -x * 0.8, y: -y * 0.8, rotation: x * 0.03, duration: 1.5, ease: 'power2.out' });
                gsap.to(leaf1Ref.current, { x: x * 0.4, y: y * 0.4, duration: 2, ease: 'power2.out' });
                gsap.to(leaf2Ref.current, { x: x * 0.2, y: y * 0.2, duration: 2.5, ease: 'power2.out' });
            };
            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };

        }, heroRef);

        return () => ctx.revert();
    }, []);
    
    useEffect(() => {
        if (location.state && location.state.scrollTo) {
          setTimeout(() => {
            const element = document.getElementById(location.state.scrollTo);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
    }, [location]);

    useEffect(() => {
        const fetchFeatured = async () => {
            const allMeals = await api.fetchMeals();
            setFeaturedMeals(allMeals.slice(0, 4));
        };
        fetchFeatured();
    }, []);

    return (
        <div className="overflow-x-hidden relative" ref={heroRef}>
          <svg ref={leaf1Ref} viewBox="0 0 100 100" className="absolute text-primary/10 -z-10 w-64 h-64 -top-20 -right-20 transform rotate-45" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,0 C80,10 100,40 100,50 C90,80 60,100 50,100 C20,90 0,60 0,50 C10,20 20,0 50,0 Z" fill="currentColor" />
          </svg>
          <svg ref={leaf2Ref} viewBox="0 0 100 100" className="absolute text-primary/10 -z-10 w-48 h-48 bottom-1/2 left-[-5rem] transform -rotate-12" xmlns="http://www.w3.org/2000/svg">
              <path d="M50,0 C80,10 100,40 100,50 C90,80 60,100 50,100 C20,90 0,60 0,50 C10,20 20,0 50,0 Z" fill="currentColor" />
          </svg>
          
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-start order-2 md:order-1">
                <div ref={textContentRef} className="mb-8">
                    <h1 className={'font-tajawal font-black text-6xl md:text-7xl text-primary leading-tight'}>
                      {t('heroTitlePart1' as any)}
                    </h1>
                    <div className="mt-2">
                        <h2 className={'font-tajawal font-black text-5xl md:text-6xl text-text-primary leading-tight'}>
                          {t('heroTitlePart2' as any)}
                        </h2>
                        <p className="text-lg text-text-secondary mt-2">
                          {t('heroSubtitle')}
                        </p>
                    </div>
                </div>
                <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/subscriptions" className="bg-accent text-white font-bold h-12 px-8 rounded-lg text-lg hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">{t('heroCtaStartPlan')}</Link>
                   <Link to="/menu" className="bg-secondary text-text-primary font-bold h-12 px-8 rounded-lg text-lg hover:bg-secondary-dark transition-all duration-300 ring-1 ring-inset ring-gray-300 flex items-center justify-center">{t('heroCtaBrowseMenu')}</Link>
                </div>
                 <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 block h-[3.36rem]">
                    <img src="https://static.vecteezy.com/system/resources/previews/024/170/871/large_2x/badge-google-play-and-app-store-button-download-free-png.png" alt="Get it on Google Play" className="h-full w-auto" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 block h-[3.36rem]">
                    <img src="https://static.vecteezy.com/system/resources/previews/024/170/865/large_2x/badge-google-play-and-app-store-button-download-free-png.png" alt="Download on the App Store" className="h-full w-auto" />
                  </a>
                </div>
              </div>
              <div className="relative flex justify-center items-center order-1 md:order-2">
                <div className="bg-primary/20 rounded-full w-80 h-80 md:w-96 md:h-96 blur-2xl absolute"></div>
                <img ref={imageRef} src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1170&auto=format&fit=crop" alt="Healthy Meal" className="w-full max-w-sm md:max-w-md rounded-full z-10 aspect-square object-cover" />
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center -mt-10 md:-mt-16 pb-16 md:pb-24 relative z-10">
            <div className="inline-flex flex-col sm:flex-row gap-4 justify-center p-3 bg-white/50 backdrop-blur-md rounded-full shadow-md border border-white/30">
              <Link to="/menu" className="group flex items-center justify-center gap-x-3 h-12 px-7 rounded-full bg-white text-text-primary font-bold text-lg shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 ring-1 ring-gray-200">
                <i className="fas fa-utensils text-primary transition-transform duration-300 group-hover:rotate-[-5deg]"></i>
                <span>{t('navMenu')}</span>
              </Link>
              <Link to="/subscriptions" className="group flex items-center justify-center gap-x-3 h-12 px-7 rounded-full bg-white text-text-primary font-bold text-lg shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 ring-1 ring-gray-200">
                <i className="fas fa-calendar-days text-primary transition-transform duration-300 group-hover:rotate-[-5deg]"></i>
                <span>{t('navSubscriptions')}</span>
              </Link>
            </div>
          </div>

          <section id="featured-meals" className="py-20 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-text-primary mb-12 font-tajawal">{t('featuredMeals')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredMeals.map(meal => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </div>
            </div>
          </section>
          
          <section id="how-it-works" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-text-primary mb-12 font-tajawal">{t('howItWorksTitle')}</h2>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center"><div className="bg-primary/10 text-primary rounded-full p-4 mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div><h3 className="text-xl font-bold mb-2">{t('step1Title')}</h3><p className="text-text-secondary">{t('step1Desc')}</p></div>
                     <div className="flex flex-col items-center"><div className="bg-primary/10 text-primary rounded-full p-4 mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div><h3 className="text-xl font-bold mb-2">{t('step2Title')}</h3><p className="text-text-secondary">{t('step2Desc')}</p></div>
                     <div className="flex flex-col items-center"><div className="bg-primary/10 text-primary rounded-full p-4 mb-4"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10" /></svg></div><h3 className="text-xl font-bold mb-2">{t('step3Title')}</h3><p className="text-text-secondary">{t('step3Desc')}</p></div>
                </div>
            </div>
          </section>
        </div>
    );
}


const HomePage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <MobileHomePage /> : <DesktopHomePage />;
};

export default HomePage;