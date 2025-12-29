export interface UserFormData {
    name: string;
    email: string;
}

export interface UserFormProps {
    onSubmit: (data: UserFormData) => void | Promise<void>;
    isLoading?: boolean;
    onCancel?: () => void;
    initialValues?: UserFormData;
    submitButtonText?: string;
}

