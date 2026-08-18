import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

type SectionTitleProps = {
    className?: string;
    children: ReactNode;
};

const TitleText = ({ className, children }: SectionTitleProps) => {
    return (
        <h2
            className={cn(
                'text-[#111418] text-3xl font-bold leading-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] text-center',
                className
            )}
        >
            {children}
        </h2>
    );
};

export default TitleText;
