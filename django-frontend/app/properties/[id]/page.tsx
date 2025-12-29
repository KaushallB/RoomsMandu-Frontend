'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import ReservationSidebar from '../../components/properties/ReservationSidebar';

import apiService from '@/app/services/apiService';

const PropertyDetails = ({params}: {params: Promise<{id: string}>}) => {
    const { id } = use(params);
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const data = await apiService.get(`/api/v1/properties/${id}`);
                setProperty(data);
            } catch (error) {
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) {
        return <div className="max-w-1500px mx-auto px-6 py-12">Loading...</div>;
    }

    if (!property) {
        return <div className="max-w-1500px mx-auto px-6 py-12">Property not found</div>;
    }

    return (
        <main className="max-w-1500px mx-auto px-6 pb-6">
            <div className="w-full h-[80vh] mb-4 overflow-hidden rounded-xl relative">
                <Image fill
                    src='/house1.jpg'
                    className="object-cover w-full h-full"
                    alt="House1"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="py-6 pr-6 col-span-3">
                    <h1 className="mb-4 text-4xl"> {property.title} </h1>
                    <span className="mb-6 block text-lg text-gray-600">
                        {property.rooms} Room - {property.kitchen} Kitchen - {property.bathrooms} Bathroom
                    </span>

                    <hr />
                <div className="py-6 flex items-center space-x-4">
                    {property.landlord.avatar_url && (
                    <Image 
                        src={property.landlord.avatar_url}
                        width={50}
                        height={50}
                        className="rounded-full" 
                        alt="Owner's Name"
                    />
                    )}

                    <p><strong> {property.landlord.name} </strong> is the owner </p>
                </div>

                <hr />
            
                <p className="mt-6 text-lg">
                    {property.description}
                </p>
            </div>



                <ReservationSidebar 
                    property={property}
                />

            </div>
        </main>
    )

}

export default PropertyDetails;