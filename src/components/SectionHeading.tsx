import { cn } from '../utils/cn';
import NormalText from './NormalText';
import TitleText from './TitleText';

type SectionHeadingProps = {
    title: string;
    subTitle: string;
    className?: string;
    position?: 'left' | 'center';
    size?: 'small' | 'medium';
};

const SectionHeading = ({
    title,
    subTitle,
    className,
    position = 'center',
    size = 'medium',
}: SectionHeadingProps) => {
    return (
        <div className={cn('flex flex-col gap-2 mb-4', className)}>
            <TitleText
                className={cn(
                    { 'text-left': position === 'left' },
                    { 'text-2xl sm:text-3xl': size === 'small' }
                )}
            >
                {title}
            </TitleText>
            <NormalText
                className={cn('max-w-[7200px]', {
                    'mx-auto text-center': position === 'center',
                })}
            >
                {subTitle}
            </NormalText>
        </div>
    );
};

export default SectionHeading;
