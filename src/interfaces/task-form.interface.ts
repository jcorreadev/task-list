export interface TaskFormProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    placeholder?: string;
    buttonText?: string;
    className?: string;
    isLoading?: boolean;
}

