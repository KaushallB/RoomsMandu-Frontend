'use client';

import Modal from './Modal';

import { useState } from 'react';
import useLoginModal from '@/app/hooks/useLoginModal';
import CustomButton from '../forms/CustomButton';

const LoginModal = () => {
    const loginModal= useLoginModal()

    const content = (
        <>
            <h2 className='mb-6 text-2xl'> Please Login</h2>

            <form className='space-y-3'>
                <input type="email" placeholder=" Enter your e-mail Address" className='w-full h-[54px] border border-gray-300 rounded-xl' />
                <input type="password" placeholder="Enter your Password" className='w-full h-[54px] border border-gray-300 rounded-xl' />
                
                <div className='p-5 bg-red-500 text-white rounded-xl opacity-80'>
                    Error Message
                </div>
                
                <CustomButton
                    label="Submit"
                    onClick={()=>console.log('Clicked submit button')}
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