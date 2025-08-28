
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BottomNavBar from './components/layout/BottomNavBar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import MealDetailPage from './pages/MealDetailPage';
import Toast from './components/ui/Toast';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

const App: React.FC = () => {
  return (
    <LanguageProvider>
        <CartProvider>
          <ToastProvider>
            <HashRouter>
              <div className="max-w-7xl mx-auto md:bg-background/80 md:backdrop-blur-xl md:rounded-2xl md:shadow-xl md:border md:border-white/20 md:overflow-hidden">
                <div className="flex flex-col min-h-screen font-body text-text-primary bg-stone-50 md:bg-transparent">
                  <div className="hidden md:block">
                    <Header />
                  </div>
                  <main className="flex-grow overflow-y-auto pb-24 md:pb-0">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/meal/:mealId" element={<MealDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/subscriptions" element={<SubscriptionsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                  </main>
                  <div className="hidden md:block">
                    <Footer />
                  </div>
                  <BottomNavBar />
                  <Toast />
                </div>
              </div>
            </HashRouter>
          </ToastProvider>
        </CartProvider>
    </LanguageProvider>
  );
};

export default App;
