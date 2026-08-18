import { Controller } from 'react-hook-form';
import SFormError from './SFormError';
import { Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

type SInputPasswordProps = {
    disabled?: boolean;
    className?: string;
};

const SInputPassword = ({
    disabled = false,
    className,
}: SInputPasswordProps) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <Controller
            name="password"
            render={({ field, fieldState: { error } }) => (
                <div className={className}>
                    <div className="mb-1 block">
                        <Label htmlFor="password1" className="text-[#111418]">
                            Password
                        </Label>
                    </div>
                    <div className="relative">
                        <TextInput
                            {...field}
                            id="password1"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            disabled={disabled}
                            color={error ? 'failure' : 'gray'}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <HiEyeOff className="h-5 w-5 text-gray-500" />
                            ) : (
                                <HiEye className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <SFormError error={error} />
                </div>
            )}
        />
    );
};

export default SInputPassword;
