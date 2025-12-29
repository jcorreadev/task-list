import { create } from 'zustand';
import { api } from '../api';
import type { ResponseAsyncPropsData, ResponseDataProps } from '../interfaces/services';
import type { User } from '../interfaces/user-dropdown.interface';
import { defaultResponse } from './static';

interface UsersStore {
    users: ResponseDataProps<User[]>;
    loadUsers: () => Promise<ResponseAsyncPropsData | undefined>;
    createUser: (name: string, email: string) => Promise<ResponseAsyncPropsData | undefined>;
    updateUser: (id: string, name: string, email: string) => Promise<ResponseAsyncPropsData | undefined>;
}

export const useUsersStore = create<UsersStore>((set) => ({
    users: defaultResponse<User[]>([] as User[]),
    loadUsers: async () => {
        try {
            const response = await api().services.users().getUsers();
            
            if (!response) {
                set({
                    users: {
                        message: 'No response from server',
                        isLoaded: true,
                        error: true,
                        status: 500,
                        data: [] as User[],
                    }
                });
                return undefined;
            }

            set({
                users: {
                    message: response.response?.message || '',
                    isLoaded: true,
                    error: !!response.error,
                    status: response.response?.status || 200,
                    data: response.error ? ([] as User[]) : (response.response?.data ?? [] as User[]),
                }
            });
            console.log('RESPONSE LOAD USERS: ', response)
            
            if (response.error) {
                return undefined;
            }
            return {
                data: response.response?.data ?? ([] as User[]),
            };
        } catch (error) {
            set({
                users: {
                    message: 'Failed to load users',
                    isLoaded: true,
                    error: true,
                    status: 500,
                    data: [] as User[],
                }
            });
            return undefined;
        }
    },
    createUser: async (name: string, email: string) => {
        try {
            const response = await api().services.users().createUser(name, email);
            if (response?.error) {
                return undefined;
            }
            return {
                data: response?.response?.data ?? ({} as User),
            };
        } catch (error) {
            return undefined;
        }
    },
    updateUser: async (id: string, name: string, email: string) => {
        try {
            const response = await api().services.users().updateUser(id, name, email);
            if (response?.error) {
                return undefined;
            }
            return {
                data: response?.response?.data ?? ({} as User),
            };
        } catch (error) {
            return undefined;
        }
    },
}));

