'use client';

import { useEffect, useState } from 'react';
import { getUserId } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import Link from 'next/link';
import { showToast } from '@/app/components/Toast';

interface VideoCall {
    id: string;
    property: any;
    scheduled_time: string;
    status: string;
    jitsi_url: string;
    tenant: any;
    landlord: any;
}

export default function VideoCallsPage() {
    const [calls, setCalls] = useState<VideoCall[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const user = await getUserId();
                setUserId(user);
                
                const response = await apiService.get('/api/v1/properties/video-calls/');
                // Make sure response is an array
                setCalls(Array.isArray(response) ? response : []);
            } catch (error) {
                console.error('Error fetching video calls:', error);
                setCalls([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCalls();
    }, []);

    const confirmCall = async (callId: string) => {
        try {
            await apiService.post(`/api/v1/properties/video-calls/${callId}/confirm/`, {});
            // Refresh calls
            const response = await apiService.get('/api/v1/properties/video-calls/');
            setCalls(Array.isArray(response) ? response : []);
            showToast('Video call confirmed!', 'success');
        } catch (error) {
            console.error('Error confirming call:', error);
            showToast('Failed to confirm call', 'error');
        }
    };

    if (loading) {
        return <div className="max-w-[1500px] mx-auto px-6 py-12">Loading...</div>;
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-12">
            <h1 className="text-3xl font-bold mb-8">Video Calls</h1>

            {calls.length === 0 ? (
                <p className="text-gray-600">No video calls scheduled yet.</p>
            ) : (
                <div className="grid gap-6">
                    {calls.map((call) => {
                        const isLandlord = userId === call.landlord.id;
                        const scheduledDate = new Date(call.scheduled_time);
                        const isPast = scheduledDate < new Date();

                        return (
                            <div key={call.id} className="border rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{call.property.title}</h3>
                                        <p className="text-gray-600 mt-1">
                                            {scheduledDate.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {isLandlord ? `With: ${call.tenant.name}` : `With: ${call.landlord.name}`}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        call.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        call.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        call.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                                    </span>
                                </div>

                                <div className="flex gap-3">
                                    {call.status === 'pending' && isLandlord && (
                                        <button
                                            onClick={() => confirmCall(call.id)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                        >
                                            Confirm
                                        </button>
                                    )}
                                    
                                    {call.status === 'confirmed' && !isPast && (
                                        <Link
                                            href={`/videocall/${call.id}`}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-block"
                                        >
                                            Join Call
                                        </Link>
                                    )}

                                    <Link
                                        href={`/properties/${call.property.id}`}
                                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg"
                                    >
                                        View Property
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
