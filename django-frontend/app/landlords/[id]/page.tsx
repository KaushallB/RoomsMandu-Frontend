'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import ContactsButton from '@/app/components/ContactsButton';
import PropertyList from '@/app/components/properties/PropertyLists';
import apiService from '@/app/services/apiService';
import { getUserId } from '@/app/lib/actions';

const LandlordDetailsPage = ({params}: {params: Promise<{id:string}>}) => {
    const { id } = use(params);
    const [landlord, setLandlord] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const landlordData = await apiService.get(`/api/v1/auth/${id}`);
                const user = await getUserId();
                
                setLandlord(landlordData);
                setUserId(user);
            } catch (error) {
                console.error('Error fetching landlord:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="max-w-[1500px] mx-auto px-6 py-12">Loading...</div>;
    }

    if (!landlord) {
        return <div className="max-w-[1500px] mx-auto px-6 py-12">Landlord not found</div>;
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <aside className="col-span-1 md-4">
                    <div className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-xl">
                    {landlord.avatar_url ? (
                        <Image src={landlord.avatar_url}
                            alt='profile pic'
                            width={200}
                            height={200}
                            className='rounded-full'
                        />
                    ) : (
                        <div className="w-[200px] h-[200px] bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-4xl text-gray-600">{landlord.name?.charAt(0).toUpperCase()}</span>
                        </div>
                    )}

                        <h1 className='mt-6 text-2xl'> {landlord.name} </h1>

                    {userId !== id && (
                        <ContactsButton  
                            userId={userId}
                            landlordId={id}
                        />
                    )}
                        
                    </div>
                    
                </aside>

                <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <PropertyList 
                            landlord_id={id}/>
                    </div>
                </div>
            </div>

        </main>
    )
}

export default LandlordDetailsPage;