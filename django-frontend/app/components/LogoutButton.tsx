'use client';

import MenuLink from "./navbar/MenuLink";
import { resetAuthCookies } from '@/app/lib/actions';

const LogoutButton: React.FC = () => {

    const submitLogout = async () => {
        await resetAuthCookies();
        
        // Hard refresh to clear all state
        window.location.href = '/';
    }

    return (
        <MenuLink
            label="Log out"
            onClick={submitLogout}
        />
    )
}
    

export default LogoutButton;