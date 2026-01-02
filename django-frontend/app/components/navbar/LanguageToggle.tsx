'use client';

import { useState, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';

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
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100 transition text-sm font-medium shadow-sm"
            title={isNepali ? 'Switch to English' : 'नेपालीमा हेर्नुहोस्'}
        >
            {isNepali ? (
                <>
                    <ReactCountryFlag
                        countryCode="NP"
                        svg
                        style={{ width: '1.5em', height: '1.5em' }}
                        title="Nepal"
                    />
                    <span>NP</span>
                </>
            ) : (
                <>
                    <ReactCountryFlag
                        countryCode="US"
                        svg
                        style={{ width: '1.5em', height: '1.5em' }}
                        title="English"
                    />
                    <span>EN</span>
                </>
            )}
        </button>
    );
};

export default LanguageToggle;
