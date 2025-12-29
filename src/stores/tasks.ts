import { create } from 'zustand';
import type { ResponseAsyncPropsData, ResponseDataProps } from '../interfaces/services';
import type { Task } from '../interfaces/task.interface';
import { api } from '../api';
import { defaultResponse } from './static';

interface TasksStore {
    tasks: ResponseDataProps<Task[]>;
    loadTasks: () => Promise<ResponseAsyncPropsData | undefined>;
    createTask: (text: string, userId: string) => Promise<ResponseAsyncPropsData | undefined>;
    updateTask: (id: string, text: string, completed: boolean, userId: string) => Promise<ResponseAsyncPropsData | undefined>;
    deleteTask: (id: string) => Promise<ResponseAsyncPropsData | undefined>;
}

export const useTasksStore = create<TasksStore>((set) => ({
    tasks: defaultResponse<Task[]>([] as Task[]),
    loadTasks: async () => {
        try {
            const response = await api().services.tasks().getTasks();
            
            if (!response) {
                set({
                    tasks: {
                        message: 'No response from server',
                        isLoaded: true,
                        error: true,
                        status: 500,
                        data: [] as Task[],
                    }
                });
                return undefined;
            }

            set({
                tasks: {
                    message: response.response?.message || '',
                    isLoaded: true,
                    error: !!response.error,
                    status: response.response?.status || 200,
                    data: response.error ? ([] as Task[]) : (response.response?.data ?? [] as Task[]),
                }
            });
            console.log('RESPONSE LOAD TASKS: ', response)
            
            if (response.error) {
                return undefined;
            }
            return {
                data: response.response?.data ?? ([] as Task[]),
            };
        } catch (error) {
            set({
                tasks: {
                    message: 'Failed to load tasks',
                    isLoaded: true,
                    error: true,
                    status: 500,
                    data: [] as Task[],
                }
            });
            return undefined;
        }
    },
    createTask: async (text: string, userId: string) => {
        const response = await api().services.tasks().createTask(text, userId);
        if (response?.error) {
            return undefined;
        }
        return {
            data: response?.response.data ?? ([] as Task[]),
        };
    },
    updateTask: async (id: string, text: string, completed: boolean, userId: string) => {
        const response = await api().services.tasks().updateTask(id, text, completed, userId);
        if (response?.error) {
            return undefined;
        }
        return {
            data: response?.response.data ?? ([] as Task[]),
        };
    },
    deleteTask: async (id: string) => {
        const response = await api().services.tasks().deleteTask(id);
        if (response?.error) {
            return undefined;
        }
        return {
            data: response?.response.data ?? ([] as Task[]),
        };
    }
}));
