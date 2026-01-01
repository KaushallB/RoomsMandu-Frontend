'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getUserId } from '../lib/actions';
import apiService from '../services/apiService';
import { useRouter } from 'next/navigation';
import { showToast } from '../components/Toast';

type PropertyType = {
    id: string;
    title: string;
    price_per_month: number;
    image_url: string;
    district: string;
    is_available: boolean;
}

const MyPropertiespage = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const id = await getUserId();
            setUserId(id);
            
            if (id) {
                const response = await apiService.get(`/api/v1/properties/?landlord_id=${id}`);
                setProperties(response.data || []);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const [deleteConfirm, setDeleteConfirm] = useState<{id: string, title: string} | null>(null);

    const handleDeleteClick = (propertyId: string, propertyTitle: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteConfirm({id: propertyId, title: propertyTitle});
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        try {
            const response = await apiService.delete(`/api/v1/properties/${deleteConfirm.id}/delete/`);
            if (response.success) {
                setProperties(properties.filter(p => p.id !== deleteConfirm.id));
                showToast(`"${deleteConfirm.title}" deleted successfully`, 'success');
            } else {
                showToast('Failed to delete property', 'error');
            }
        } catch (error) {
            showToast('Failed to delete property', 'error');
        }
        setDeleteConfirm(null);
    };

    const handleToggleAvailability = async (propertyId: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await apiService.post(`/api/v1/properties/${propertyId}/toggle_availability/`, {});
            console.log('Toggle response:', response);
            if (response.success) {
                setProperties(properties.map(p => 
                    p.id === propertyId ? { ...p, is_available: response.is_available } : p
                ));
                showToast(
                    response.is_available ? 'Property marked as Available' : 'Property marked as Rented', 
                    'success'
                );
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Toggle error:', error);
            showToast('Failed to update status', 'error');
        }
    };

    if (loading) {
        return <main className="max-w-[1500px] mx-auto px-6 pb-6"><p>Loading...</p></main>;
    }

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <h1 className='my-6 text-2xl font-bold'>My Properties</h1>

            {properties.length === 0 ? (
                <p className="text-gray-500">You haven't listed any properties yet.</p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {properties.map((property) => (
                        <div key={property.id} className="border rounded-xl overflow-hidden shadow-sm">
                            <div 
                                className="relative aspect-square cursor-pointer"
                                onClick={() => router.push(`/properties/${property.id}`)}
                            >
                                <Image 
                                    fill
                                    src={property.image_url}
                                    alt={property.title}
                                    className="object-cover"
                                />
                                {/* Status Badge */}
                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                                    property.is_available 
                                        ? 'bg-green-500 text-white' 
                                        : 'bg-red-500 text-white'
                                }`}>
                                    {property.is_available ? 'Available' : 'Rented'}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="font-bold text-lg">{property.title}</h3>
                                <p className="text-gray-600">Rs. {property.price_per_month}/month</p>
                                <p className="text-gray-500 text-sm">{property.district}</p>
                                
                                {/* Action Buttons */}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={(e) => handleToggleAvailability(property.id, property.is_available, e)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                                            property.is_available
                                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                    >
                                        {property.is_available ? 'Mark as Rented' : 'Mark as Available'}
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteClick(property.id, property.title, e)}
                                        className="py-2 px-3 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Delete Property?</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete &quot;{deleteConfirm.title}&quot;? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default MyPropertiespage;