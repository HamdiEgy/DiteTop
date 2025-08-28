
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import Card from '../components/ui/Card';
import { CartItem, SubscriptionCartItem } from '../types';

const OrderConfirmationPage: React.FC = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        // Redirect to home if no order details are found
        return (
            <div className="text-center py-16">
                <p className="text-lg text-gray-500 mb-4">No order details found.</p>
                <Link to="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg">
                    {t('backToHome')}
                </Link>
            </div>
        );
    }

    const { orderNumber, subscription, items } = order;
    
    // --- Calculation Logic --- (copied from checkout for summary)
    const TAX_RATE = 0.15;
    const DELIVERY_FEE = 15.00;
    const mealsSubtotal = (items as CartItem[]).reduce((sum: number, item: CartItem) => sum + item.meal.priceSAR * item.quantity, 0);
    const subscriptionTotal = (subscription as SubscriptionCartItem)?.totalPrice ?? 0;
    const subtotal = mealsSubtotal + subscriptionTotal;
    const estimatedTax = subtotal * TAX_RATE;
    const deliveryFee = order.deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
    const total = subtotal + estimatedTax + deliveryFee;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <Card className="max-w-3xl mx-auto text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-text-primary mb-2 font-tajawal">{t('orderConfirmation')}</h1>
                <p className="text-text-secondary mb-4">{t('thankYouForYourOrder')}</p>
                <p className="bg-secondary p-3 rounded-lg text-sm mb-6">{t('orderConfirmationMessage')}</p>
                
                <div className="mb-8">
                    <span className="text-text-secondary">{t('yourOrderNumber')}</span>
                    <p className="font-mono text-2xl font-bold text-primary tracking-wider">{orderNumber}</p>
                </div>

                <div className="text-left border-t pt-6">
                    <h2 className="text-xl font-bold mb-4">{t('orderSummary')}</h2>
                     <div className="space-y-2 text-text-secondary">
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
                            <span>{t('deliveryFee')}</span>
                            <span className={`font-medium ${deliveryFee === 0 ? 'text-primary' : 'text-text-primary'}`}>{deliveryFee > 0 ? `SAR ${deliveryFee.toFixed(2)}` : t('free')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t('estimatedTax')}</span>
                            <span className="font-medium text-text-primary">SAR {estimatedTax.toFixed(2)}</span>
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex justify-between font-bold text-lg text-text-primary">
                            <span>{t('total')}</span>
                            <span>SAR {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Link to="/" className="w-full sm:w-auto inline-block bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-dark transition-colors duration-300">
                        {t('backToHome')}
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default OrderConfirmationPage;
