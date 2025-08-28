import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import MealPlanner from '../components/ui/MealPlanner';

const MealPlannerPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-primary mb-2 font-tajawal">{t('mealPlannerTitle')}</h1>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">{t('mealPlannerSubtitle')}</p>
      </div>
      <MealPlanner />
    </div>
  );
};

export default MealPlannerPage;