'use client';

import { useState, useEffect } from 'react';

const LanguageToggle = () => {
    const [isNepali, setIsNepali] = useState(false);

    useEffect(() => {
        // Check cookie for current language
        const cookies = document.cookie.split(';');
        const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
        if (googtrans && googtrans.includes('/ne')) {
            setIsNepali(true);
        }
    }, []);

    const toggleLanguage = () => {
        if (isNepali) {
            // Switch to English - clear the cookie
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        } else {
            // Switch to Nepali
            document.cookie = 'googtrans=/en/ne; path=/;';
            document.cookie = 'googtrans=/en/ne; path=/; domain=' + window.location.hostname;
        }
        // Reload to apply translation
        window.location.reload();
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition text-sm font-medium"
            title={isNepali ? 'Switch to English' : 'नेपालीमा हेर्नुहोस्'}
        >
            {isNepali ? (
                <>
                    <span className="text-lg">🇳🇵</span>
                    <span>NP</span>
                </>
            ) : (
                <>
                    <span className="text-lg">🇺🇸</span>
                    <span>EN</span>
                </>
            )}
        </button>
    );
};

export default LanguageToggle;
