'use client';

import Modal from './Modal';

import { useState } from 'react';
import CustomButton from '../forms/CustomButton';
import useSignupModal from '@/app/hooks/useSignupModal';

const SignupModal = () => {
    const signupModal= useSignupModal()

    const content = (
        <>
            <h2 className='mb-6 text-2xl'> Please Login</h2>

            <form className='space-y-3'>
                <input type="email" placeholder=" Enter your e-mail Address" className='w-full h-[54px] border border-gray-300 rounded-xl' />

                <input type="password" placeholder="Enter your Password" className='w-full h-[54px] border border-gray-300 rounded-xl' />

                <input type="password" placeholder="Repeat your Password" className='w-full h-[54px] border border-gray-300 rounded-xl' />
                
                <div className='p-5 bg-red-500 text-white rounded-xl opacity-80'>
                    Error Message
                </div>
                
                <CustomButton
                    label="Sign Up"
                    onClick={()=>console.log('Clicked submit button')}
                />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={signupModal.isOpen}
            close={signupModal.close}
            label="Sion Up"
            content={content}
            />
        
    )
}

export default SignupModal;