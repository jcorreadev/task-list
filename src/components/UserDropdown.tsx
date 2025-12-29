import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { UserDropdownProps } from '../interfaces/user-dropdown.interface';

export function UserDropdown({ 
    users, 
    selectedUserId, 
    onUserSelect,
    onAddUser,
    onEditUser,
    placeholder = 'Select user',
    tasks = []
}: UserDropdownProps) {
    const selectedUser = users.find(user => user.id === selectedUserId);
    
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getTaskCount = (userId: string) => {
        return tasks.filter(task => task.userId === userId).length;
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white hover:bg-zinc-800 hover:border-zinc-600 transition-colors focus:outline-none focus:border-cyan-500"
                    aria-label="Select user"
                >
                    {selectedUser ? (
                        <>
                            {selectedUser.avatar ? (
                                <img
                                    src={selectedUser.avatar}
                                    alt={selectedUser.name}
                                    className="w-6 h-6 rounded-full"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                                    {getInitials(selectedUser.name)}
                                </div>
                            )}
                            <span className="text-sm font-medium">{selectedUser.name}</span>
                        </>
                    ) : (
                        <>
                            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span className="text-sm text-zinc-400">{placeholder}</span>
                        </>
                    )}
                    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[200px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl z-50 flex flex-col"
                    sideOffset={5}
                    align="end"
                >
                    {/* Lista de usuários com scroll (mostra aproximadamente 4 usuários) */}
                    <div className="p-2 overflow-y-auto max-h-[320px]">
                        {users.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-zinc-400 text-center">
                                No users available
                            </div>
                        ) : (
                            users.map((user) => {
                                const taskCount = getTaskCount(user.id);
                                return (
                                    <DropdownMenu.Item
                                        key={user.id}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer outline-none transition-colors ${
                                            selectedUserId === user.id
                                                ? 'bg-cyan-500/20 text-cyan-400'
                                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                        onSelect={() => {
                                            onUserSelect?.(user);
                                        }}
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                                                {getInitials(user.name)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{user.name}</div>
                                            {user.email && (
                                                <div className="text-xs text-zinc-400 truncate">{user.email}</div>
                                            )}
                                            <div className="text-xs text-zinc-500 mt-0.5">
                                                {taskCount} task{taskCount !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {onEditUser && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        onEditUser(user);
                                                    }}
                                                    className="p-1.5 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 rounded transition-colors"
                                                    title="Edit user"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            )}
                                            {selectedUserId === user.id && (
                                                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </DropdownMenu.Item>
                                );
                            })
                        )}
                    </div>

                    {/* Botão fixo para adicionar usuário */}
                    <div className="border-t border-zinc-800 p-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onAddUser) {
                                    onAddUser();
                                }
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer outline-none transition-colors text-zinc-300 hover:bg-zinc-800 hover:text-white w-full"
                        >
                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="font-medium">Add new user</span>
                        </button>
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

