'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId } from '@/app/lib/actions';

interface Notification {
  message: string;
  type: string;
  url?: string;
}

const ToastNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const uid = await getUserId();
      if (!uid || wsRef.current) return;

      const wsBase = process.env.NEXT_PUBLIC_WS_HOST || 'ws://localhost:8000/ws';
      const ws = new WebSocket(`${wsBase}/notifications/${uid}/`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message) {
          setNotification({
            message: data.message,
            type: data.type || 'info',
            url: data.url || '/videocalls', // Default to video calls page
          });
          setTimeout(() => setNotification(null), 7000);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        setTimeout(init, 3000);
      };
    };
    init();
    return () => {
      wsRef.current?.close();
    };
  }, []);

  if (!notification) return null;

  // Determine redirect URL based on notification type/message
  let redirectUrl = '/videocalls';
  if (notification) {
    if (
      notification.message.toLowerCase().includes('chat') ||
      notification.message.toLowerCase().includes('message') ||
      notification.type === 'chat'
    ) {
      redirectUrl = '/inbox';
    } else if (
      notification.message.toLowerCase().includes('video call') ||
      notification.type === 'call'
    ) {
      redirectUrl = '/videocalls';
    } else if (notification.url) {
      redirectUrl = notification.url;
    }
  }
  return (
    <div
      className="fixed top-6 right-6 z-[9999] bg-white border border-gray-200 shadow-lg rounded-xl px-6 py-4 cursor-pointer min-w-[250px] max-w-xs"
      onClick={() => router.push(redirectUrl)}
    >
      <div className={`font-semibold mb-1 ${notification?.type === 'success' ? 'text-green-600' : notification?.type === 'error' ? 'text-red-600' : 'text-purple-600'}`}>
        🔔 {notification?.message}
      </div>
      <div className="text-xs text-gray-400">Click to view</div>
    </div>
  );
};

export default ToastNotification;
