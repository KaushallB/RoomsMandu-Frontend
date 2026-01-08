'use server';

import { cookies } from "next/headers";

export async function handleLogin(userId: string, accessToken:string, refreshToken:string, userName?: string){
    const cookieStore = await cookies();
    
    cookieStore.set('session_userid', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 *7,
        path: '/'
    });

    cookieStore.set('session_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 *7,
        path: '/'
    });

    cookieStore.set('session_access_token', accessToken, {
        httpOnly: false, // Must be false to allow client-side JavaScript access
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/'
    });

    // Store user name
    if (userName) {
        cookieStore.set('session_username', userName, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        });
    }
    
}

export async function resetAuthCookies(){
    const cookieStore = await cookies();
    
    cookieStore.set('session_userid', '');
    cookieStore.set('session_access_token', '');
    cookieStore.set('session_refresh_token', '');
    cookieStore.set('session_username', '');
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
                cookieStore.set('session_access_token', json.access);

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
    let refreshToken = cookieStore.get('session_refresh_token')?.value;
    return refreshToken;
}


