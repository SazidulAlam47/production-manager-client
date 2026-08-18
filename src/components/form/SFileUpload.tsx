import { useController, useFormContext } from 'react-hook-form';
import SFormError from './SFormError';
import { FileInput, Label } from 'flowbite-react';

type SFileUploadProps = {
    label?: string;
    className?: string;
};

const SFileUpload = ({ label, className }: SFileUploadProps) => {
    const { control, setValue } = useFormContext();

    const {
        field: { name },
        fieldState: { error },
    } = useController({
        name: 'file',
        control,
    });

    return (
        <div className={className}>
            <Label className="mb-2 block" htmlFor="file">
                {label}
            </Label>
            <FileInput
                id={name}
                name={name}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setValue('file', file);
                    }
                }}
            />
            <SFormError error={error} />
        </div>
    );
};

export default SFileUpload;
