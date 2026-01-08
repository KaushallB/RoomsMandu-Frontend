'use client';

import { useEffect, useState, useRef } from 'react';
import { getAccessToken, getUserId } from '@/app/lib/actions';

interface IncomingCall {
    callerName: string;
    roomName: string;
    jitsiUrl: string;
    conversationId: string;
}

const CallNotification = () => {
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const ringtoneIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const init = async () => {
            const uid = await getUserId();
            if (!uid || wsRef.current) return;

            const wsBase =
                process.env.NEXT_PUBLIC_WS_HOST || 'ws://localhost:8000/ws';
            const ws = new WebSocket(`${wsBase}/calls/${uid}/`);
            wsRef.current = ws;

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.event === 'incoming_call' && data.caller_id !== uid) {
                    playRingtone();
                    setIncomingCall({
                        callerName: data.caller_name,
                        roomName: data.room_name,
                        jitsiUrl: data.jitsi_url,
                        conversationId: data.conversation_id,
                    });
                }

                if (data.event === 'call_cancelled') {
                    stopRingtone();
                    setIncomingCall(null);
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
            stopRingtone();
        };
    }, []);

    const playRingtone = () => {
        try {
            const audioContext =
                new (window.AudioContext ||
                    (window as any).webkitAudioContext)();

            const playBeep = () => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value = 440;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.3;
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
            };

            playBeep();
            ringtoneIntervalRef.current = setInterval(playBeep, 500);
        } catch {}
    };

    const stopRingtone = () => {
        if (ringtoneIntervalRef.current) {
            clearInterval(ringtoneIntervalRef.current);
            ringtoneIntervalRef.current = null;
        }
    };

    const acceptCall = () => {
        if (!incomingCall || !wsRef.current) return;

        wsRef.current.send(
            JSON.stringify({
                event: 'call_accepted',
                conversation_id: incomingCall.conversationId,
            })
        );

        stopRingtone();
        window.open(incomingCall.jitsiUrl, '_blank');
        setIncomingCall(null);
    };

    const declineCall = () => {
        if (!incomingCall || !wsRef.current) return;

        wsRef.current.send(
            JSON.stringify({
                event: 'call_declined',
                conversation_id: incomingCall.conversationId,
            })
        );

        stopRingtone();
        setIncomingCall(null);
    };

    if (!incomingCall) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-bounce-slow">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold mb-2"> Incoming Video Call</h3>
                <p className="text-gray-600 mb-6">{incomingCall.callerName} is calling you...</p>
                <div className="flex space-x-4">
                    <button
                        onClick={declineCall}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
                    >
                        <span>❌</span>
                        <span>Decline</span>
                    </button>
                    <button
                        onClick={acceptCall}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
                    >
                        <span></span>
                        <span>Accept</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallNotification;
