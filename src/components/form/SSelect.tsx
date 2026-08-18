import { Controller } from 'react-hook-form';
import SFormError from './SFormError';
import { Label, Select } from 'flowbite-react';

type SSelectProps = {
    name: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    options: { value: string | number; label: string }[];
};

const SSelect = ({
    name,
    label,
    disabled = false,
    className,
    options,
}: SSelectProps) => {
    return (
        <Controller
            name={name}
            render={({ field, fieldState: { error } }) => (
                <div className={className}>
                    <div className="mb-2 block">
                        <Label htmlFor={name}>{label}</Label>
                    </div>
                    <Select
                        {...field}
                        id={name}
                        disabled={disabled}
                        color={error ? 'failure' : 'gray'}
                    >
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <SFormError error={error} />
                </div>
            )}
        />
    );
};

export default SSelect;
