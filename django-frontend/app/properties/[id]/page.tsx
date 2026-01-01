'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import ReservationSidebar from '../../components/properties/ReservationSidebar';
import useVideoCallModal from '@/app/hooks/useVideoCallModal';

import apiService from '@/app/services/apiService';
import { getUserId } from '@/app/lib/actions';

const PropertyDetails = ({params}: {params: Promise<{id: string}>}) => {
    const { id } = use(params);
    const [property, setProperty] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const videoCallModal = useVideoCallModal();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const data = await apiService.get(`/api/v1/properties/${id}`);
                const user = await getUserId();
                
                setProperty(data);
                setUserId(user);
            } catch (error) {
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) {
        return <div className="max-w-[1500px] mx-auto px-6 py-12">Loading...</div>;
    }

    if (!property) {
        return <div className="max-w-[1500px] mx-auto px-6 py-12">Property not found</div>;
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="w-full h-[80vh] mb-4 overflow-hidden rounded-xl relative">
                <Image fill
                    src={property.image_url}
                    className="object-cover w-full h-full"
                    alt={property.title}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="py-6 pr-6 col-span-3">
                    <h1 className="mb-4 text-4xl"> {property.title} </h1>
                    <span className="mb-6 block text-lg text-gray-600">
                        {property.rooms} Room - {property.kitchen} Kitchen - {property.bathrooms} Bathroom
                    </span>

                    <hr />

                {/* Owner Info with Contact */}
                <div className="py-6">
                    <div className="flex items-center space-x-4">
                        {property.landlord.avatar_url ? (
                        <Image 
                            src={property.landlord.avatar_url}
                            width={60}
                            height={60}
                            className="rounded-full" 
                            alt="Owner"
                        />
                        ) : (
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(property.landlord.name || 'User')}&background=FDDA0D&color=000&size=60&rounded=true&bold=true`}
                            width={60}
                            height={60}
                            className="rounded-full" 
                            alt="Owner"
                        />
                        )}

                        <div className="flex-1">
                            <Link href={`/landlords/${property.landlord.id}`}>
                                <p className="text-lg font-semibold hover:underline">
                                    {property?.landlord?.name?.[0]?.toUpperCase() + property?.landlord?.name?.slice(1)}
                                </p>
                            </Link>
                            <p className="text-gray-500 text-sm">Property Owner</p>
                        </div>

                        {/* Call Button */}
                        {property.landlord.phone_number && (
                            <a 
                                href={`tel:${property.landlord.phone_number}`}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                            >
                                📞 Call Now
                            </a>
                        )}
                    </div>
                    
                    {property.landlord.phone_number && (
                        <p className="mt-2 text-gray-600 ml-[76px]">
                            Phone: <span className="font-medium">{property.landlord.phone_number}</span>
                        </p>
                    )}
                </div>

                <hr />

                {/* Location Card - Prominent Design */}
                {(property.address || (property.latitude && property.longitude)) && (
                    <div className="py-6 ">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                            <div className="flex items-start gap-4 ">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                                    📍
                                </div>
                                <div className="flex-1 ">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">Property Location</h3>
                                    <p className="text-gray-700 mb-1">
                                        {property.address && <span>{property.address}</span>}
                                    </p>
                                    <p className="text-gray-600 text-sm mb-4">
                                        District: <span className="font-medium">{property.district}</span>
                                    </p>
                                    
                                    {property.latitude && property.longitude && (
                                        <a
                                            href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition"
                                        >
                                            View on Google Maps
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {(property.address || (property.latitude && property.longitude)) && <hr />}

                {/* Schedule Video Call Button */}
                {userId && userId !== property.landlord.id && (
                    <div className="py-6">
                        <button
                            onClick={() => videoCallModal.open(property.id, property.landlord.id)}
                            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg"
                        >
                            Schedule Video Call
                        </button>
                        <p className="text-center text-gray-500 text-sm mt-2">
                            Request a video tour of this property with the owner
                        </p>
                    </div>
                )}

                <hr />
                <h1 className='mt-3 text-lg font-bold'>Description:</h1>
                <p className="mt-2 text-lg">
                    {property.description}
                </p>
            </div>



                <ReservationSidebar 
                    property={property}
                    userId={userId}
                />

            </div>
        </main>
    )

}

export default PropertyDetails;