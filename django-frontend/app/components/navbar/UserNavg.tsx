'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import MenuLink from "./MenuLink";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";
import LogoutButton from "../LogoutButton";

interface UserNavgProps {
    userId?: string | null;
    userName?: string | null;
}

const UserNav: React.FC<UserNavgProps> = ({
    userId,
    userName
}) => {
    const loginModal = useLoginModal() ;
    const signupModal= useSignupModal();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Generate UI Avatar URL with proper initials (First letter of first name + First letter of second name)
    const getAvatarUrl = () => {
        const name = userName || 'User';
        const parts = name.trim().split(' ').filter(p => p.length > 0);
        let initials = '';
        
        if (parts.length >= 2) {
            // First letter of first name + First letter of second name (not last word)
            initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts.length === 1 && parts[0].length >= 2) {
            // Just first two letters if only one name
            initials = parts[0].substring(0, 2).toUpperCase();
        } else {
            initials = 'U';
        }
        
        // Use the initials directly in the URL
        return `https://ui-avatars.com/api/?name=${initials}&background=FDDA0D&color=000&size=32&font-size=0.5&rounded=true&bold=true`;
    };

    return (
        <div className="p-2 relative inline-block border rounded-full">
            <button className="flex items-center space-x-2"
            onClick={() => setIsOpen(!isOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                {userId ? (
                    <img 
                        src={getAvatarUrl()} 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                )}

            </button>

            {isOpen && (
                <div className="w-[220px] absolute top-[60px] right-0 bg-white border rounded-xl shadow-md flex-flex-col cursor-pointer">
                    { userId ? (
                        <>
                                <MenuLink 
                                    label="My Profile"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/profile');
                                    }}
                                />

                                <MenuLink 
                                    label="Inbox"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/inbox');
                                    }}
                                />

                                <MenuLink 
                                    label="Video Calls"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/videocalls');
                                    }}
                                />

                                <MenuLink 
                                    label="My Properties"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/myproperties');
                                    }}
                                />

                                <MenuLink 
                                    label="My Inquiries"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/myinquiries');
                                    }}
                                />

                                <MenuLink 
                                    label="My Reservations"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/myreservations');
                                    }}
                                />

                                <MenuLink 
                                    label="My Favourites"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/myfavourites');
                                    }}
                                />

                                <LogoutButton />
                        </>
                    
                    ) : (
                    <>
                        <MenuLink 
                            label="Log in" 
                            onClick={()=> {
                                console.log('Clicked Button')

                                setIsOpen(false);
                                loginModal.open();   
                            }}
                        />

                        <MenuLink 
                            label="Sign up" 
                            onClick={()=> {
                                console.log('Clicked Button')

                                setIsOpen(false);
                                signupModal.open();  
                            }}
                        />
                    </>
                    )}

                </div>
            )}
        </div>
    )
}

export default UserNav;