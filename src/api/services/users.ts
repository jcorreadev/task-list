import { api } from '../index';

export const usersServices = () => {
    const { instance, handleResponse, handleErrors } = api();
    async function getUsers() {
        try {
            const response = await instance.get('/users');
            return handleResponse(response);
        } catch (error) {
            return handleErrors(error);
        }
    }

    async function createUser(name: string, email: string) {
        try {
            const response = await instance.post('/users', { name, email });
            return handleResponse(response);
        } catch (error) {
            return handleErrors(error);
        }
    }

    async function updateUser(id: string, name: string, email: string) {
        try {
            const response = await instance.put(`/users/${id}`, { name, email });
            return handleResponse(response);
        } catch (error) {
            return handleErrors(error);
        }
    }

    return {
        getUsers,
        createUser,
        updateUser,
    }
}