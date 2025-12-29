import { api } from '../index';

export const tasksServices = () => {
    const { instance, handleResponse, handleErrors } = api();
    async function getTasks() {
        try {
            const response = await instance.get('/tasks');
            return handleResponse(response);
        } catch (error) {
            return handleErrors(error);
        }
    }

    async function createTask(text: string, userId: string) {
        try {
            const response = await instance.post('/tasks', { text, userId });
            return handleResponse(response);
        } catch (error) {
            return handleErrors(error);
        }
    }

    async function updateTask(id: string, text: string, completed: boolean, userId: string) {
        try {
            const response = await instance.put(`/tasks/${id}`, { text, completed, userId });
            return handleResponse(response);
        } catch (error) {
            return handleErrors(error);
        }
    }

    async function deleteTask(id: string) {
        try {
            const response = await instance.delete(`/tasks/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleErrors(error);
        }
    }

    return {
        getTasks,
        createTask,
        updateTask,
        deleteTask,
    }
}