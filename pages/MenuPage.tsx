import React, { useEffect, useState } from 'react';
import { Meal, Category } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import MealCard from '../components/ui/MealCard';
import MobileMealCard from '../components/ui/MobileMealCard';

const MenuPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mealsData, categoriesData] = await Promise.all([
          api.fetchMeals(),
          api.fetchCategories()
        ]);
        setMeals(mealsData);
        setFilteredMeals(mealsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredMeals(meals);
    } else {
      setFilteredMeals(meals.filter(meal => meal.categoryId === selectedCategory));
    }
  }, [selectedCategory, meals]);

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-text-primary mb-4 font-tajawal">{t('ourMenu')}</h2>
        
        <div className="flex justify-center flex-wrap gap-3 mb-10">
          <button onClick={() => setSelectedCategory('all')} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${selectedCategory === 'all' ? 'bg-accent text-white' : 'bg-secondary hover:bg-secondary-dark text-text-primary'}`}>{t('allCategories')}</button>
          {categories.map(category => (
            <button 
              key={category.id} 
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 ${selectedCategory === category.id ? 'bg-accent text-white' : 'bg-secondary hover:bg-secondary-dark text-text-primary'}`}
            >
              {language === 'ar' ? category.name_ar : category.name_en}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="text-center text-lg text-text-secondary">{t('loadingMenu' as any)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMeals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-stone-50 min-h-full">
        <div className="p-5">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{t('ourMenu')}</h1>
        </div>
        
        <div className="sticky top-0 bg-stone-50/50 backdrop-blur-lg z-10 px-5 py-3">
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

        {loading ? (
             <div className="text-center p-8 text-lg text-text-secondary">{t('loadingMenu' as any)}</div>
        ) : (
            <div className="grid grid-cols-2 gap-5 p-5">
                {filteredMeals.map(meal => (
                    <MobileMealCard key={meal.id} meal={meal} />
                ))}
            </div>
        )}
      </div>
    </>
  );
};

export default MenuPage;