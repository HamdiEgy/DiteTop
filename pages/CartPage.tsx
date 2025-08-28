
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../hooks/useLanguage';
import MobileCartItem from '../components/ui/MobileCartItem';
import DesktopCartItem from '../components/ui/DesktopCartItem';
import Card from '../components/ui/Card';

const SubscriptionCartItem: React.FC = () => {
    const { subscription, removeSubscription } = useCart();
    const { t, language } = useLanguage();

    if (!subscription) return null;
    
    const { plan, customization, totalPrice, selectedMeals } = subscription;
    const name = language === 'ar' ? plan.name_ar : plan.name_en;

    return (
        <div className="bg-surface p-4 rounded-2xl shadow-sm border-2 border-primary/50 relative pb-12">
             <button 
                onClick={removeSubscription}
                className="absolute bottom-3 ltr:left-3 rtl:right-3 text-gray-400 hover:text-red-500 transition-colors"
                title={t('removeItem')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
            <h3 className="text-lg font-bold text-primary mb-2">{t('subscriptionDetails')}</h3>
            <div className="md:flex items-center justify-between">
                <div>
                    <p className="font-semibold text-text-primary">{name}</p>
                    <p className="text-sm text-text-secondary">
                        {customization.mealsPerDay} {t('mealsPerDay')} &bull; {customization.daysPerWeek} {t('daysPerWeek')}
                    </p>
                </div>
                <p className="font-bold text-lg text-text-primary mt-2 md:mt-0">SAR {totalPrice.toFixed(2)}</p>
            </div>
            {selectedMeals && selectedMeals.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200/60">
                    <h4 className="font-semibold text-text-secondary text-sm mb-2">{t('selectedMeals' as any)}:</h4>
                     <div className="space-y-3">
                        {selectedMeals.map(daySelection => (
                            <div key={daySelection.day}>
                                <p className="font-bold text-text-primary text-sm mb-1">{(t('day_of_week') as any).replace('{{day}}', String(daySelection.day))}</p>
                                <div className="flex flex-wrap gap-2">
                                    {daySelection.meals.map(item => (
                                        <div key={item.meal.id} className="flex items-center gap-2 bg-secondary py-1 px-2 rounded-full text-xs">
                                            <img src={item.meal.image} alt={language === 'ar' ? item.meal.name_ar : item.meal.name_en} className="w-5 h-5 rounded-full object-cover" />
                                            <span className="text-text-primary">{language === 'ar' ? item.meal.name_ar : item.meal.name_en}</span>
                                            {item.quantity > 1 && <span className="font-semibold text-primary-dark">(x{item.quantity})</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const CartPage: React.FC = () => {
    const { t } = useLanguage();
    const { items, subscription, itemCount } = useCart();
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    
    const TAX_RATE = 0.15;
    const DELIVERY_FEE = 15.00;

    const mealsSubtotal = items.reduce((sum, item) => sum + item.meal.priceSAR * item.quantity, 0);
    const subscriptionTotal = subscription?.totalPrice ?? 0;
    const subtotal = mealsSubtotal + subscriptionTotal;

    const estimatedTax = subtotal * TAX_RATE;
    const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
    const total = (items.length > 0 || subscription) ? subtotal + estimatedTax + deliveryFee : 0;
    
    const totalItemsText = itemCount === 1 ? t('item') : t('items');
    const isEmpty = items.length === 0 && !subscription;

    const emptyCartView = (
        <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-4">{t('cartEmpty')}</p>
            <Link to="/menu" className="bg-primary text-white font-bold py-3 px-6 rounded-lg text-md transition-transform hover:scale-105 active:scale-95">
                {t('browseMenuPrompt')}
            </Link>
        </div>
    );

    const deliveryMethodSelector = (
        <div className="mt-6">
            <h3 className="text-lg font-bold text-text-primary mb-3">{t('deliveryMethod')}</h3>
            <div className="bg-gray-200/70 rounded-xl p-1">
                <div className="grid grid-cols-2 gap-1 text-center">
                    <button onClick={() => setDeliveryMethod('delivery')} className={`py-2.5 rounded-lg text-sm font-bold transition-all ${deliveryMethod === 'delivery' ? 'bg-white text-gray-900 shadow-md' : 'bg-transparent text-gray-600'}`}>{t('delivery')}</button>
                    <button onClick={() => setDeliveryMethod('pickup')} className={`py-2.5 rounded-lg text-sm font-bold transition-all ${deliveryMethod === 'pickup' ? 'bg-white text-gray-900 shadow-md' : 'bg-transparent text-gray-600'}`}>{t('pickup')}</button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile View */}
            <div className="md:hidden bg-stone-50 min-h-full">
                <div className="p-5 pb-40">
                    <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('cartTitle')}</h1>

                    {isEmpty ? (
                        emptyCartView
                    ) : (
                        <>
                            <div className="flex flex-col gap-4">
                                {subscription && <SubscriptionCartItem />}
                                {items.map(item => (
                                    <MobileCartItem key={item.meal.id} item={item} />
                                ))}
                            </div>
                            {deliveryMethodSelector}
                        </>
                    )}
                </div>

                {!isEmpty && (
                     <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 md:hidden z-20">
                        <div className="max-w-md mx-auto">
                            <div className="space-y-2 mb-4">
                                {subscription && (
                                    <div className="flex justify-between items-center text-md">
                                        <span className="text-gray-600">{t('subscriptionTotal')}</span>
                                        <span className="font-medium text-gray-800">SAR {subscriptionTotal.toFixed(2)}</span>
                                    </div>
                                )}
                                {items.length > 0 && (
                                    <div className="flex justify-between items-center text-md">
                                        <span className="text-gray-600">{t('oneTimeItems')} ({itemCount} {totalItemsText})</span>
                                        <span className="font-medium text-gray-800">SAR {mealsSubtotal.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-md">
                                    <span className="text-gray-600">{t('estimatedTax')}</span>
                                    <span className="font-medium text-gray-800">SAR {estimatedTax.toFixed(2)}</span>
                                </div>
                                 <div className="flex justify-between items-center text-md">
                                    <span className="text-gray-600">{t('deliveryFee')}</span>
                                    <span className={`font-medium ${deliveryFee === 0 ? 'text-primary' : 'text-gray-800'}`}>{deliveryFee > 0 ? `SAR ${deliveryFee.toFixed(2)}` : t('free')}</span>
                                </div>
                                <div className="border-t border-gray-200 my-2"></div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-bold text-gray-800">{t('total')}</span>
                                    <span className="font-bold text-gray-900 text-xl">SAR {total.toFixed(2)}</span>
                                </div>
                            </div>
                            <Link to="/checkout" state={{ deliveryMethod }}>
                                <button className="w-full bg-accent text-white font-extrabold py-4 rounded-xl text-lg shadow-lg hover:bg-accent-dark transition-transform hover:scale-105 active:scale-95">
                                    {t('checkout')}
                                </button>
                            </Link>
                        </div>
                     </div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <h1 className="text-4xl font-bold text-center text-text-primary mb-12 font-tajawal">{t('cartTitle')}</h1>
                 {isEmpty ? (
                    emptyCartView
                 ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            {subscription && <SubscriptionCartItem />}
                            {items.length > 0 && subscription && <h3 className="font-bold text-lg mt-4">{t('oneTimeItems')}</h3>}
                            {items.map(item => (
                                <DesktopCartItem key={item.meal.id} item={item} />
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <h2 className="text-2xl font-bold text-text-primary border-b pb-4 mb-4">{t('orderSummary')}</h2>
                                {deliveryMethodSelector}
                                <div className="space-y-3 text-text-secondary mt-6">
                                    {subscription && (
                                         <div className="flex justify-between">
                                            <span>{t('subscriptionTotal')}</span>
                                            <span className="font-medium text-text-primary">SAR {subscriptionTotal.toFixed(2)}</span>
                                        </div>
                                    )}
                                     {items.length > 0 && (
                                        <div className="flex justify-between">
                                            <span>{t('oneTimeItems')}</span>
                                            <span className="font-medium text-text-primary">SAR {mealsSubtotal.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>{t('estimatedTax')}</span>
                                        <span className="font-medium text-text-primary">SAR {estimatedTax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>{t('deliveryFee')}</span>
                                        <span className={`font-medium ${deliveryFee === 0 ? 'text-primary' : 'text-text-primary'}`}>{deliveryFee > 0 ? `SAR ${deliveryFee.toFixed(2)}` : t('free')}</span>
                                    </div>
                                </div>
                                <div className="border-t my-4"></div>
                                <div className="flex justify-between font-bold text-xl text-text-primary">
                                    <span>{t('total')}</span>
                                    <span>SAR {total.toFixed(2)}</span>
                                </div>
                                <Link to="/checkout" state={{ deliveryMethod }}>
                                    <button className="w-full mt-6 bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors duration-300">
                                        {t('checkout')}
                                    </button>
                                </Link>
                            </Card>
                        </div>
                    </div>
                 )}
            </div>
        </>
    );
};

export default CartPage;
