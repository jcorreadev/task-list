import type { Task } from './task.interface';

export interface User {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
}

export interface UserDropdownProps {
    users: User[];
    selectedUserId?: string;
    onUserSelect?: (user: User) => void;
    onAddUser?: () => void;
    onEditUser?: (user: User) => void;
    placeholder?: string;
    tasks?: Task[];
}

