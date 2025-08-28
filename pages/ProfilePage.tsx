
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Order, OrderStatus, UserSubscription, SubscriptionStatus, CartItem } from '../types';
import { mockOrders, mockUserSubscriptions, mockUsers } from '../data/mockData';

const getStatusBadgeStyle = (status: OrderStatus | SubscriptionStatus, t: (key: string) => string) => {
    let textKey = `status_${status.toLowerCase()}`;
    let className = '';
    switch (status) {
        case OrderStatus.PENDING:
        case SubscriptionStatus.ACTIVE:
            className = 'bg-green-100 text-green-800';
            break;
        case OrderStatus.PREPARING:
            className = 'bg-yellow-100 text-yellow-800';
            break;
        case OrderStatus.OUT_FOR_DELIVERY:
            className = 'bg-blue-100 text-blue-800';
            break;
        case OrderStatus.DELIVERED:
        case SubscriptionStatus.PAUSED:
            className = 'bg-gray-100 text-gray-800';
            break;
        case OrderStatus.CANCELLED:
        case SubscriptionStatus.CANCELLED:
        case SubscriptionStatus.EXPIRED:
            className = 'bg-red-100 text-red-800';
            break;
        default:
            className = 'bg-gray-100 text-gray-800';
    }
    return { text: t(textKey as any), className };
};

const OrderCard: React.FC<{ order: Order, isExpanded: boolean, onToggle: () => void }> = ({ order, isExpanded, onToggle }) => {
    const { t, language } = useLanguage();
    const { text, className } = getStatusBadgeStyle(order.status, t);
    const canModify = order.status === OrderStatus.PENDING;

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 transition-all duration-300">
            <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
                <div>
                    <p className="font-bold text-text-primary">{t('orderNumber')} {order.orderNumber}</p>
                    <p className="text-sm text-text-secondary">{t('orderDate')}: {order.date}</p>
                </div>
                <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${className}`}>{text}</span>
                     <i className={`fas fa-chevron-down transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-text-primary mb-2">Items:</h4>
                    <ul className="space-y-2">
                        {order.items.map((item: CartItem) => (
                            <li key={item.meal.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <img src={item.meal.image} alt="" className="w-8 h-8 rounded-md object-cover"/>
                                    <span>{language === 'ar' ? item.meal.name_ar : item.meal.name_en}</span>
                                </div>
                                <span>x{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="text-right font-bold mt-3">{t('orderTotal')}: SAR {order.total.toFixed(2)}</div>
                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-secondary text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors text-sm">{t('trackOrder')}</button>
                        <button disabled={!canModify} className="flex-1 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed">{t('modifyOrder')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SubscriptionCard: React.FC<{ sub: UserSubscription, isExpanded: boolean, onToggle: () => void }> = ({ sub, isExpanded, onToggle }) => {
    const { t, language } = useLanguage();
    const { text, className } = getStatusBadgeStyle(sub.status, t);
    const name = language === 'ar' ? sub.plan.name_ar : sub.plan.name_en;

    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 transition-all duration-300">
            <div className="flex justify-between items-center cursor-pointer" onClick={onToggle}>
                <div>
                    <p className="font-bold text-text-primary">{name}</p>
                    <p className="text-sm text-text-secondary">{t('startDate')}: {sub.startDate}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${className}`}>{text}</span>
                     <i className={`fas fa-chevron-down transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                </div>
            </div>
             {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                     <p className="text-sm text-text-secondary mb-2">{t('nextRenewal')}: {sub.nextRenewalDate}</p>
                     {sub.selectedMeals.length > 0 && (
                        <div>
                             <h4 className="font-semibold text-text-primary mb-2 mt-3">{t('selectedMeals')}:</h4>
                             <div className="space-y-2">
                                {sub.selectedMeals.map(day => (
                                    <div key={day.day}>
                                        <p className="font-bold text-sm">{(t('day_of_week') as any).replace('{{day}}', String(day.day))}</p>
                                         <div className="flex flex-wrap gap-1">
                                            {day.meals.map(item => (
                                                <span key={item.meal.id} className="bg-gray-100 py-1 px-2 rounded-full text-xs">
                                                    {language === 'ar' ? item.meal.name_ar : item.meal.name_en} {item.quantity > 1 ? `(x${item.quantity})` : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                     )}
                     <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors text-sm">{t('modifySubscription')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};


const ProfilePage: React.FC = () => {
    const { t } = useLanguage();
    
    // Use a static mock user since authentication is removed
    const user = mockUsers[0];

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions'>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, phone: user.phone, address: user.address || '' });
        }
        // This would be an API call in a real app
        setOrders(mockOrders);
        setSubscriptions(mockUserSubscriptions);
    }, [user]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        // In a real app, this would call an API to update data.
        // Here, it just simulates saving.
        console.log("Saving data:", formData);
        setIsEditing(false);
    };
    
    const getTabClass = (tab: 'orders' | 'subscriptions') => (
        `py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-md' : 'bg-transparent text-gray-600'}`
    );

    const InfoRow: React.FC<{ label: string, value: string, name: string }> = ({ label, value, name }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-text-secondary">{label}</span>
            {isEditing ? (
                 <input type={name === 'phone' ? 'tel' : 'text'} name={name} value={value} onChange={handleInputChange} className="w-2/3 text-right rtl:text-left font-semibold text-text-primary bg-secondary p-1 rounded-md"/>
            ) : (
                <span className="font-semibold text-text-primary text-right">{value || 'N/A'}</span>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-surface rounded-2xl shadow-md p-8 mb-8">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-6">
                                <img src="https://pngdownload.io/wp-content/uploads/2024/03/Male-user-avatar-icon-transparent-PNG-image-jpg.webp" alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"/>
                                <div>
                                    {isEditing ? (
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-3xl font-bold text-text-primary bg-secondary p-1 rounded-md mb-1"/>
                                    ) : (
                                        <h2 className="text-3xl font-bold text-text-primary">{formData.name}</h2>
                                    )}
                                    <p className="text-text-secondary">{user.email}</p>
                                </div>
                            </div>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="bg-secondary text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors">{t('editProfile')}</button>
                            ) : (
                                <div className="flex gap-2">
                                     <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-text-primary font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">{t('cancel')}</button>
                                     <button onClick={handleSave} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors">{t('saveChanges')}</button>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 border-t pt-6 space-y-2">
                           <InfoRow label={t('phone')} value={formData.phone} name="phone" />
                           <InfoRow label={t('address')} value={formData.address} name="address" />
                        </div>
                    </div>
                    
                    <div className="flex border-b mb-6">
                        <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 font-semibold ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>{t('myOrders')}</button>
                        <button onClick={() => setActiveTab('subscriptions')} className={`px-6 py-3 font-semibold ${activeTab === 'subscriptions' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`}>{t('mySubscriptions')}</button>
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'orders' && orders.map(order => <OrderCard key={order.id} order={order} isExpanded={expandedOrderId === order.id} onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} />)}
                        {activeTab === 'subscriptions' && subscriptions.map(sub => <SubscriptionCard key={sub.id} sub={sub} isExpanded={expandedSubId === sub.id} onToggle={() => setExpandedSubId(expandedSubId === sub.id ? null : sub.id)} />)}
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden bg-stone-50 min-h-full p-5">
                <div className="flex flex-col items-center mb-6">
                    <img src="https://pngdownload.io/wp-content/uploads/2024/03/Male-user-avatar-icon-transparent-PNG-image-jpg.webp" alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-white/50 shadow-lg"/>
                     {isEditing ? (
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-2xl font-bold text-text-primary bg-secondary p-1 rounded-md mb-1 text-center"/>
                     ) : (
                        <h2 className="text-2xl font-bold text-text-primary">{formData.name}</h2>
                     )}
                    <p className="text-text-secondary">{user.email}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                    <div className="flex justify-end mb-2">
                         {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="text-sm bg-secondary text-text-primary font-bold py-1 px-3 rounded-lg hover:bg-secondary-dark">{t('editProfile')}</button>
                         ) : (
                             <div className="flex gap-2">
                                 <button onClick={() => setIsEditing(false)} className="text-sm bg-gray-200 text-text-primary font-bold py-1 px-3 rounded-lg">{t('cancel')}</button>
                                 <button onClick={handleSave} className="text-sm bg-accent text-white font-bold py-1 px-3 rounded-lg">{t('saveChanges')}</button>
                            </div>
                         )}
                    </div>
                    <InfoRow label={t('phone')} value={formData.phone} name="phone" />
                    <InfoRow label={t('address')} value={formData.address} name="address" />
                </div>
                
                 <div className="bg-gray-200/70 rounded-xl p-1 mb-6 sticky top-0 backdrop-blur-sm z-10">
                    <div className="grid grid-cols-2 gap-1 text-center">
                        <button onClick={() => setActiveTab('orders')} className={getTabClass('orders')}>{t('myOrders')}</button>
                        <button onClick={() => setActiveTab('subscriptions')} className={getTabClass('subscriptions')}>{t('mySubscriptions')}</button>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {activeTab === 'orders' && (orders.length > 0 ? orders.map(order => <OrderCard key={order.id} order={order} isExpanded={expandedOrderId === order.id} onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} />) : <p className="text-center text-text-secondary">No orders yet.</p>)}
                    {activeTab === 'subscriptions' && (subscriptions.length > 0 ? subscriptions.map(sub => <SubscriptionCard key={sub.id} sub={sub} isExpanded={expandedSubId === sub.id} onToggle={() => setExpandedSubId(expandedSubId === sub.id ? null : sub.id)} />) : <p className="text-center text-text-secondary">No subscriptions yet.</p>)}
                 </div>
            </div>
        </>
    );
};

export default ProfilePage;
