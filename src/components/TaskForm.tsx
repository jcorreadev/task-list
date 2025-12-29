import type { TaskFormProps } from '../interfaces/task-form.interface';

export function TaskForm({
    value,
    onChange,
    onSubmit,
    placeholder = 'Add a new task...',
    buttonText = 'Add',
    className = 'mb-6',
    isLoading = false,
}: TaskFormProps) {
    return (
        <form onSubmit={onSubmit} className={className}>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-3 bg-cyan-500 rounded-xl font-semibold hover:bg-cyan-600 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500 disabled:active:scale-100 flex items-center gap-2 min-w-[100px] justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading...</span>
                        </>
                    ) : (
                        buttonText
                    )}
                </button>
            </div>
        </form>
    );
}

