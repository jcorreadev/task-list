import { useState, useEffect } from 'react';
import type { UserFormProps } from '../interfaces/user-form.interface';

export function UserForm({ onSubmit, isLoading = false, onCancel, initialValues, submitButtonText = 'Create User' }: UserFormProps) {
    const [name, setName] = useState(initialValues?.name || '');
    const [email, setEmail] = useState(initialValues?.email || '');

    useEffect(() => {
        if (initialValues) {
            setName(initialValues.name);
            setEmail(initialValues.email);
        }
    }, [initialValues]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || isLoading) return;
        
        await onSubmit({ name: name.trim(), email: email.trim() });
        
        // Limpar campos após submit bem-sucedido apenas se não for edição
        if (!initialValues) {
            setName('');
            setEmail('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="user-name" className="block text-sm font-medium text-zinc-300 mb-2">
                    Name
                </label>
                <input
                    id="user-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter user name"
                    disabled={isLoading}
                    required
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>

            <div>
                <label htmlFor="user-email" className="block text-sm font-medium text-zinc-300 mb-2">
                    Email
                </label>
                <input
                    id="user-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter user email"
                    disabled={isLoading}
                    required
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>

            <div className="flex gap-3 pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading || !name.trim() || !email.trim()}
                    className="flex-1 px-4 py-3 bg-cyan-500 rounded-xl font-semibold hover:bg-cyan-600 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500 disabled:active:scale-100 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Saving...</span>
                        </>
                    ) : (
                        submitButtonText
                    )}
                </button>
            </div>
        </form>
    );
}

