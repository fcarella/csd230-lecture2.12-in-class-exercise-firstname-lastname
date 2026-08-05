import axios from 'axios';

const api = axios.create({
    baseURL: '/api'
});

// REQUEST: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE: Catch Expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Only redirect if this wasn't a login attempt
            if (!originalRequest.url.includes('/auth/token')) {
                console.warn("Session invalid. Wiping storage...");
                localStorage.removeItem('token');
                // Force a hard redirect to root to reset React memory
                window.location.href = '/?expired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;