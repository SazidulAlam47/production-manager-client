import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

type NormalTextProps = {
    className?: string;
    children: ReactNode;
};

const NormalText = ({ className, children }: NormalTextProps) => {
    return (
        <p
            className={cn(
                'text-[#111418] text-base font-normal leading-normal',
                className
            )}
        >
            {children}
        </p>
    );
};

export default NormalText;
