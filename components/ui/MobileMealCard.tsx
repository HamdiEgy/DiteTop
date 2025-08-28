
import React, { useState } from 'react';
import { Meal } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';

const MobileMealCard: React.FC<{ meal: Meal }> = ({ meal }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);

  const name = language === 'ar' ? meal.name_ar : meal.name_en;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(meal);
    addToast(t('itemAddedToBox'));
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };
  
  return (
    <Link to={`/meal/${meal.id}`} className="block" aria-label={name}>
      <div className="relative aspect-[3/4] bg-gray-300 rounded-3xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <img 
          src={meal.image} 
          alt={name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <button 
          onClick={toggleFavorite} 
          className="absolute top-3 right-3 bg-white/10 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center text-white transition-colors hover:bg-white/20 z-10"
          aria-label="Toggle Favorite"
        >
          {isFavorited ? (
            <i className="fas fa-heart text-red-500"></i>
          ) : (
            <i className="far fa-heart"></i>
          )}
        </button>

        <div className="relative h-full flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-bold font-tajawal drop-shadow-lg mb-1 leading-tight h-14 flex flex-col justify-end">{name}</h3>
          
          <div className="flex justify-between items-center mt-2">
            <p className="font-extrabold text-xl drop-shadow">
              {meal.priceSAR.toFixed(2)}
              <span className="text-xs align-baseline font-normal rtl:mr-1 ltr:ml-1">SAR</span>
            </p>
            <button 
              onClick={handleAddToCart}
              className="bg-amber-400 text-gray-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-lg transition-transform hover:scale-110 active:scale-95"
              aria-label={`${t('addToCart')} ${name}`}
            >
              <i className="fas fa-plus text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MobileMealCard;
