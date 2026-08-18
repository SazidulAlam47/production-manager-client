import { Controller } from 'react-hook-form';
import SFormError from './SFormError';
import { Label, Textarea } from 'flowbite-react';

type STextAreaProps = {
    placeholder?: string;
    name: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    rows?: number;
};

const STextArea = ({
    placeholder,
    name,
    label,
    disabled = false,
    className,
    rows,
}: STextAreaProps) => {
    return (
        <Controller
            name={name}
            render={({ field, fieldState: { error } }) => (
                <div className={className}>
                    <div className="mb-1 block">
                        <Label htmlFor={name} className="text-[#111418]">
                            {label}
                        </Label>
                    </div>
                    <Textarea
                        {...field}
                        id={name}
                        placeholder={placeholder || ''}
                        disabled={disabled}
                        color={error ? 'failure' : 'gray'}
                        rows={rows}
                    />
                    <SFormError error={error} />
                </div>
            )}
        />
    );
};

export default STextArea;
