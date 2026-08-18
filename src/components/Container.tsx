import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

type ContainerProps = {
    asChild?: boolean;
    children: ReactNode;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({ asChild, children, className, ...props }, ref) => {
        const Component = asChild ? Slot : 'div';

        return (
            <Component
                ref={ref}
                className={cn('container mx-auto px-3 md:px-6', className)}
                {...props}
            >
                {children}
            </Component>
        );
    },
);

export default Container;
