import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionPlan, Meal, DailyMealSelection } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { api } from '../../services/api';

interface SubscriptionConfiguratorProps {
    plan: SubscriptionPlan;
    onClose: () => void;
}

const MealSelectItem: React.FC<{
    meal: Meal;
    onIncrease: (meal: Meal) => void;
    onDecrease: (meal: Meal) => void;
    quantity: number;
    disabled: boolean;
}> = ({ meal, onIncrease, onDecrease, quantity, disabled }) => {
    const { language, t } = useLanguage();
    const name = language === 'ar' ? meal.name_ar : meal.name_en;

    return (
        <div className={`border rounded-xl transition-all duration-200 overflow-hidden flex flex-col ${quantity > 0 ? 'border-primary shadow-md' : 'border-gray-200'}`}>
            <img src={meal.image} alt={name} className="w-full h-24 object-cover" />
            <div className="p-2 flex-grow flex flex-col justify-between">
                <p className="text-xs font-semibold text-text-primary leading-tight h-8">{name}</p>
                {quantity === 0 ? (
                    <button
                        onClick={() => onIncrease(meal)}
                        disabled={disabled}
                        className="w-full mt-2 bg-accent/10 text-accent font-bold py-1 px-2 rounded-md hover:bg-accent/20 transition-colors text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        {t('add' as any)}
                    </button>
                ) : (
                    <div className="flex items-center justify-between mt-2">
                        <button
                            onClick={() => onDecrease(meal)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-md text-lg font-bold text-gray-700 hover:bg-gray-300 transition"
                        >
                            -
                        </button>
                        <span className="font-bold text-md text-gray-800">{quantity}</span>
                        <button
                            onClick={() => onIncrease(meal)}
                            disabled={disabled}
                            className="w-7 h-7 flex items-center justify-center bg-accent text-white rounded-md text-lg font-bold hover:bg-accent-dark transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const SubscriptionConfigurator: React.FC<SubscriptionConfiguratorProps> = ({ plan, onClose }) => {
    const { language, t } = useLanguage();
    const { addSubscription } = useCart();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [allMeals, setAllMeals] = useState<Meal[]>([]);
    const [loadingMeals, setLoadingMeals] = useState(true);
    const [selectedMeals, setSelectedMeals] = useState<DailyMealSelection[]>([]);
    const [activeDay, setActiveDay] = useState(1);

    const [customization, setCustomization] = useState({
        mealsPerDay: plan.mealsPerDay,
        daysPerWeek: plan.daysPerWeek,
    });
    
    useEffect(() => {
        const fetchMeals = async () => {
            setLoadingMeals(true);
            try {
                const meals = await api.fetchMeals();
                setAllMeals(meals);
            } catch (err) {
                console.error("Failed to fetch meals", err);
            } finally {
                setLoadingMeals(false);
            }
        };
        fetchMeals();
    }, []);
    
    useEffect(() => {
        if (step === 2) {
            // Initialize or update the daily selection structure when customization changes
            setSelectedMeals(Array.from({ length: customization.daysPerWeek }, (_, i) => {
                const existingDay = selectedMeals.find(d => d.day === i + 1);
                return existingDay || { day: i + 1, meals: [] };
            }));
             // Reset active day if it's out of new bounds
            if(activeDay > customization.daysPerWeek) {
                setActiveDay(1);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, customization.daysPerWeek]);

    const name = language === 'ar' ? plan.name_ar : plan.name_en;
    const pricePerMealPerDay = plan.basePriceSAR / (plan.mealsPerDay * plan.daysPerWeek);

    const totalPrice = useMemo(() => {
        return pricePerMealPerDay * customization.mealsPerDay * customization.daysPerWeek;
    }, [customization, pricePerMealPerDay]);
    
    const mealsForActiveDay = useMemo(() => {
        return selectedMeals.find(d => d.day === activeDay)?.meals || [];
    }, [selectedMeals, activeDay]);

    const countForActiveDay = useMemo(() => {
        return mealsForActiveDay.reduce((sum, item) => sum + item.quantity, 0);
    }, [mealsForActiveDay]);

    const isDayComplete = (dayNum: number): boolean => {
        const day = selectedMeals.find(d => d.day === dayNum);
        if (!day) return false;
        const count = day.meals.reduce((sum, item) => sum + item.quantity, 0);
        return count === customization.mealsPerDay;
    };
    
    const allDaysComplete = useMemo(() => {
        if (selectedMeals.length !== customization.daysPerWeek) return false;
        return selectedMeals.every(day => {
            const dayCount = day.meals.reduce((sum, item) => sum + item.quantity, 0);
            return dayCount === customization.mealsPerDay;
        });
    }, [selectedMeals, customization]);

    const handleIncrease = (meal: Meal) => {
        if (countForActiveDay >= customization.mealsPerDay) return;
        
        setSelectedMeals(prev => prev.map(day => {
            if (day.day === activeDay) {
                const existingMeal = day.meals.find(item => item.meal.id === meal.id);
                const updatedMeals = existingMeal
                    ? day.meals.map(item => item.meal.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item)
                    : [...day.meals, { meal, quantity: 1 }];
                return { ...day, meals: updatedMeals };
            }
            return day;
        }));
    };

    const handleDecrease = (meal: Meal) => {
        setSelectedMeals(prev => prev.map(day => {
            if (day.day === activeDay) {
                const existingMeal = day.meals.find(item => item.meal.id === meal.id);
                if (!existingMeal) return day;

                const updatedMeals = existingMeal.quantity > 1
                    ? day.meals.map(item => item.meal.id === meal.id ? { ...item, quantity: item.quantity - 1 } : item)
                    : day.meals.filter(item => item.meal.id !== meal.id);
                return { ...day, meals: updatedMeals };
            }
            return day;
        }));
    };

    const handleAddToCart = () => {
        if (!allDaysComplete) return;
        
        const cartItemMeals = selectedMeals.map(day => ({
            ...day,
            meals: day.meals.filter(item => item.quantity > 0)
        })).filter(day => day.meals.length > 0);
        
        addSubscription({ plan, customization, totalPrice, selectedMeals: cartItemMeals });
        addToast(t('subscriptionAdded'));
        onClose();
        navigate('/cart');
    };

    const Stepper: React.FC<{ label: string; value: number; onIncrease: () => void; onDecrease: () => void; }> = ({ label, value, onIncrease, onDecrease }) => (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
            <div className="flex items-center justify-center gap-4">
                <button onClick={onDecrease} className="w-10 h-10 flex items-center justify-center bg-gray-200 text-text-primary font-bold text-xl rounded-lg hover:bg-gray-300 transition-colors duration-300">-</button>
                <span className="font-bold text-2xl text-text-primary w-10 text-center">{value}</span>
                <button onClick={onIncrease} className="w-10 h-10 flex items-center justify-center bg-gray-200 text-text-primary font-bold text-xl rounded-lg hover:bg-gray-300 transition-colors duration-300">+</button>
            </div>
        </div>
    );
    
    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="configurator-title"
        >
            <div 
                className="bg-surface w-full max-w-3xl rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in-up flex flex-col"
                onClick={e => e.stopPropagation()}
                style={{maxHeight: '90vh'}}
            >
                {step === 1 && (
                    <>
                        <div className="text-center mb-6">
                            <h2 id="configurator-title" className="text-2xl md:text-3xl font-bold text-text-primary font-tajawal">{t('customizeYourPlan')}</h2>
                            <p className="text-text-secondary mt-1">{name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 my-8">
                            <Stepper 
                                label={t('mealsPerDay')}
                                value={customization.mealsPerDay}
                                onIncrease={() => setCustomization(c => ({...c, mealsPerDay: Math.min(5, c.mealsPerDay + 1)}))}
                                onDecrease={() => setCustomization(c => ({...c, mealsPerDay: Math.max(1, c.mealsPerDay - 1)}))}
                            />
                            <Stepper 
                                label={t('daysPerWeek')}
                                value={customization.daysPerWeek}
                                onIncrease={() => setCustomization(c => ({...c, daysPerWeek: Math.min(7, c.daysPerWeek + 1)}))}
                                onDecrease={() => setCustomization(c => ({...c, daysPerWeek: Math.max(3, c.daysPerWeek - 1)}))}
                            />
                        </div>

                        <div className="bg-primary/10 rounded-xl p-4 text-center my-8">
                            <p className="text-sm text-primary font-semibold">{t('pricePerWeek')}</p>
                            <p className="font-extrabold text-4xl text-primary tracking-tight">
                                {totalPrice.toFixed(2)} <span className="text-lg">SAR</span>
                            </p>
                        </div>
                        
                        <div className="mt-auto grid grid-cols-2 gap-3">
                            <button onClick={onClose} className="w-full text-text-secondary font-medium py-3 px-6 rounded-lg hover:bg-secondary transition-colors duration-300">Cancel</button>
                            <button onClick={() => setStep(2)} className="w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors duration-300">{t('nextStep' as any)}</button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="text-center mb-4">
                            <h2 id="configurator-title" className="text-2xl md:text-3xl font-bold text-text-primary font-tajawal">{t('selectMealsForPlan' as any)}</h2>
                            <p className="text-primary font-semibold mt-1">
                                {(t('mealsSelectedForDay' as any)).replace('{{count}}', String(countForActiveDay)).replace('{{total}}', String(customization.mealsPerDay))}
                            </p>
                        </div>
                        
                        <div className="flex space-x-2 rtl:space-x-reverse border-b overflow-x-auto no-scrollbar pb-2 mb-4">
                            {Array.from({ length: customization.daysPerWeek }, (_, i) => i + 1).map(dayNum => (
                                <button
                                    key={dayNum}
                                    onClick={() => setActiveDay(dayNum)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors duration-200 ${
                                        activeDay === dayNum ? 'bg-secondary text-primary border-b-2 border-primary' : 'text-text-secondary hover:bg-secondary/50'
                                    }`}
                                >
                                    <span>{(t('day_of_week') as any).replace('{{day}}', String(dayNum))}</span>
                                    {isDayComplete(dayNum) && <i className="fas fa-check-circle text-primary"></i>}
                                </button>
                            ))}
                        </div>

                        <div className="flex-grow overflow-y-auto my-4 -mx-4 px-4">
                            {loadingMeals ? (
                                <p className="text-center text-text-secondary">{t('loadingMenu')}</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {allMeals.map(meal => (
                                        <MealSelectItem 
                                            key={meal.id} 
                                            meal={meal}
                                            onIncrease={handleIncrease}
                                            onDecrease={handleDecrease}
                                            quantity={mealsForActiveDay.find(item => item.meal.id === meal.id)?.quantity ?? 0}
                                            disabled={countForActiveDay >= customization.mealsPerDay && (mealsForActiveDay.find(item => item.meal.id === meal.id)?.quantity ?? 0) === 0}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t">
                             <button onClick={() => setStep(1)} className="w-full text-text-secondary font-medium py-3 px-6 rounded-lg hover:bg-secondary transition-colors duration-300">{t('back' as any)}</button>
                            <button 
                                onClick={handleAddToCart}
                                disabled={!allDaysComplete}
                                className="w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {t('addSubscriptionToCart')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubscriptionConfigurator;