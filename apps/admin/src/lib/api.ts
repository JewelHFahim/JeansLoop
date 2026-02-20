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
    getById: (id: string) => apiClient.get(`/products/details/${id}`),
    getBySlug: (slug: string) => apiClient.get(`/products/${slug}`),
    create: (data: any) => apiClient.post('/products', data),
    update: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
    delete: (id: string) => apiClient.delete(`/products/${id}`),
};

// Orders API
export const ordersApi = {
    getAll: (params?: any) => apiClient.get('/orders', { params }),
    getById: (id: string) => apiClient.get(`/orders/${id}`),
    create: (data: any) => apiClient.post('/orders', data),
    getMyOrders: () => apiClient.get('/orders/myorders'),
    markAsPaid: (id: string) => apiClient.put(`/orders/${id}/pay`),
    markAsDelivered: (id: string) => apiClient.put(`/orders/${id}/deliver`),
};

// Users API
export const usersApi = {
    getAll: () => apiClient.get('/users'),
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data: any) => apiClient.put('/users/profile', data),
    delete: (id: string) => apiClient.delete(`/users/${id}`),
};

// Stats API
export const statsApi = {
    getDashboard: () => apiClient.get('/stats'),
};

// Categories API
export const categoriesApi = {
    getAll: () => apiClient.get('/categories'),
    getById: (id: string) => apiClient.get(`/categories/${id}`),
    create: (data: any) => apiClient.post('/categories', data),
    update: (id: string, data: any) => apiClient.put(`/categories/${id}`, data),
    delete: (id: string) => apiClient.delete(`/categories/${id}`),
};

// Coupons API
export const couponsApi = {
    getAll: () => apiClient.get('/coupons'),
    getById: (id: string) => apiClient.get(`/coupons/${id}`),
    create: (data: any) => apiClient.post('/coupons', data),
    update: (id: string, data: any) => apiClient.put(`/coupons/${id}`, data),
    delete: (id: string) => apiClient.delete(`/coupons/${id}`),
    validate: (code: string, amount: number) => apiClient.post('/coupons/validate', { code, amount }),
};

// Upload API
export const uploadApi = {
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        return apiClient.post('/upload', formData);
    },
};
