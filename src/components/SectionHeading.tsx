import { cn } from '../utils/cn';
import NormalText from './NormalText';
import TitleText from './TitleText';

type SectionHeadingProps = {
    title: string;
    subTitle: string;
    className?: string;
    position?: 'left' | 'center';
};

const SectionHeading = ({
    title,
    subTitle,
    className,
    position = 'center',
}: SectionHeadingProps) => {
    return (
        <div className={cn('flex flex-col gap-2 mb-4', className)}>
            <TitleText
                className={cn('text-6xl sm:text-6xl', {
                    'text-left': position === 'left',
                })}
            >
                {title}
            </TitleText>
            <NormalText
                className={cn('max-w-[7200px] text-xl', {
                    'mx-auto text-center': position === 'center',
                })}
            >
                {subTitle}
            </NormalText>
        </div>
    );
};

export default SectionHeading;
