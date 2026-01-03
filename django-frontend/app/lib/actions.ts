'use server';

import { cookies } from "next/headers";

type ServerCookieInit = CookieInit & {
    httpOnly?: boolean;
    secure?: boolean;
    maxAge?: number;
};

export async function handleLogin(userId: string, accessToken:string, refreshToken:string, userName?: string){
    const cookieStore = await cookies();
    const baseCookie: Omit<ServerCookieInit, 'name' | 'value'> = {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax'
    };

    const userIdCookie: ServerCookieInit = {
        ...baseCookie,
        name: 'session_userid',
        value: userId,
        httpOnly: true
    };

    const refreshCookie: ServerCookieInit = {
        ...baseCookie,
        name: 'session_refresh_token',
        value: refreshToken,
        httpOnly: true
    };

    const accessCookie: ServerCookieInit = {
        ...baseCookie,
        name: 'session_access_token',
        value: accessToken,
        httpOnly: false, // Must be false to allow client-side JavaScript access
        maxAge: 60 * 60
    };

    cookieStore.set(userIdCookie);
    cookieStore.set(refreshCookie);
    cookieStore.set(accessCookie);

    // Store user name
    if (userName) {
        const usernameCookie: ServerCookieInit = {
            ...baseCookie,
            name: 'session_username',
            value: userName,
            httpOnly: false
        };

        cookieStore.set(usernameCookie);
    }
    
}

export async function resetAuthCookies(){
    const cookieStore = await cookies();
    const clearedCookie: ServerCookieInit = {
        name: '',
        value: '',
        path: '/',
        maxAge: 0,
        sameSite: 'lax'
    };

    cookieStore.set({ ...clearedCookie, name: 'session_userid' });
    cookieStore.set({ ...clearedCookie, name: 'session_access_token' });
    cookieStore.set({ ...clearedCookie, name: 'session_refresh_token' });
    cookieStore.set({ ...clearedCookie, name: 'session_username' });
}

//Getting Data

export async function getUserId(){
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_userid')?.value;
    return userId ? userId : null;
}

export async function getAccessToken(){
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('session_access_token')?.value;

    if (!accessToken) {
        accessToken = await handleRefresh();
    }

    return accessToken;
}

export async function getUserName(){
    const cookieStore = await cookies();
    
    // First try to get from cookie (fastest)
    const storedName = cookieStore.get('session_username')?.value;
    if (storedName) {
        return storedName;
    }
    
    // Fallback: fetch from API
    const userId = await getUserId();
    if (!userId) return null;
    
    try {
        const token = cookieStore.get('session_access_token')?.value;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/auth/me/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.name || null;
        }
    } catch (error) {
        console.error('Error fetching user name:', error);
    }
    
    return null;
}

export async function handleRefresh(){
    console.log('Handle Refresh');

    const cookieStore = await cookies();

    const refreshToken=await getRefreshToken();

    const token = await fetch('http://localhost:8000/api/v1/auth/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({
            refresh: refreshToken
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then((json) => {
            console.log('Response-Refresh', json)

                if(json.access){
                    const refreshedCookie: ServerCookieInit = {
                        name: 'session_access_token',
                        value: json.access,
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 *7,
                        path: '/',
                        sameSite: 'lax'
                    };

                    cookieStore.set(refreshedCookie);

                return json.access;
            }else{
                resetAuthCookies();
            }
        })
        .catch((error) => {
            console.log('error', error);

            resetAuthCookies();
        }) 

        return token;
}


export async function getRefreshToken(){
    const cookieStore = await cookies();
    return cookieStore.get('session_refresh_token')?.value;
}


