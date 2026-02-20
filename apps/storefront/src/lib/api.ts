import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and reload or redirect if needed
            localStorage.removeItem('token');
            // We can't use useAuthStore here easily without creating cycles, 
            // but we can trigger a storage event or similar if needed.
            // For now, removing the token will make subsequent checkAuth calls fail
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                window.location.href = '/auth/login?redirect=' + window.location.pathname;
            }
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        apiClient.post('/auth/login', { email, password }),
    register: (name: string, email: string, password: string) =>
        apiClient.post('/auth/register', { name, email, password }),
    logout: () => apiClient.post('/auth/logout'),
};

// Products API
export const productsApi = {
    getAll: (params?: any) => apiClient.get('/products', { params }),
    getBySlug: (slug: string) => apiClient.get(`/products/${slug}`),
};

// Orders API
export const ordersApi = {
    create: (data: any) => apiClient.post('/orders', data),
    getMyOrders: () => apiClient.get('/orders/myorders'),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
};

// Users API
export const usersApi = {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: any) => apiClient.put('/users/profile', data),
};

// Coupons API
export const couponsApi = {
    validate: (code: string, amount: number) => apiClient.post('/coupons/validate', { code, amount }),
};
