'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'call' | 'inquiry';

// Simple notification item
export interface NotificationItem {
    id: string;
    message: string;
    time: string;
    read: boolean;
    url?: string;
}

// ============ SIMPLE IN-MEMORY STORAGE ============
let notifications: NotificationItem[] = [];
let listeners: (() => void)[] = [];

// Tell all listening components to re-render
const notifyListeners = () => listeners.forEach(fn => fn());

// Add a notification
export const addNotification = (message: string, url?: string) => {
    notifications = [{
        id: Date.now().toString(),
        message,
        time: new Date().toISOString(),
        read: false,
        url
    }, ...notifications].slice(0, 20); // Keep max 20
    notifyListeners();
};

// Get all notifications
export const getNotifications = () => notifications;

// Mark all as read
export const markAllRead = () => {
    notifications = notifications.map(n => ({ ...n, read: true }));
    notifyListeners();
};

// Clear all
export const clearNotifications = () => {
    notifications = [];
    notifyListeners();
};

// Subscribe to changes (returns unsubscribe function)
export const subscribeNotifications = (fn: () => void) => {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
};

// ============ TOAST POPUP ============
let showToastFn: ((msg: string, type: ToastType) => void) | null = null;

export const showToast = (message: string, type: ToastType = 'info', url?: string) => {
    if (showToastFn) showToastFn(message, type);
    addNotification(message, url); // Also save to notification list
};

// Single Toast component
const Toast = ({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors: Record<ToastType, string> = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        call: 'bg-purple-500',
        inquiry: 'bg-yellow-500'
    };

    return (
        <div className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}>
            <p className="font-medium">{message}</p>
            <button onClick={onClose} className="ml-4 hover:opacity-70">✕</button>
        </div>
    );
};

// Container that shows all toasts - add this to layout.tsx
export const ToastContainer = () => {
    const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([]);

    useEffect(() => {
        let id = 0;
        showToastFn = (message, type) => {
            setToasts(prev => [...prev, { id: ++id, message, type }]);
        };
        return () => { showToastFn = null; };
    }, []);

    return (
        <div className="fixed top-20 right-4 z-[9999] space-y-2">
            {toasts.map(t => (
                <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
            ))}
        </div>
    );
};

export default Toast;
