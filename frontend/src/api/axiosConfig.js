import axios from 'axios';


const api = axios.create({
    baseURL: '/api' // Works with our Vite Proxy to Port 8080
});


// REQUEST INTERCEPTOR: The "Global Passport Machine"
api.interceptors.request.use(
    (config) => {
        // Snatch the token from storage right before the request fires
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// RESPONSE INTERCEPTOR: The "Graceful Failure" Observer
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If RSA Token expires (401) or permissions are wrong (403)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            window.location.href = '/?expired=true'; // Kick to login
        }
        return Promise.reject(error);
    }
);


export default api;
