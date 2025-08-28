
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
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
import { useAuth } from './hooks/useAuth';
import MealDetailPage from './pages/MealDetailPage';
import Toast from './components/ui/Toast';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

const PrivateRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/profile" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
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
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/meal/:mealId" element={<MealDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/subscriptions" element={<SubscriptionsPage />} />
                      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                      <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                      <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
                      <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
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
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
