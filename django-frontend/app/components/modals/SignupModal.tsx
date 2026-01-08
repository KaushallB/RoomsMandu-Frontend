'use client';

import Modal from './Modal';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomButton from '../forms/CustomButton';
import useSignupModal from '@/app/hooks/useSignupModal';
import apiService from '@/app/services/apiService';
import { handleLogin } from '@/app/lib/actions';

const SignupModal = () => {
    //variables
    const signupModal = useSignupModal();
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPw1] = useState('');
    const [password2, setPw2] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    //submit function
    const submitSignup = async () => {
        const formData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password1: password1,
            password2: password2,
        };

        try {
            const response = await apiService.post('/api/v1/auth/register/', formData);
            
            console.log('Signup response:', response);

            if (response.access) {
                //handle login - pass the full name (first + last)
                const fullName = `${firstName} ${lastName}`.trim();
                await handleLogin(response.user.pk, response.access, response.refresh, fullName);

                signupModal.close();
                
                // Hard refresh to update all components
                window.location.href = '/';
            } else {
                const tmpErrors: string[] = [];
                Object.keys(response).forEach((key) => {
                    if (Array.isArray(response[key])) {
                        response[key].forEach((error: string) => tmpErrors.push(error));
                    } else {
                        tmpErrors.push(response[key]);
                    }
                });
                setErrors(tmpErrors);
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            setErrors(['Registration failed. Please try again.']);
        }
    };


    const content = (
        <>
            <h2 className='mb-6 text-2xl'>Please Sign Up</h2>

            <form 
                onSubmit={(e) => { e.preventDefault(); submitSignup(); }}
                className="space-y-4"
            >
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full h-[54px] px-4 border rounded-xl"
                />

                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full h-[54px] px-4 border rounded-xl"
                />

                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Your e-mail address" 
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                />

                <input 
                    type="password"
                    value={password1}
                    onChange={(e) => setPw1(e.target.value)} 
                    placeholder="Your password" 
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                />

                <input 
                    type="password"
                    value={password2}
                    onChange={(e) => setPw2(e.target.value)} 
                    placeholder="Repeat password" 
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
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
                    label="Sign Up"
                    onClick={submitSignup}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={signupModal.isOpen}
            close={signupModal.close}
            label="Sign up"
            content={content}
        />
    )
}

export default SignupModal;