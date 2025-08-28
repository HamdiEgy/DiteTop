
import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import Card from '../components/ui/Card';

type Tab = 'menu' | 'orders' | 'users';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('menu');

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return <p className="text-text-secondary">Menu management tools would be here.</p>;
      case 'orders':
        return <p className="text-text-secondary">Order management tools would be here.</p>;
      case 'users':
        return <p className="text-text-secondary">User management tools would be here.</p>;
      default:
        return null;
    }
  };

  const getTabClass = (tab: Tab) => {
      return activeTab === tab 
      ? 'border-primary text-primary'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  const getMobileTabClass = (tab: Tab) => {
      return activeTab === tab 
      ? 'bg-white text-gray-900 shadow-md'
      : 'bg-transparent text-gray-600';
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-text-primary mb-12 font-tajawal">{t('adminDashboard')}</h2>
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
              <button onClick={() => setActiveTab('menu')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('menu')}`}>{t('manageMenu')}</button>
              <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('orders')}`}>{t('manageOrders')}</button>
              <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('users')}`}>{t('manageUsers')}</button>
            </nav>
          </div>
          <div className="py-8">
            {renderContent()}
          </div>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden bg-stone-50 min-h-full p-5">
         <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">{t('adminDashboard')}</h1>
         
         <div className="bg-gray-200/70 rounded-xl p-1 mb-6 sticky top-0 backdrop-blur-sm z-10">
            <div className="grid grid-cols-3 gap-1 text-center">
                <button onClick={() => setActiveTab('menu')} className={`py-2.5 rounded-lg text-sm font-bold transition-all ${getMobileTabClass('menu')}`}>{t('manageMenu')}</button>
                <button onClick={() => setActiveTab('orders')} className={`py-2.5 rounded-lg text-sm font-bold transition-all ${getMobileTabClass('orders')}`}>{t('manageOrders')}</button>
                <button onClick={() => setActiveTab('users')} className={`py-2.5 rounded-lg text-sm font-bold transition-all ${getMobileTabClass('users')}`}>{t('manageUsers')}</button>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm">
            {renderContent()}
         </div>
      </div>
    </>
  );
};

export default AdminDashboard;
