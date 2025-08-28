import React from 'react';
import { Meal } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { Link } from 'react-router-dom';

const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => {
  const { language, t } = useLanguage();
  const { addToCart, decreaseQuantity, getItemQuantity } = useCart();
  const { addToast } = useToast();

  const name = language === 'ar' ? meal.name_ar : meal.name_en;
  const description = language === 'ar' ? meal.description_ar : meal.description_en;
  
  const quantity = getItemQuantity(meal.id);

  const handleAddToCart = () => {
      addToCart(meal);
      if (quantity === 0) {
        addToast(t('itemAddedToBox'));
      }
  };

  const handleDecrease = () => {
      decreaseQuantity(meal.id);
  };

  const NutritionalInfo: React.FC<{ label: string, value: number, unit: string }> = ({ label, value, unit}) => (
    <div className="text-center">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="font-bold text-sm text-text-primary">{value}{unit}</p>
    </div>
  );

  return (
    <div className="bg-surface rounded-2xl shadow-md group flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/meal/${meal.id}`}>
        <div className="relative">
          <div className="aspect-square">
              <img 
                src={meal.image} 
                alt={name} 
                className="w-full h-full object-cover rounded-t-2xl"
              />
          </div>
          <div className="absolute top-3 ltr:right-3 rtl:left-3 bg-accent text-white w-14 h-14 rounded-full flex flex-col items-center justify-center text-xs font-bold">
              <span>{meal.priceSAR}</span>
              <span>SAR</span>
          </div>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-text-primary font-tajawal mb-1 truncate">{name}</h3>
        <p className="text-text-secondary text-sm flex-grow mb-3 h-10">{description}</p>
        
        <div className="grid grid-cols-4 gap-2 border-y border-gray-200 py-2 my-2">
            <NutritionalInfo label={t('calories')} value={meal.kcal} unit="" />
            <NutritionalInfo label={t('protein')} value={meal.protein} unit="g" />
            <NutritionalInfo label={t('carbs')} value={meal.carbs} unit="g" />
            <NutritionalInfo label={t('fat')} value={meal.fat} unit="g" />
        </div>

        {meal.tags && meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
                {meal.tags.map(tag => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">{tag}</span>
                ))}
            </div>
        )}

        <div className="mt-auto">
          {quantity === 0 ? (
            <button 
              onClick={handleAddToCart}
              className="w-full bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              aria-label={`${t('addToBox')} ${name}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
              </svg>
              <span>{t('addToBox')}</span>
            </button>
          ) : (
            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
              <button 
                onClick={handleDecrease}
                className="bg-gray-200 text-text-primary font-bold w-10 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-gray-300 transition-colors duration-300"
                aria-label={`Decrease quantity of ${name}`}
              >
                -
              </button>
              <span className="font-bold text-lg w-5 text-center">{quantity}</span>
              <button 
                onClick={handleAddToCart}
                className="bg-accent text-white font-bold w-10 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-accent-dark transition-colors duration-300"
                aria-label={`Increase quantity of ${name}`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealCard;