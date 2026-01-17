'use client';

import { useState } from 'react';
import Modal from './Modal';
import useVideoCallModal from '@/app/hooks/useVideoCallModal';
import CustomButton from '../forms/CustomButton';
import SingleDatePicker from '../forms/SingleDatePicker';
import apiService from '@/app/services/apiService';
import { showToast } from '../Toast';

const VideoCallModal = () => {
    const videoCallModal = useVideoCallModal();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Time slots (simple and formal)
    const timeSlots = [
        { value: '09:00', label: '9:00 AM' },
        { value: '10:00', label: '10:00 AM' },
        { value: '11:00', label: '11:00 AM' },
        { value: '12:00', label: '12:00 PM' },
        { value: '14:00', label: '2:00 PM' },
        { value: '15:00', label: '3:00 PM' },
        { value: '16:00', label: '4:00 PM' },
        { value: '17:00', label: '5:00 PM' },
        { value: '18:00', label: '6:00 PM' },
        { value: '21:00', label: '9:00 PM' },
    ];

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const submitRequest = async () => {
        if (!selectedDate || !selectedTime) {
            setErrors(['Please select both date and time']);
            return;
        }

        setIsLoading(true);
        setErrors([]);

        // Combine date and time
        const [hours, minutes] = selectedTime.split(':');
        const dateTime = new Date(selectedDate);
        dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        try {
            const response = await apiService.post(`/api/v1/properties/${videoCallModal.propertyId}/schedule-call/`, {
                scheduled_time: dateTime.toISOString(),
            });
            
            if (response.success) {
                videoCallModal.close();
                setSelectedDate(new Date());
                setSelectedTime('');
                showToast('✅ Video call request sent! Waiting for landlord confirmation.', 'success');
            } else {
                setErrors(response.errors || ['Something went wrong']);
            }
        } catch (error) {
            setErrors(['Failed to send request. Please try again.']);
        } finally {
            setIsLoading(false);
        }
    };

    const content = (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📹</span>
                </div>
                <h2 className="text-2xl font-bold">Schedule Video Call</h2>
                <p className="text-gray-500 mt-1">
                    Request a video tour with the property owner
                </p>
            </div>

            {/* Date Picker - Always visible */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                </label>
                <SingleDatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                />
            </div>

            {/* Time Slots */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                        const isSelected = selectedTime === slot.value;
                        return (
                            <button
                                key={slot.value}
                                type="button"
                                onClick={() => setSelectedTime(slot.value)}
                                className={`relative py-3 px-4 rounded-xl border text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm ${
                                    isSelected
                                        ? 'bg-purple-700 text-white border-purple-700 scale-105 ring-2 ring-purple-400'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                                }`}
                                style={{ minHeight: '48px' }}
                            >
                                {slot.label}
                                {isSelected && (
                                    <span className="absolute top-1 right-2 text-lg">✔️</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}

            <CustomButton
                label={isLoading ? 'Sending Request...' : 'Send Request'}
                onClick={submitRequest}
                className="w-full bg-purple-600 hover:bg-purple-700"
            />
            
            <p className="text-xs text-gray-400 text-center">
                The landlord will confirm the video call time
            </p>
        </div>
    );

    return (
        <Modal
            isOpen={videoCallModal.isOpen}
            close={videoCallModal.close}
            label="Schedule Video Call"
            content={content}
        />
    );
};

export default VideoCallModal;
