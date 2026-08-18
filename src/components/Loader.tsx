import { Spinner } from 'flowbite-react';
import { cn } from '../utils/cn';

type LoaderProps = {
    className?: string;
};

const Loader = ({ className }: LoaderProps) => {
    return (
        <div
            className={cn(
                'min-h-[calc(100dvh-300px)]  flex justify-center items-center',
                className,
            )}
        >
            <Spinner size="xl" />
        </div>
    );
};

export default Loader;
