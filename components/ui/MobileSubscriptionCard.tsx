
import React from 'react';
import { SubscriptionPlan } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const MobileSubscriptionCard: React.FC<{ plan: SubscriptionPlan, onSubscribeClick: (plan: SubscriptionPlan) => void }> = ({ plan, onSubscribeClick }) => {
  const { language, t } = useLanguage();

  const name = language === 'ar' ? plan.name_ar : plan.name_en;
  const description = language === 'ar' ? plan.description_ar : plan.description_en;
  const typeTextKey = plan.type as 'weekly' | 'monthly' | 'yearly';
  const typeText = t(typeTextKey);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-xl font-bold text-text-primary font-tajawal">{name}</h3>
            <p className="text-text-secondary text-sm">{description}</p>
        </div>
        <p className="text-xs bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full flex-shrink-0">{typeText}</p>
      </div>
      
      <ul className="space-y-2 text-text-primary my-4 text-sm">
        <li className="flex items-center gap-2 rtl:space-x-reverse">
            <CheckIcon /> <span>{plan.mealsPerDay} {t('mealsPerDay')}</span>
        </li>
        <li className="flex items-center gap-2 rtl:space-x-reverse">
            <CheckIcon /> <span>{plan.daysPerWeek} {t('daysPerWeek')}</span>
        </li>
      </ul>

      <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
        <div>
            <span className="text-2xl font-extrabold text-text-primary">{plan.basePriceSAR}</span>
            <span className="text-text-secondary text-sm"> SAR</span>
        </div>
        <button 
          onClick={() => onSubscribeClick(plan)}
          className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors duration-300 text-sm"
        >
            {t('subscribeNow')}
        </button>
      </div>
    </div>
  );
};

export default MobileSubscriptionCard;
