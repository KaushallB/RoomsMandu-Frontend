"use client";
import Link from 'next/link';
import Image from 'next/image';
import SearchFilter from './SearchFilters';
import UserNav from './UserNavg';
import AddProperty from './PropertyButton';
import NotificationBell from './NotificationBell';
import LanguageToggle from './LanguageToggle';
import { useEffect, useState } from 'react';
import { getUserId, getUserName } from '@/app/lib/actions';

const Navbar = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const id = await getUserId();
            const name = await getUserName();
            setUserId(id);
            setUserName(name);
        };
        fetchUser();
    }, []);

    return (
        <nav className="w-full fixed top-0 left-0 py-6 border-b bg-white z-10">
            <div className="max-w-[1500px] mx-auto px-6">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <Image src="/logo.png"
                            alt="roomsmandulogo"
                            width={200}
                            height={50}
                        />
                    </Link>

                    <div className='flex space-6'>
                        <SearchFilter />
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Hidden Google Translate Widget - must exist but hidden */}
                        <div id="google_translate_element" style={{ display: 'none' }}></div>
                        
                        {/* Language Toggle Button */}
                        <LanguageToggle />
                        
                        {userName && (
                            <p className="text-sm font-medium text-gray-700">Welcome, {userName.split(' ')[0]}</p>
                        )}
                        <NotificationBell />
                        <AddProperty userId={userId} />
                        <UserNav userId={userId} userName={userName} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;