'use client';

import { useState } from 'react';
import apiService from '@/app/services/apiService';
import useLoginModal from '@/app/hooks/useLoginModal';
import { showToast } from '../Toast';

export type Property = {
    id: string;
    price_per_month: number;
    landlord: {
        id: string;
    };
}

interface ReservationSidebarProps {
    userId: string | null;
    property: Property;
}

const ReservationSidebar: React.FC<ReservationSidebarProps> = ({
    property,
    userId
}) => {
    const loginModal = useLoginModal();
    
    // Check if current user is the owner
    const isOwner = userId && property.landlord?.id === userId;
    
    const [showForm, setShowForm] = useState(false);
    const [moveInDate, setMoveInDate] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [occupants, setOccupants] = useState('1');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const handleContactOwner = () => {
        if (!userId) {
            loginModal.open();
            return;
        }
        setShowForm(true);
    };

    const submitForm = async () => {
        if (!moveInDate || !fullName || !phoneNumber) {
            setErrors(['Please fill all required fields']);
            return;
        }

        const formData = new FormData();
        formData.append('move_in_preference', moveInDate);
        formData.append('preferred_move_in_date', preferredDate);
        formData.append('num_occupants', occupants);
        formData.append('full_name', fullName);
        formData.append('phone_number', phoneNumber);
        formData.append('message', message);

        const response = await apiService.post(`/api/v1/properties/${property.id}/book/`, formData);

        if (response.success) {
            // console.log('Booking successful');
            
            // Reset form
            setShowForm(false);
            setMoveInDate('');
            setPreferredDate('');
            setOccupants('1');
            setFullName('');
            setPhoneNumber('');
            setMessage('');
            setErrors([]);
            
            showToast('Your inquiry has been sent to the owner!', 'success');
        } else {
            setErrors([response.error || 'Something went wrong']);
        }
    };

    // If user is the owner, show owner view
    if (isOwner) {
        return (
            <aside className="mt-6 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
                <h2 className="mb-5 text-2xl font-semibold text-center">Rs {property.price_per_month.toLocaleString()} per month</h2>
                
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-gray-700 font-medium">This is your property</p>
                    <p className="text-gray-500 text-sm mt-2">
                        You'll receive notifications when tenants send inquiries
                    </p>
                </div>
                
                <hr className="my-5" />
                
                <h3 className="font-bold mb-3">Property Details</h3>
                <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="font-medium">Rs {(property.price_per_month * 2).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="text-gray-600">Advance Payment</span>
                    <span className="font-medium">1 month rent</span>
                </div>
            </aside>
        );
    }

    return (
        <aside className="mt-6 p-6 col-span-2 rounded-xl border border-gray-300 shadow-xl">
            <h2 className="mb-5 text-2xl font-semibold text-center"> Rs {property.price_per_month.toLocaleString()} per month</h2>
            
            <div className="mb-4 p-3 border border-gray-400 rounded-xl">
                <label className="mb-2 block font-bold text-xs"> When are you moving? </label>
                <select 
                    className="w-full -ml-1 text-sm p-1"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                >
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediate (Within 1 week)</option>
                    <option value="15days">Within 15 days</option>
                    <option value="1month">Within 1 month</option>
                    <option value="flexible">Flexible</option>
                </select>
            </div>

            <div className="mb-4 p-3 border border-gray-400 rounded-xl">
                <label className="mb-2 block font-bold text-xs"> Preferred Move-in Date (Optional) </label>
                <input 
                    type="date"
                    className="w-full -ml-1 text-sm p-1"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                />
            </div>

            <div className="mb-6 p-3 border border-gray-400 rounded-xl">
                <label className="mb-2 block font-bold text-xs"> Number of Occupants </label>
                <select 
                    className="w-full -ml-1 text-sm p-1"
                    value={occupants}
                    onChange={(e) => setOccupants(e.target.value)}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6+</option>
                </select>
            </div>

            {showForm && (
                <>
                    <div className="mb-4 p-3 border border-gray-400 rounded-xl">
                        <label className="mb-2 block font-bold text-xs"> Full Name * </label>
                        <input 
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="mb-4 p-3 border border-gray-400 rounded-xl">
                        <label className="mb-2 block font-bold text-xs"> Phone Number * </label>
                        <input 
                            type="tel"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="mb-4 p-3 border border-gray-400 rounded-xl">
                        <label className="mb-2 block font-bold text-xs"> Message (Optional) </label>
                        <textarea 
                            className="w-full p-2 border border-gray-300 rounded"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Any specific requirements..."
                            rows={3}
                        />
                    </div>

                    {errors.map((error, index) => (
                        <div key={index} className="p-3 mb-4 bg-red-100 text-red-600 rounded-xl text-sm">
                            {error}
                        </div>
                    ))}

                    <button 
                        onClick={submitForm}
                        className="w-full mb-3 py-3 text-center text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer font-semibold shadow-md"
                    >
                        Send Inquiry
                    </button>

                    <button 
                        onClick={() => setShowForm(false)}
                        className="w-full mb-6 py-3 text-center text-white bg-purple-600 hover:bg-purple-200 rounded-xl transition cursor-pointer font-semibold border border-purple-300 shadow-sm"
                    >
                        Cancel
                    </button>
                </>
            )}

            {!showForm && (
                <button 
                    onClick={handleContactOwner}
                    className="w-full mb-6 py-3 text-center text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition cursor-pointer font-semibold shadow-md"
                >
                    Contact Owner
                </button>
            )}

            <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="font-semibold mb-3 text-sm">Property Details</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-medium">Rs {property.price_per_month.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Advance Payment</span>
                        <span className="font-medium">1 month rent</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Agreement Period</span>
                        <span className="font-medium">11 months minimum</span>
                    </div>
                </div>
            </div>

            <div className="text-center text-xs text-gray-500">
                <p>No platform fee for contacting owners</p>
            </div>
        </aside>
    );
}

export default ReservationSidebar;


