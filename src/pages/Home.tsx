import { useState, type JSX } from 'react'
import { Modal } from '../components/Modal';
import { Task as TaskComponent, TaskSkeleton } from '../components/Task';
import { Stats } from '../components/Stats';
import { TaskForm } from '../components/TaskForm';
import { UserDropdown } from '../components/UserDropdown';
import { UserForm } from '../components/UserForm';
import type { Task, User } from '../interfaces';
import React from 'react';
import { useTasksStore } from '../stores/tasks';
import { useUsersStore } from '../stores/users';

// Main App
export const Home = (): JSX.Element => {
    const tasksStore = useTasksStore()
    const usersStore = useUsersStore()
    const [newTask, setNewTask] = useState('')
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [openModal, setOpenModal] = useState(false)
    const [loadingAddTask, setLoadingAddTask] = useState(false)
    const [loadingEditTask, setLoadingEditTask] = useState(false)
    const [loadingDeleteTask, setLoadingDeleteTask] = useState<Map<string, boolean>>(new Map())
    const [loadingToggleTask, setLoadingToggleTask] = useState<Map<string, boolean>>(new Map())
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)
    const [openUserModal, setOpenUserModal] = useState(false)
    const [openEditUserModal, setOpenEditUserModal] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [loadingCreateUser, setLoadingCreateUser] = useState(false)
    const [loadingUpdateUser, setLoadingUpdateUser] = useState(false)

    const handleUserSelect = (user: User) => {
        setSelectedUserId(user.id)
        console.log('Selected user:', user)
        // Recarregar tasks quando o usuário for selecionado
        tasksStore.loadTasks()
    }

    const handleAddUser = () => {
        setOpenUserModal(true)
    }

    const handleCreateUser = async (data: { name: string; email: string }) => {
        setLoadingCreateUser(true)
        try {
            const response = await usersStore.createUser(data.name, data.email);
            if (response?.error) {
                throw new Error('Error creating user')
            }
            // Recarregar lista de usuários
            await usersStore.loadUsers();
            // Fechar modal
            setOpenUserModal(false);
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setLoadingCreateUser(false)
        }
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user)
        setOpenEditUserModal(true)
    }

    const handleUpdateUser = async (data: { name: string; email: string }) => {
        if (!editingUser) return
        
        setLoadingUpdateUser(true)
        try {
            const response = await usersStore.updateUser(editingUser.id, data.name, data.email);
            if (response?.error) {
                throw new Error('Error updating user')
            }
            // Recarregar lista de usuários
            await usersStore.loadUsers();
            // Fechar modal
            setOpenEditUserModal(false);
            setEditingUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setLoadingUpdateUser(false)
        }
    }

    const handleCloseEditUserModal = (open: boolean) => {
        setOpenEditUserModal(open)
        if (!open) {
            setEditingUser(null)
        }
    }
    const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newTask.trim() || loadingAddTask || !selectedUserId) return
        setLoadingAddTask(true)
        try {
            const response = await tasksStore.createTask(newTask.trim(), selectedUserId);
            if (response?.error) {
                throw new Error(response?.data.message ?? 'Error creating task')
            }
            await tasksStore.loadTasks();
            setNewTask('')
        } finally {
            setLoadingAddTask(false)
        }
    }

    const toggleTask = async (taskId: string) => {
        const task = tasksStore.tasks.data.find(t => t.id === taskId)
        if (!task) return

        console.log('TOGGLE TASK: ', task)
        setLoadingToggleTask(prev => new Map(prev).set(taskId, true))
        try {
            const response = await tasksStore.updateTask(task.id, task.text, !task.completed, task.userId);
            if (response?.error) {
                throw new Error(response?.data.message ?? 'Error toggling task')
            }
            await tasksStore.loadTasks();
        } finally {
            setLoadingToggleTask(prev => {
                const newMap = new Map(prev)
                newMap.delete(taskId)
                return newMap
            })
        }
    }

    const deleteTask = async (id: string) => {
        setLoadingDeleteTask(prev => new Map(prev).set(id, true))
        try {
            const response = await tasksStore.deleteTask(id);
            if (response?.error) {
                throw new Error(response?.data.message ?? 'Error deleting task')
            }
            await tasksStore.loadTasks();
        } finally {
            setLoadingDeleteTask(prev => {
                const newMap = new Map(prev)
                newMap.delete(id)
                return newMap
            })
        }
    }

    const editTask = (task: Task) => {
        setEditingTask(task)
        setOpenModal(true)
    }

    const editTaskText = (text: string) => {
        setEditingTask((prev: Task | null) => (prev ? { ...prev, text } : null))
    }

    const updateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingTask?.id || loadingEditTask) return
        setLoadingEditTask(true)
        try {
            const response = await tasksStore.updateTask(editingTask.id, editingTask.text, editingTask.completed, editingTask.userId);
            if (response?.error) {
                throw new Error(response?.data.message ?? 'Error updating task')
            }

            await tasksStore.loadTasks();
            handleModalClose(false);
        } finally {
            setLoadingEditTask(false)
        }
    }

    const handleModalClose = (open: boolean) => {
        setOpenModal(open)
        if (!open) {
            setEditingTask(null)
        }
    }

    React.useEffect(() => {
        usersStore.loadUsers()
        tasksStore.loadTasks()
    }, [])

    // Selecionar o primeiro usuário por padrão quando a lista de users for carregada
    React.useEffect(() => {
        if (
            usersStore.users.isLoaded &&
            usersStore.users.data.length > 0 &&
            !selectedUserId
        ) {
            const firstUser = usersStore.users.data[0]
            setSelectedUserId(firstUser.id)
            // Recarregar tasks para o primeiro usuário
            tasksStore.loadTasks()
        }
    }, [usersStore.users.isLoaded, usersStore.users.data, selectedUserId])

    // Filtrar tasks baseado no usuário selecionado
    const filteredTasks = React.useMemo(() => {
        let tasks = tasksStore.tasks.data

        // Filtrar por usuário selecionado
        if (selectedUserId) {
            tasks = tasks.filter((task) => task.userId === selectedUserId)
        }

        return tasks
    }, [tasksStore.tasks.data, selectedUserId])

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                    {/* Glow */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold">React Todo</h1>
                                    <p className="text-sm text-zinc-400">Stay productive</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <UserDropdown
                                    users={usersStore.users.data}
                                    selectedUserId={selectedUserId}
                                    onUserSelect={handleUserSelect}
                                    onAddUser={handleAddUser}
                                    onEditUser={handleEditUser}
                                    placeholder="Select user"
                                    tasks={tasksStore.tasks.data}
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <Stats tasks={filteredTasks} />

                        {/* Add Task Form */}
                        <TaskForm
                            value={newTask}
                            onChange={setNewTask}
                            onSubmit={addTask}
                            isLoading={loadingAddTask}
                        />

                        {/* Task List */}
                        <div className="space-y-2">
                            {!tasksStore.tasks.isLoaded ? (
                                <TaskSkeleton />
                            ) : filteredTasks.length === 0 ? (
                                <p className="text-center text-zinc-500 py-8">
                                    {selectedUserId
                                        ? 'No tasks found for the selected user.'
                                        : 'No tasks yet. Add one above!'}
                                </p>
                            ) : (
                                filteredTasks.map(task => (
                                    <TaskComponent
                                        key={task.id}
                                        task={task}
                                        onToggle={toggleTask}
                                        onDelete={deleteTask}
                                        onEdit={() => editTask(task)}
                                        isLoadingToggle={loadingToggleTask.get(task.id) ?? false}
                                        isLoadingDelete={loadingDeleteTask.get(task.id) ?? false}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-zinc-600 text-xs mt-6">
                    Built with React & Tailwind CSS by <a href="https://playcode.io/ianberdin" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-cyan-400">playcode.io</a>
                </p>
            </div>
            <Modal
                open={openModal}
                onOpenChange={handleModalClose}
                title="Edit Task"
                description="Edit the task"
            >
                <TaskForm
                    value={editingTask?.text ?? ''}
                    onChange={editTaskText}
                    onSubmit={updateTask}
                    placeholder="Edit task..."
                    buttonText="Save"
                    isLoading={loadingEditTask}
                />
            </Modal>

            <Modal
                open={openUserModal}
                onOpenChange={setOpenUserModal}
                title="Add New User"
                description="Create a new user account"
            >
                <UserForm
                    onSubmit={handleCreateUser}
                    isLoading={loadingCreateUser}
                    onCancel={() => setOpenUserModal(false)}
                    submitButtonText="Create User"
                />
            </Modal>

            <Modal
                open={openEditUserModal}
                onOpenChange={handleCloseEditUserModal}
                title="Edit User"
                description="Update user information"
            >
                <UserForm
                    onSubmit={handleUpdateUser}
                    isLoading={loadingUpdateUser}
                    onCancel={() => handleCloseEditUserModal(false)}
                    initialValues={editingUser ? { name: editingUser.name, email: editingUser.email || '' } : undefined}
                    submitButtonText="Update User"
                />
            </Modal>
        </div>
    )
}