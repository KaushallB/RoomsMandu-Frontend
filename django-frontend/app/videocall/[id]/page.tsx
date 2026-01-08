'use client';

import { use, useEffect, useState } from 'react';
import apiService from '@/app/services/apiService';
import { getUserId } from '@/app/lib/actions';

export default function VideoCallRoom({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [call, setCall] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCall = async () => {
            try {
                const user = await getUserId();
                setUserId(user);
                
                const response = await apiService.get(`/api/v1/properties/video-calls/${id}/`);
                setCall(response);
            } catch (error) {
                // console.error('Error fetching call:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCall();
    }, [id]);

    if (loading) {
        return <div className="max-w-[1500px] mx-auto px-6 py-12">Loading...</div>;
    }

    if (!call) {
        return <div className="max-w-[1500px] mx-auto px-6 py-12">Video call not found</div>;
    }

    if (call.status !== 'confirmed') {
        return (
            <div className="max-w-[1500px] mx-auto px-6 py-12">
                <h1 className="text-2xl font-bold mb-4">Video Call Not Confirmed</h1>
                <p>This video call is still pending confirmation.</p>
            </div>
        );
    }

    return (
        <main className="h-screen w-full bg-gray-900">
            <div className="h-full flex flex-col">
                <div className="bg-gray-800 p-4 text-white">
                    <h1 className="text-xl font-semibold">
                        Video Call - {call.property.title}
                    </h1>
                    <p className="text-sm text-gray-300">
                        Scheduled: {new Date(call.scheduled_time).toLocaleString()}
                    </p>
                </div>
                
                <iframe
                    src={call.jitsi_url}
                    allow="camera; microphone; fullscreen; display-capture"
                    className="flex-1 w-full border-0"
                    title="Video Call"
                />
            </div>
        </main>
    );
}
