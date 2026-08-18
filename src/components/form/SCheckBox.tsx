import { Controller } from 'react-hook-form';
import SFormError from './SFormError';
import { Checkbox, Label } from 'flowbite-react';
import { cn } from '../../utils/cn';

type SSCheckBoxProps = {
    name: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    options: { value: string; label: string }[];
};

const SCheckBox = ({
    name,
    label,
    disabled = false,
    className,
    options,
}: SSCheckBoxProps) => {
    return (
        <Controller
            name={name}
            defaultValue={[]}
            render={({ field, fieldState: { error } }) => {
                const valueArray: string[] = Array.isArray(field.value)
                    ? field.value
                    : [];
                return (
                    <div
                        className={cn(
                            'flex max-w-md flex-col gap-2',
                            className
                        )}
                        id={name}
                    >
                        {label && (
                            <div className="block">
                                <Label>{label}</Label>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                            {options.map((option) => {
                                const optionId = `${name}-${option.value}`;
                                const checked = valueArray.includes(
                                    option.value
                                );
                                return (
                                    <div
                                        key={option.value}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={optionId}
                                            name={field.name}
                                            value={option.value}
                                            checked={checked}
                                            disabled={disabled}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    field.onChange([
                                                        ...valueArray,
                                                        option.value,
                                                    ]);
                                                } else {
                                                    field.onChange(
                                                        valueArray.filter(
                                                            (v) =>
                                                                v !==
                                                                option.value
                                                        )
                                                    );
                                                }
                                            }}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                        />
                                        <Label
                                            htmlFor={optionId}
                                            disabled={disabled}
                                        >
                                            {option.label}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                        <SFormError error={error} />
                    </div>
                );
            }}
        />
    );
};

export default SCheckBox;
