import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

type IconButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
};

const IconButton = ({
    children,
    onClick,
    className,
    disabled = false,
}: IconButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer p-1.5 rounded-full hover:bg-gray-200',
                className,
                {
                    'opacity-40': disabled,
                },
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default IconButton;
