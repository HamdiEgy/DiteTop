
import React from 'react';
import { CartItem } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';

const MobileCartItem: React.FC<{ item: CartItem }> = ({ item }) => {
    const { language, t } = useLanguage();
    const { addToCart, decreaseQuantity, removeFromCart } = useCart();
    const name = language === 'ar' ? item.meal.name_ar : item.meal.name_en;

    return (
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm">
            <img src={item.meal.image} alt={name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 text-md leading-tight pr-2 truncate">{name}</h4>
                    <button 
                        onClick={() => removeFromCart(item.meal.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label={t('removeItem')}
                    >
                        <i className="fas fa-trash-alt fa-sm"></i>
                    </button>
                </div>
                <p className="text-amber-500 font-bold mt-1">SAR {(item.meal.priceSAR * item.quantity).toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <button 
                    onClick={() => addToCart(item.meal)} 
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-700 hover:bg-gray-200 transition"
                    aria-label={`Increase quantity of ${name}`}
                >
                    +
                </button>
                <span className="font-bold text-lg text-gray-800 w-8 text-center">{item.quantity}</span>
                 <button 
                    onClick={() => decreaseQuantity(item.meal.id)} 
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-lg font-bold text-gray-700 hover:bg-gray-200 transition"
                    aria-label={`Decrease quantity of ${name}`}
                >
                    -
                </button>
            </div>
        </div>
    );
};

export default MobileCartItem;
