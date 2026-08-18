import { Controller } from 'react-hook-form';
import SFormError from './SFormError'; // Assuming this is your error display component
import { Label, Radio } from 'flowbite-react';
import { cn } from '../../utils/cn';

type SRadioProps = {
    name: string;
    label?: string;
    className?: string;
    options: string[];
    disabled?: boolean;
    selectedIndex?: number;
    correctAnswer?: number;
};

const SRadio = ({
    name,
    label,
    className,
    options,
    disabled = false,
    selectedIndex,
    correctAnswer,
}: SRadioProps) => {
    return (
        <Controller
            name={name}
            render={({ field, fieldState: { error } }) => (
                <div className={className}>
                    {label && (
                        <div className="mb-2 block">
                            <Label className="text-base">{label}</Label>
                        </div>
                    )}
                    <div className="flex max-w-md flex-col gap-4">
                        {options.map((option, index) => {
                            const stringIndex = index.toString();
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <Radio
                                        id={`${name}-${stringIndex}`}
                                        name={name}
                                        value={stringIndex} // Use string value
                                        checked={field.value === stringIndex}
                                        onChange={() =>
                                            field.onChange(stringIndex)
                                        }
                                        disabled={disabled}
                                        className={cn(
                                            {
                                                'text-red-600':
                                                    selectedIndex === index &&
                                                    correctAnswer !==
                                                        selectedIndex,
                                            },
                                            {
                                                'text-green-500':
                                                    selectedIndex === index &&
                                                    correctAnswer ===
                                                        selectedIndex,
                                            }
                                        )}
                                    />
                                    <Label
                                        htmlFor={`${name}-${stringIndex}`}
                                        disabled={disabled}
                                        className={cn(
                                            'text-base',
                                            {
                                                'text-red-600':
                                                    selectedIndex === index &&
                                                    correctAnswer !==
                                                        selectedIndex,
                                            },
                                            {
                                                'text-green-500':
                                                    correctAnswer === index,
                                            }
                                        )}
                                    >
                                        {option}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                    <SFormError error={error} />
                </div>
            )}
        />
    );
};

export default SRadio;
