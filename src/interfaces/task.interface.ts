export interface Task {
    id: string;
    text: string;
    completed: boolean;
    userId: string;
}

export interface TaskProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    isLoadingToggle?: boolean;
    isLoadingDelete?: boolean;
}

