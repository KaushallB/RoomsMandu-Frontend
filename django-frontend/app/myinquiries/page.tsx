'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiService from '../services/apiService';
import { getUserId } from '../lib/actions';
import { UserIcon, PhoneIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';

type InquiryType = {
    id: string;
    property: {
        id: string;
        title: string;
        image_url: string;
        price_per_month: number;
    };
    full_name: string;
    phone_number: string;
    move_in_preference: string;
    preferred_move_in_date: string | null;
    num_occupants: number;
    message: string;
    status: string;
    created_at: string;
}

const MyInquiriesPage = () => {
    const [inquiries, setInquiries] = useState<InquiryType[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchInquiries = async () => {
            const userId = await getUserId();
            if (!userId) {
                router.push('/');
                return;
            }

            try {
                const response = await apiService.get('/api/v1/properties/inquiries/');
                setInquiries(response.data || []);
            } catch (error) {
                console.error('Error fetching inquiries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, [router]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMoveInLabel = (preference: string) => {
        const labels: { [key: string]: string } = {
            'immediate': 'Immediate (Within 1 week)',
            '15days': 'Within 15 days',
            '1month': 'Within 1 month',
            'flexible': 'Flexible'
        };
        return labels[preference] || preference;
    };

    if (loading) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 py-12">
                <p>Loading inquiries...</p>
            </main>
        );
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className="my-6 text-2xl font-bold">My Inquiries</h1>
            <p className="text-gray-600 mb-6">Inquiries from people interested in your properties</p>

            {inquiries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg">No inquiries yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                        When someone is interested in your property, you'll see their inquiry here
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                        <div 
                            key={inquiry.id} 
                            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex gap-4">
                                {/* Property Image */}
                                <div 
                                    className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                                    onClick={() => router.push(`/properties/${inquiry.property.id}`)}
                                >
                                    <Image
                                        fill
                                        src={inquiry.property.image_url}
                                        alt={inquiry.property.title}
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 
                                                className="font-bold text-lg cursor-pointer hover:text-blue-600"
                                                onClick={() => router.push(`/properties/${inquiry.property.id}`)}
                                            >
                                                {inquiry.property.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Rs {inquiry.property.price_per_month.toLocaleString()}/month
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            inquiry.status === 'new' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {inquiry.status === 'new' ? 'New' : inquiry.status}
                                        </span>
                                    </div>

                                    {/* Tenant Info */}
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <UserIcon className="w-5 h-5 text-gray-600" />
                                            <span className="font-medium">{inquiry.full_name}</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <PhoneIcon className="w-4 h-4" />
                                                <a href={`tel:${inquiry.phone_number}`} className="text-blue-600 hover:underline">
                                                    {inquiry.phone_number}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-4 h-4" />
                                                <span>{getMoveInLabel(inquiry.move_in_preference)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <UsersIcon className="w-4 h-4" />
                                                <span>{inquiry.num_occupants} occupant(s)</span>
                                            </div>
                                            {inquiry.preferred_move_in_date && (
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    <span>Preferred: {inquiry.preferred_move_in_date}</span>
                                                </div>
                                            )}
                                        </div>

                                        {inquiry.message && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-gray-700 text-sm">
                                                    <span className="font-medium">Message:</span> {inquiry.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-400 mt-2">
                                        Received: {formatDate(inquiry.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default MyInquiriesPage;
