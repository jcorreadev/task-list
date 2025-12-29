import type { TaskProps } from '../interfaces';
interface TaskSkeletonProps {
    length?: number;
}
export function Task({ task, onToggle, onDelete, onEdit, isLoadingToggle = false, isLoadingDelete = false }: TaskProps) {
    return (
        <div className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${task.completed
            ? 'bg-zinc-900/30 border-zinc-800/50'
            : 'bg-zinc-900/50 border-zinc-800'
            } ${(isLoadingToggle || isLoadingDelete) ? 'opacity-60' : ''}`}>
            <button
                onClick={() => onToggle(task.id)}
                disabled={isLoadingToggle || isLoadingDelete}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${task.completed
                    ? 'bg-cyan-500 border-cyan-500'
                    : 'border-zinc-600 hover:border-cyan-500'
                    } disabled:cursor-not-allowed disabled:hover:border-zinc-600`}
            >
                {isLoadingToggle ? (
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : task.completed ? (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                ) : null}
            </button>

            <span className={`flex-1 ${task.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
                {task.text}
            </span>

            <button
                type='button'
                disabled={isLoadingToggle || isLoadingDelete}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onEdit(task.id)}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>

            <button
                onClick={() => onDelete(task.id)}
                disabled={isLoadingToggle || isLoadingDelete}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoadingDelete ? (
                    <svg className="animate-spin h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </button>
        </div>
    )
}

export function TaskSkeleton({ length }: TaskSkeletonProps) {
    return (
        <div className="space-y-2">
            {Array.from({ length: length ?? 3 }).map((_, i) => (
                <div key={i + 'task-skeleton'} className="flex items-center gap-3 p-4 rounded-xl border bg-zinc-900/50 border-zinc-800 animate-pulse">
                    {/* Checkbox skeleton */}
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-700 bg-zinc-800/50" />

                    {/* Text skeleton */}
                    <div className="flex-1">
                        <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
                    </div>

                    {/* Action buttons skeleton (hidden but maintaining layout) */}
                    <div className="w-4 h-4 opacity-0" />
                    <div className="w-4 h-4 opacity-0" />
                </div>
            ))}
        </div>
    )
}


