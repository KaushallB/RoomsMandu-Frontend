'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../services/apiService';

const MyReservationsPage = () => {
    const [reservations, setReservations] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const getReservations = async () => {
            const data = await apiService.get('/api/v1/auth/myreservations/');
            setReservations(data);
        };
        
        getReservations();
    }, []);

    return (

        
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className='my-6 text-2xl'>My Inquiries</h1> 

            <div className='space-y-4'>
            {reservations.map((reservation: any) => {
            return (
                <div key={reservation.id} className='p-5 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-md border border-gray-300 rounded-xl'>
                    <div className='col-span-1'>
                        <div className='relative overflow-hidden aspect-square rounded-xl'>
                            <Image 
                                fill
                                src={reservation.property.image_url}
                                alt={reservation.property.title}
                                className='hover:scale-110 object-cover transition h-full w-full'
                                />
                        </div>
                    </div>

                    <div className='col-span-1 md:col-span-3 space-y-2'>
                        <h2 className='mb-4 text-xl'>{reservation.property.title}</h2>
                        
                        <p className='mb-2'><strong>Monthly Rent:</strong> Rs {reservation.property.price_per_month}</p>
                        
                        <p className='mb-2'><strong>Submitted:</strong> {new Date(reservation.created_at).toLocaleDateString()}</p>

                        <p className='mb-2'><strong>Move-in:</strong> {reservation.move_in_preference}</p>
                        
                        <p className='mb-2'><strong>Status:</strong> {reservation.status}</p>

                        <div 
                            onClick={() => {
                            router.push(`/properties/${reservation.property.id}`)
                        }}
                            className='mt-6 inline-block cursor-pointer py-4 px-6 bg-red-400 text-white rounded-xl'
                        >
                            Go To Property
                        </div>
                    </div>
                    
                </div>
                )
            })}
            </div>
        </main>
    )
}

export default MyReservationsPage;