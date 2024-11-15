// api url locolhost:8000

export const API_URL = 'http://localhost:8080';

export async function sendRequest(url, method = 'GET', parameters = null, body = null) {

    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        'accept': '*/*'
        // 'Authorization': `Bearer ${token}` 
    };

    url = `${API_URL}/${url}`;
    if (parameters) {
        const queryString = new URLSearchParams(parameters).toString();
        url += `?${queryString}`;
    }
    
    const options = {
        method,
        headers
    };

    if ((method === 'POST' || method === 'PUT') && body) {
        options.body = JSON.stringify(body);
    }
    
    console.log("sendRequest");
    console.log(url);
    console.log(method);
    console.log(parameters);
    console.log(body);
    console.log(options);
    
    const messageStruct = {
        "message": "Invalid credentials",
        "ok": false,
        "status": 401
    };
    
    try {
        const response = await fetch(url, options);
    
        // Checking HTTP Status Codes
        console.log(response);
        if (!response.ok) {
            return {
                message: response.message || "Unknown error",
                ok: false,
                status: response.status
            };
        }
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return {
                message: "Response is not JSON",
                ok: false,
                status: response.status
            };
        }
    } catch (error) {
        console.log("Network or other error:");
        console.log(error);
        return messageStruct;
    }
    
}

