import { Controller } from 'react-hook-form';
import { Datepicker, Label, TextInput } from 'flowbite-react';
import SFormError from './SFormError';
import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import { MdDateRange } from 'react-icons/md';

type SDatePickerProps = {
    name: string;
    label?: string;
    disabled?: boolean;
    className?: string;
    maxDate?: Date;
    minDate?: Date;
    placeholder?: string;
};

const SDatePicker = ({
    name,
    label,
    disabled = false,
    className,
    maxDate,
    minDate,
    placeholder,
}: SDatePickerProps) => {
    const [showPopup, setShowPopup] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target as Node)
            ) {
                setShowPopup(false);
            }
        };

        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup]);

    return (
        <Controller
            name={name}
            render={({ field, fieldState: { error } }) => (
                <div className={className} ref={datePickerRef}>
                    <div className="mb-1 block">
                        <Label htmlFor={name} className="text-[#111418]">
                            {label}
                        </Label>
                    </div>
                    <TextInput
                        icon={MdDateRange}
                        value={
                            field.value
                                ? moment(field.value).format('D MMMM, YYYY')
                                : undefined
                        }
                        placeholder={placeholder}
                        onClick={() => setShowPopup(true)}
                        color={error ? 'failure' : 'gray'}
                        readOnly
                    />
                    {showPopup && (
                        <Datepicker
                            {...field}
                            onChange={(date) => {
                                field.onChange(date);
                                setShowPopup(false);
                            }}
                            id={name}
                            disabled={disabled}
                            maxDate={maxDate}
                            minDate={minDate}
                            inline
                            className="absolute z-20"
                        />
                    )}

                    <SFormError error={error} />
                </div>
            )}
        />
    );
};

export default SDatePicker;
