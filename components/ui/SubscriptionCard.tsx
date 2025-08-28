
import React from 'react';
import { SubscriptionPlan } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

const SubscriptionCard: React.FC<{ plan: SubscriptionPlan, onSubscribeClick: (plan: SubscriptionPlan) => void }> = ({ plan, onSubscribeClick }) => {
  const { language, t } = useLanguage();

  const name = language === 'ar' ? plan.name_ar : plan.name_en;
  const description = language === 'ar' ? plan.description_ar : plan.description_en;
  const typeTextKey = plan.type as 'weekly' | 'monthly' | 'yearly';
  const typeText = t(typeTextKey);

  return (
    <div className="bg-surface rounded-2xl shadow-md p-8 flex flex-col text-center transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-text-primary font-tajawal">{name}</h3>
        <p className="text-sm text-primary font-semibold uppercase tracking-widest">{typeText}</p>
      </div>
      <p className="text-text-secondary mb-6 flex-grow">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-extrabold text-text-primary">{plan.basePriceSAR}</span>
        <span className="text-text-secondary"> SAR / {typeText}</span>
      </div>
      <ul className="space-y-2 text-text-primary mb-8">
        <li>✔ {plan.mealsPerDay} {t('mealsPerDay')}</li>
        <li>✔ {plan.daysPerWeek} {t('daysPerWeek')}</li>
      </ul>
      <button 
        onClick={() => onSubscribeClick(plan)}
        className="mt-auto w-full bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors duration-300"
      >
        {t('subscribeNow')}
      </button>
    </div>
  );
};

export default SubscriptionCard;
