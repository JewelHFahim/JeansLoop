import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, usersApi } from '@/lib/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isInitialized: false,
            login: (token, user) => {
                localStorage.setItem('token', token);
                set({ token, user, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('token');
                set({ token: null, user: null, isAuthenticated: false });
            },
            checkAuth: async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        // Verify token by calling getProfile
                        const { data } = await usersApi.getProfile();
                        set({ user: data, token, isAuthenticated: true, isInitialized: true });
                    } catch (error) {
                        localStorage.removeItem('token');
                        set({ token: null, user: null, isAuthenticated: false, isInitialized: true });
                    }
                } else {
                    set({ token: null, user: null, isAuthenticated: false, isInitialized: true });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
