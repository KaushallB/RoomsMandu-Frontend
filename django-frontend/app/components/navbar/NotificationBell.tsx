'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/app/lib/actions';
import { 
    showToast,
    addNotification,
    NotificationItem, 
    getNotifications,
    subscribeNotifications,
    markAllRead,
    clearNotifications
} from '../Toast';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const router = useRouter();

    const unreadCount = notifications.filter(n => !n.read).length;

    // Connect to WebSocket for real-time notifications
    useEffect(() => {
        const init = async () => {
            const uid = await getUserId();
            setUserId(uid);
            
            if (uid) {
                // Load current notifications
                setNotifications(getNotifications());

                // Connect to notification WebSocket
                const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${uid}/`);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('Notification WebSocket connected');
                };

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    console.log('Notification received:', data);
                    
                    // Add to notification list with URL
                    addNotification(data.message, data.url);
                    setNotifications(getNotifications());
                    
                    // Show toast popup
                    showToast(data.message, data.type || 'info', data.url);
                };

                ws.onerror = (error) => {
                    console.log('Notification WebSocket error:', error);
                };
            }
        };

        init();

        // Subscribe to notification changes (from Toast.tsx storage)
        const unsubscribe = subscribeNotifications(() => {
            setNotifications(getNotifications());
        });

        return () => {
            unsubscribe();
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllRead = () => {
        markAllRead();
        setNotifications(getNotifications());
    };

    const handleClearAll = () => {
        clearNotifications();
        setNotifications([]);
    };

    const formatTime = (time: string) => {
        const d = new Date(time);
        const now = new Date();
        const diff = (now.getTime() - d.getTime()) / 1000;
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return d.toLocaleDateString();
    };

    if (!userId) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-800 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <div className="space-x-2">
                            <button onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:underline">
                                Mark all read
                            </button>
                            <button onClick={handleClearAll} className="text-xs text-gray-500 hover:underline">
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    onClick={() => {
                                        if (notif.url) {
                                            router.push(notif.url);
                                            setIsOpen(false);
                                        }
                                    }}
                                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notif.read ? 'bg-blue-50' : ''} ${notif.url ? 'cursor-pointer' : ''}`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <span className="text-xl">🔔</span>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800">{notif.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatTime(notif.time)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
