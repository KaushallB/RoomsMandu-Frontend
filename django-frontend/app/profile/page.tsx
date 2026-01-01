'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../services/apiService';
import { getUserId } from '../lib/actions';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone_number: string | null;
    avatar_url: string | null;
}

const ProfilePage = () => {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = await getUserId();
            if (!userId) {
                router.push('/');
                return;
            }

            try {
                const data = await apiService.get('/api/v1/auth/profile/');
                setProfile(data);
                setName(data.name || '');
                setPhone(data.phone_number || '');
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone_number', phone);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const response = await apiService.put('/api/v1/auth/profile/', formData);
            
            if (response.success) {
                setProfile(response.data);
                setIsEditing(false);
                setMessage('Profile updated successfully!');
                setAvatarFile(null);
                setAvatarPreview(null);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Generate UI Avatar URL
    const getAvatarUrl = () => {
        if (avatarPreview) return avatarPreview;
        if (profile?.avatar_url) return profile.avatar_url;
        const userName = profile?.name || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=FDDA0D&color=000&size=128&font-size=0.5&rounded=true&bold=true`;
    };

    if (loading) {
        return (
            <main className="max-w-[600px] mx-auto px-6 py-12">
                <div className="text-center">Loading...</div>
            </main>
        );
    }

    return (
        <main className="max-w-[600px] mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <img 
                        src={getAvatarUrl()} 
                        alt="Avatar" 
                        className="w-32 h-32 rounded-full mb-4 object-cover"
                    />
                    
                    {isEditing && (
                        <div>
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm">
                                Change Photo
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Profile Info */}
                <div className="space-y-6">
                    {/* Email (read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={profile?.email || ''} 
                            disabled
                            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-600"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-lg">{profile?.name || 'Not set'}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        {isEditing ? (
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+977 98XXXXXXXX"
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                        ) : (
                            <p className="px-4 py-3 bg-gray-50 rounded-lg">
                                {profile?.phone_number || 'Not set'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setName(profile?.name || '');
                                    setPhone(profile?.phone_number || '');
                                    setAvatarFile(null);
                                    setAvatarPreview(null);
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;
