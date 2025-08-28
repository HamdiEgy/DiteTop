
import React from 'react';
import { CartItem } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';

const DesktopCartItem: React.FC<{ item: CartItem }> = ({ item }) => {
    const { language, t } = useLanguage();
    const { addToCart, decreaseQuantity, removeFromCart } = useCart();
    const name = language === 'ar' ? item.meal.name_ar : item.meal.name_en;

    return (
        <div className="flex items-center gap-6 bg-surface p-4 rounded-2xl shadow-sm">
            <img src={item.meal.image} alt={name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-grow">
                <h4 className="font-bold text-text-primary text-lg">{name}</h4>
                <p className="text-text-secondary text-sm">SAR {item.meal.priceSAR.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => decreaseQuantity(item.meal.id)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-700 hover:bg-gray-200 transition"
                    aria-label={`Decrease quantity of ${name}`}
                >
                    -
                </button>
                <span className="font-bold text-lg text-gray-800 w-8 text-center">{item.quantity}</span>
                <button
                    onClick={() => addToCart(item.meal)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-700 hover:bg-gray-200 transition"
                    aria-label={`Increase quantity of ${name}`}
                >
                    +
                </button>
            </div>
            <div className="w-24 text-right">
                <p className="font-bold text-lg text-text-primary">SAR {(item.meal.priceSAR * item.quantity).toFixed(2)}</p>
            </div>
            <button 
                onClick={() => removeFromCart(item.meal.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title={t('removeItem')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

export default DesktopCartItem;
