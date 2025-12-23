import { resolve } from "path";

// Helper function to get token from browser cookies
function getTokenFromCookies(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('session_access_token='));
    
    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }
    return null;
}

const apiService= {

    get: async function (url:string): Promise<any> {
        console.log('get', url);

        const token = getTokenFromCookies();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`,{
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((json) => {
                    console.log('Response', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    post: async function(url:string, data:any): Promise<any> {
        console.log('POST', url, data);

        const token = getTokenFromCookies();
        
        // Check if data is FormData
        const isFormData = data instanceof FormData;
        
        // Prepare headers
        const headers: any = {
            'Accept': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Only set Content-Type for JSON, not FormData (browser sets it with boundary)
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`,{
                method: 'POST',
                body: isFormData ? data : JSON.stringify(data),
                headers: headers
            })
                .then(async (response) => {
                    const text = await response.text();
                    console.log('Response status:', response.status);
                    console.log('Response text:', text);
                    
                    let json;
                    try {
                        json = JSON.parse(text);
                    } catch {
                        json = { error: text };
                    }
                    
                    console.log('Parsed JSON:', json);
                    resolve(json);
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    reject(error);
                })
        })
    }

}

export default apiService;