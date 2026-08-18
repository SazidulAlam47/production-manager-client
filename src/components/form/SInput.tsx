import { Controller } from 'react-hook-form';
import SFormError from './SFormError';
import { Label, TextInput } from 'flowbite-react';

type SInputProps = {
    type?: string;
    placeholder?: string;
    name: string;
    label?: string;
    disabled?: boolean;
    className?: string;
};

const SInput = ({
    type = 'text',
    placeholder,
    name,
    label,
    disabled = false,
    className,
}: SInputProps) => {
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
                    <TextInput
                        {...field}
                        id={name}
                        type={type}
                        placeholder={placeholder || ''}
                        disabled={disabled}
                        color={error ? 'failure' : 'gray'}
                    />
                    <SFormError error={error} />
                </div>
            )}
        />
    );
};

export default SInput;
