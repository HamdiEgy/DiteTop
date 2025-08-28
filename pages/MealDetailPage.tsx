import React, { useState, useEffect } from 'react';
// FIX: Import `Link` from `react-router-dom` to fix 'Cannot find name 'Link'' error.
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Meal } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import MobileMealCard from '../components/ui/MobileMealCard';
import MealCard from '../components/ui/MealCard';

const MealDetailPage: React.FC = () => {
    const { mealId } = useParams<{ mealId: string }>();
    const navigate = useNavigate();
    const { language, t } = useLanguage();
    const { addToCart, decreaseQuantity, getItemQuantity } = useCart();
    const { addToast } = useToast();

    const [meal, setMeal] = useState<Meal | null>(null);
    const [relatedMeals, setRelatedMeals] = useState<Meal[]>([]);

    useEffect(() => {
        const fetchMealData = async () => {
            if (!mealId) return;
            // Scroll to top on new meal load
            window.scrollTo(0, 0);
            
            const allMeals = await api.fetchMeals();
            const foundMeal = allMeals.find(m => m.id === mealId);
            setMeal(foundMeal || null);

            if (foundMeal) {
                const related = allMeals
                    .filter(m => m.categoryId === foundMeal.categoryId && m.id !== foundMeal.id)
                    .slice(0, 4);
                setRelatedMeals(related);
            }
        };
        fetchMealData();
    }, [mealId]);

    const quantity = getItemQuantity(mealId || '');

    const handleAddToCart = () => {
        if (meal) {
            addToCart(meal);
            if (quantity === 0) {
                addToast(t('itemAddedToBox'));
            }
        }
    };

    const handleDecrease = () => {
        if (mealId) {
            decreaseQuantity(mealId);
        }
    };
    
    const handleBuyNow = () => {
        if (meal) {
            if (quantity === 0) {
                addToCart(meal);
            }
            navigate('/cart');
        }
    };

    if (!meal) {
        return <div className="text-center p-8">Loading...</div>;
    }

    const name = language === 'ar' ? meal.name_ar : meal.name_en;
    const description = language === 'ar' ? meal.description_ar : meal.description_en;

    const mockRating = 4.8;
    const mockReviewsCount = 124;
    const mockReviews = [
        { name: t('mockReview1Name'), text: t('mockReview1Text'), rating: 5 },
        { name: t('mockReview2Name'), text: t('mockReview2Text'), rating: 4 },
        { name: t('mockReview3Name'), text: t('mockReview3Text'), rating: 5 },
    ];
    
    const NutritionalInfo: React.FC<{ label: string, value: number, unit: string, className?: string }> = ({ label, value, unit, className}) => (
        <div className={`text-center bg-white p-2 rounded-lg shadow-sm ${className}`}>
            <p className="text-xs text-text-secondary">{label}</p>
            <p className="font-bold text-sm text-text-primary">{value}{unit}</p>
        </div>
    );
    
    const DesktopReview: React.FC<{ review: { name: string, text: string, rating: number } }> = ({ review }) => (
         <div className="bg-secondary/70 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-text-primary">{review.name}</span>
                <div className="flex items-center text-xs">
                    {[...Array(review.rating)].map((_, i) => <i key={i} className="fas fa-star text-amber-400"></i>)}
                    {[...Array(5 - review.rating)].map((_, i) => <i key={i} className="fas fa-star text-gray-300"></i>)}
                </div>
            </div>
            <p className="text-text-secondary text-sm">{review.text}</p>
        </div>
    );

    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden bg-stone-50 min-h-full pb-32">
                <div className="relative">
                     <img src={meal.image} alt={name} className="w-full h-80 object-cover" />
                     <div className="absolute top-5 ltr:left-5 rtl:right-5">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={language === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} /></svg>
                        </button>
                     </div>
                </div>
                
                <div className="bg-stone-50 p-6 rounded-t-3xl -mt-8 relative z-10">
                    <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
                    
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-gray-500 my-3">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <i className="fas fa-star text-amber-400"></i>
                            <span className="font-bold text-text-primary">{mockRating}</span>
                            <span className="text-sm">({mockReviewsCount} {t('reviews')})</span>
                        </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed my-4">{description}</p>
                    
                     <div className="grid grid-cols-4 gap-2 border-y border-gray-100 py-4 my-4">
                        <NutritionalInfo label={t('calories')} value={meal.kcal} unit="" />
                        <NutritionalInfo label={t('protein')} value={meal.protein} unit="g" />
                        <NutritionalInfo label={t('carbs')} value={meal.carbs} unit="g" />
                        <NutritionalInfo label={t('fat')} value={meal.fat} unit="g" />
                    </div>

                    <div className="my-6">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-bold text-gray-800">{t('customerReviews')}</h2>
                            <Link to="#" className="text-sm font-semibold text-primary">{t('viewAllReviews')}</Link>
                        </div>
                        <div className="space-y-4">
                            {mockReviews.slice(0, 2).map((review, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">{review.name}</span>
                                        <div className="flex items-center text-xs">
                                            {[...Array(review.rating)].map((_, i) => <i key={i} className="fas fa-star text-amber-400"></i>)}
                                            {[...Array(5 - review.rating)].map((_, i) => <i key={i} className="fas fa-star text-gray-300"></i>)}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {relatedMeals.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('relatedMeals')}</h2>
                            <div className="flex space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                                {relatedMeals.map(relatedMeal => (
                                    <div key={relatedMeal.id} className="flex-shrink-0 w-48">
                                        <MobileMealCard meal={relatedMeal} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
                 <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 md:hidden z-20">
                    <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                        <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                            <button 
                                onClick={handleDecrease}
                                disabled={quantity === 0}
                                className="bg-gray-200 text-text-primary font-bold w-12 h-12 flex items-center justify-center text-2xl rounded-xl hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50"
                                aria-label="Decrease quantity"
                            >
                                -
                            </button>
                            <span className="font-bold text-2xl w-8 text-center">{quantity}</span>
                            <button 
                                onClick={handleAddToCart}
                                className="bg-gray-200 text-text-primary font-bold w-12 h-12 flex items-center justify-center text-2xl rounded-xl hover:bg-gray-300 transition-colors duration-300"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                        <button 
                          onClick={handleAddToCart}
                          className="flex-grow bg-accent text-white font-extrabold py-4 rounded-xl text-lg shadow-lg hover:bg-accent-dark transition-colors"
                        >
                          <span>{t('addToCart')}</span>
                          {quantity > 0 && <span> (SAR {(meal.priceSAR * quantity).toFixed(2)})</span>}
                          {quantity === 0 && <span> (SAR {meal.priceSAR.toFixed(2)})</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div>
                        <img src={meal.image} alt={name} className="w-full h-auto aspect-square object-cover rounded-2xl shadow-xl sticky top-24" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-text-primary font-tajawal">{name}</h1>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-text-secondary my-3">
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                <i className="fas fa-star text-amber-400"></i>
                                <span className="font-bold text-text-primary">{mockRating}</span>
                                <span className="text-sm">({mockReviewsCount} {t('reviews')})</span>
                            </div>
                        </div>
                        <p className="text-text-secondary leading-relaxed my-5">{description}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-5 my-5 border-y">
                            <NutritionalInfo className="!shadow-none !p-0" label={t('calories')} value={meal.kcal} unit="" />
                            <NutritionalInfo className="!shadow-none !p-0" label={t('protein')} value={meal.protein} unit="g" />
                            <NutritionalInfo className="!shadow-none !p-0" label={t('carbs')} value={meal.carbs} unit="g" />
                            <NutritionalInfo className="!shadow-none !p-0" label={t('fat')} value={meal.fat} unit="g" />
                        </div>
                        
                        <div className="bg-surface rounded-xl p-4 shadow-sm border">
                             <div className="flex items-center justify-between gap-6 mb-4">
                                <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
                                    <button 
                                        onClick={handleDecrease}
                                        disabled={quantity === 0}
                                        className="bg-secondary text-text-primary font-bold w-10 h-10 flex items-center justify-center text-2xl rounded-lg hover:bg-secondary-dark transition-colors duration-300 disabled:opacity-50"
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold text-2xl w-8 text-center">{quantity}</span>
                                    <button 
                                        onClick={handleAddToCart}
                                        className="bg-secondary text-text-primary font-bold w-10 h-10 flex items-center justify-center text-2xl rounded-lg hover:bg-secondary-dark transition-colors duration-300"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-3xl text-text-primary">SAR { (meal.priceSAR * (quantity > 0 ? quantity : 1)).toFixed(2) }</span>
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                <button 
                                  onClick={handleBuyNow}
                                  className="w-full bg-secondary text-text-primary font-bold py-3 rounded-lg text-md hover:bg-secondary-dark transition-colors ring-1 ring-inset ring-gray-300"
                                >
                                  {t('buyNow')}
                                </button>
                                <button 
                                  onClick={handleAddToCart}
                                  className="w-full bg-accent text-white font-extrabold py-3 rounded-lg text-md shadow-lg hover:bg-accent-dark transition-colors"
                                >
                                  {t('addToCart')}
                                </button>
                             </div>
                        </div>

                        <div className="my-10">
                            <h2 className="text-2xl font-bold text-text-primary mb-4 font-tajawal">{t('customerReviews')}</h2>
                            <div className="space-y-4">
                                {mockReviews.map((review, index) => <DesktopReview key={index} review={review} />)}
                            </div>
                            <div className="mt-5 text-center">
                                <Link to="#" className="font-semibold text-primary hover:underline">{t('viewAllReviews')}</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedMeals.length > 0 && (
                    <div className="mt-20 pt-16 border-t">
                        <h2 className="text-3xl font-bold text-text-primary mb-8 font-tajawal text-center">{t('relatedMeals')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedMeals.map(relatedMeal => (
                                <MealCard key={relatedMeal.id} meal={relatedMeal} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MealDetailPage;