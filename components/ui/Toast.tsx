import React, { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';

const ToastMessage: React.FC<{ message: string; onClose: () => void; }> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Auto-dismiss after 3 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="bg-accent text-white font-bold py-3 px-5 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-up">
            <span>{message}</span>
            <button onClick={onClose} className="ltr:ml-4 rtl:mr-4 -my-1 -mx-1 p-1 opacity-70 hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

const Toast: React.FC = () => {
    const { toasts, removeToast } = useToast();

    if (!toasts.length) {
        return null;
    }

    return (
        <div className="fixed bottom-5 ltr:right-5 rtl:left-5 z-[100] flex flex-col items-end gap-3">
            {toasts.map(toast => (
                <ToastMessage key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

export default Toast;
