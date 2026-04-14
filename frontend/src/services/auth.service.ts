import api from './api';

export const authService = {
    login: async (data: any) => {
        const response = await api.post('/auth/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    register: async (data: any) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
