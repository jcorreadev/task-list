import { type ReactNode } from 'react';
import type { ModalSize } from '../types/modal.types';

export interface ModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children: ReactNode;
    trigger?: ReactNode;
    size?: ModalSize;
    showCloseButton?: boolean;
}

