import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import type { ErrorDataProps, ErrorsDataPayloadProps } from '../interfaces/services';
import { tasksServices as tasks } from './services/tasks';
import { usersServices as users } from './services/users';
export const api = () => {
    const services = {
        tasks,
        users,
    };
    
    // Configuração base do cliente axios
    const instance: AxiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });


    const handleResponse = (response: AxiosResponse) => {
        const res = {
            ...response.data,
            status: response.status,
        };
        return {
            error: false,
            response: res,
        };
    };

    const handleErrors = (error: any) => {
        if (error instanceof AxiosError) {
            const response = {
                ...error.response?.data as ErrorDataProps | ErrorsDataPayloadProps,
                status: error.response?.status || 500,
                message: (error.response?.data as ErrorDataProps)?.message || error.message || 'An error occurred',
                data: null,
            };

            return {
                error: true,
                response,
            };
        }
        
        // Fallback para erros não-AxiosError
        return {
            error: true,
            response: {
                status: 500,
                message: error?.message || 'An unexpected error occurred',
                data: null,
            },
        };
    };


    return {
        instance,
        services,
        handleResponse,
        handleErrors,
    }
}

