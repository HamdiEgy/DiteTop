
import React, { useEffect, useState } from 'react';
import { SubscriptionPlan } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import SubscriptionCard from '../components/ui/SubscriptionCard';
import MobileSubscriptionCard from '../components/ui/MobileSubscriptionCard';
import SubscriptionConfigurator from '../components/ui/SubscriptionConfigurator';

const SubscriptionsPage: React.FC = () => {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const plansData = await api.fetchSubscriptionPlans();
        setPlans(plansData);
      } catch (error) {
        console.error("Failed to fetch subscription plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const handleSubscribeClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };
  
  const handleCloseConfigurator = () => {
    setSelectedPlan(null);
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-text-primary mb-12 font-tajawal">{t('ourPlans')}</h2>
        
        {loading ? (
          <div className="text-center text-lg text-text-secondary">{t('loadingPlans' as any)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map(plan => (
              <SubscriptionCard key={plan.id} plan={plan} onSubscribeClick={handleSubscribeClick} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-stone-50 min-h-full p-5">
         <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('ourPlans')}</h1>
         {loading ? (
            <div className="text-center text-lg text-text-secondary">{t('loadingPlans' as any)}</div>
         ) : (
           <div className="flex flex-col gap-6">
             {plans.map(plan => (
               <MobileSubscriptionCard key={plan.id} plan={plan} onSubscribeClick={handleSubscribeClick} />
             ))}
           </div>
         )}
      </div>
      
      {selectedPlan && (
        <SubscriptionConfigurator 
          plan={selectedPlan}
          onClose={handleCloseConfigurator}
        />
      )}
    </>
  );
};

export default SubscriptionsPage;
