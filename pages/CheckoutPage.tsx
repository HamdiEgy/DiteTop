
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCart } from '../hooks/useCart';
import Card from '../components/ui/Card';

const CheckoutPage: React.FC = () => {
    const { t } = useLanguage();
    const { items, subscription, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const deliveryMethod = location.state?.deliveryMethod || 'delivery';

    const [step, setStep] = useState(1);
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        phone: '',
        address: '',
    });
    const [schedule, setSchedule] = useState({ date: 'today', time: 'morning' });
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleScheduleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSchedule({ ...schedule, [e.target.name]: e.target.value });
    };

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        setStep(2);
    };

    const handlePlaceOrder = () => {
        const orderDetails = {
            orderNumber: Date.now(),
            shippingInfo,
            deliveryMethod,
            schedule,
            paymentMethod,
            items,
            subscription
        };
        // In a real app, you would send this to your backend
        console.log("Order Placed:", orderDetails);
        clearCart();
        navigate('/order-confirmation', { state: { order: orderDetails }, replace: true });
    };

    // --- Calculation Logic ---
    const TAX_RATE = 0.15;
    const DELIVERY_FEE = 15.00;
    const mealsSubtotal = items.reduce((sum, item) => sum + item.meal.priceSAR * item.quantity, 0);
    const subscriptionTotal = subscription?.totalPrice ?? 0;
    const subtotal = mealsSubtotal + subscriptionTotal;
    const estimatedTax = subtotal * TAX_RATE;
    const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
    const total = subtotal + estimatedTax + deliveryFee;

    const OrderSummary = () => (
        <Card className="sticky top-24">
            <h2 className="text-2xl font-bold text-text-primary border-b pb-4 mb-4">{t('orderSummary')}</h2>
            <div className="space-y-3 text-text-secondary">
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
        </Card>
    );
    
    const PaymentMethodOption: React.FC<{ value: string; title: string; icon?: string; children?: React.ReactNode }> = ({ value, title, icon, children }) => (
        <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === value ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
            <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={(e) => setPaymentMethod(e.target.value)} className="absolute opacity-0" />
            {icon && <img src={icon} alt={title} className="w-10 h-10 object-contain ltr:mr-4 rtl:ml-4" />}
            <span className="font-bold text-text-primary">{title}</span>
            {children}
        </label>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-text-primary mb-8 font-tajawal">{t('checkoutTitle')}</h1>

            <div className="max-w-xl mx-auto mb-8 text-center">
                <div className="flex justify-center items-center">
                    <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary font-bold' : 'text-text-secondary'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 1 ? 'bg-primary border-primary text-white' : 'bg-gray-200 border-gray-200'}`}>1</div>
                        <span>{t('stepShipping')}</span>
                    </div>
                    <div className="flex-grow h-0.5 bg-gray-200 mx-4"></div>
                    <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary font-bold' : 'text-text-secondary'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'bg-primary border-primary text-white' : 'bg-gray-200 border-gray-200'}`}>2</div>
                        <span>{t('stepPayment')}</span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2">
                    {/* --- STEP 1: SHIPPING --- */}
                    {step === 1 && (
                        <Card>
                            <form id="shipping-form" onSubmit={handleShippingSubmit}>
                                <h2 className="text-2xl font-bold mb-6">{t('shippingInformation')}</h2>
                                {deliveryMethod === 'pickup' ? (
                                    <div className="mb-6 p-4 bg-secondary rounded-lg">
                                        <h3 className="font-bold text-text-primary">{t('pickupAddress')}</h3>
                                        <p className="text-text-secondary">{t('pickupAddressDetails')}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-text-primary">{t('fullName')}</label>
                                            <input type="text" name="name" id="name" value={shippingInfo.name} onChange={handleInfoChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-text-primary">{t('phoneNumber')}</label>
                                            <input type="tel" name="phone" id="phone" value={shippingInfo.phone} onChange={handleInfoChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                                        </div>
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-text-primary">{t('deliveryAddress')}</label>
                                            <input type="text" name="address" id="address" value={shippingInfo.address} onChange={handleInfoChange} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t">
                                    <h2 className="text-2xl font-bold mb-6">{t('deliverySchedule')}</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-text-primary">{t('date')}</label>
                                            <select name="date" id="date" value={schedule.date} onChange={handleScheduleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                                <option value="today">{t('today')}</option>
                                                <option value="tomorrow">{t('tomorrow')}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="time" className="block text-sm font-medium text-text-primary">{t('time')}</label>
                                            <select name="time" id="time" value={schedule.time} onChange={handleScheduleChange} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                                <option value="morning">{t('morning')}</option>
                                                <option value="afternoon">{t('afternoon')}</option>
                                                <option value="evening">{t('evening')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <button type="submit" className="hidden lg:block w-full mt-8 bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors duration-300">
                                    {t('continueToPayment')}
                                </button>
                            </form>
                        </Card>
                    )}

                    {/* --- STEP 2: PAYMENT --- */}
                    {step === 2 && (
                        <Card>
                             <h2 className="text-2xl font-bold mb-6">{t('paymentMethod')}</h2>
                             <div className="space-y-4">
                                <PaymentMethodOption value="cod" title={t('cashOnDelivery')} />
                                <PaymentMethodOption value="bank" title={t('bankTransfer')} />
                                <PaymentMethodOption value="visa" title={t('payWithVisa')} icon="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" />
                                <PaymentMethodOption value="tabby" title={t('payWithTabby')} icon="https://file.hamdi.top/icons/tabby.png" />
                                <PaymentMethodOption value="tamara" title={t('payWithTamara')} icon="https://file.hamdi.top/icons/tamara.png" />
                             </div>
                             <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-4">
                                <button onClick={() => setStep(1)} className="w-full sm:w-auto text-text-secondary font-medium py-3 px-6 rounded-lg hover:bg-secondary transition-colors duration-300">
                                    {t('backToShipping')}
                                </button>
                                <button onClick={handlePlaceOrder} className="w-full sm:flex-grow bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-accent-dark transition-colors duration-300">
                                    {t('placeOrder')}
                                </button>
                             </div>
                        </Card>
                    )}

                </div>
                <div className="lg:col-span-1">
                    <div className="hidden lg:block">
                        <OrderSummary />
                    </div>
                </div>
            </div>
            
            {/* Order Summary for Mobile */}
            <div className="lg:hidden fixed bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t z-20">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-text-secondary">{t('total')}</span>
                        <p className="font-bold text-xl text-text-primary">SAR {total.toFixed(2)}</p>
                    </div>
                    {step === 1 ? (
                        <button form="shipping-form" type="submit" className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-dark transition-colors">
                            {t('continueToPayment')}
                        </button>
                    ) : (
                        <button onClick={handlePlaceOrder} className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-dark transition-colors">
                            {t('placeOrder')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
