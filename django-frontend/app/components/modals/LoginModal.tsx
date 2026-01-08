'use client';

import Modal from './Modal';

import { useState } from 'react';
import useLoginModal from '@/app/hooks/useLoginModal';
import CustomButton from '../forms/CustomButton';
import { useRouter } from 'next/navigation';
import { handleLogin } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';

const LoginModal = () => {
    const router= useRouter();
    const loginModal=useLoginModal();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const submitLogin = async () => {
        const formData = {
            email: email,
            password: password
        }

        try {
            const response = await apiService.post('/api/v1/auth/login/', formData);

            if (response.access) {
                await handleLogin(response.user.pk, response.access, response.refresh, response.user.name);

                loginModal.close();

                // Hard refresh to update all components
                window.location.href = '/';
            } else {
                setErrors(response.non_field_errors || ['Login failed']);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors(['Login failed. Please try again.']);
        }
    }

    const content = (
        <>
            <h2 className='mb-6 text-2xl'> Please Login</h2>

            <form 
                className='space-y-3'
                onSubmit={(e) => { e.preventDefault(); submitLogin(); }}
            >
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your e-mail Address" 
                    className='w-full h-[54px] px-4 border border-gray-300 rounded-xl' 
                />

                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter your Password" 
                    className='w-full h-[54px] px-4 border border-gray-300 rounded-xl' 
                />
                
                {errors.map((error, index) => {
                    return (
                        <div 
                            key={`error_${index}`}
                            className="p-5 bg-red-500 text-white rounded-xl opacity-80"
                        >
                            {error}
                        </div>
                    )
                })}
                
                <CustomButton
                    label="Login"
                    onClick={(e) => { e.preventDefault(); submitLogin(); }}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Log in "
            content={content}
            />
        
    )
}

export default LoginModal;