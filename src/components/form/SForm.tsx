/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ReactNode, type RefObject, useImperativeHandle } from 'react';
import {
    type FieldValues,
    FormProvider,
    type SubmitHandler,
    useForm,
} from 'react-hook-form';
import { cn } from '../../utils/cn';

export type TSFormFncRef = {
    resetFrom: () => void;
};

type TFormConfig = {
    defaultValues?: Record<string, unknown>;
    resolver?: any;
    values?: Record<string, unknown>;
};

type SFormProps = {
    children: ReactNode;
    onSubmit: SubmitHandler<FieldValues>;
    fncRef?: RefObject<unknown>;
    className?: string;
} & TFormConfig;

const SForm = ({
    children,
    onSubmit,
    defaultValues,
    resolver,
    fncRef = undefined,
    values,
    className,
}: SFormProps) => {
    const formConfig: TFormConfig = {};

    if (defaultValues) {
        formConfig.defaultValues = defaultValues;
    }
    if (resolver) {
        formConfig.resolver = resolver;
    }
    if (values) {
        formConfig.values = values;
    }

    const methods = useForm(formConfig);

    const resetFrom = () => {
        methods.reset();
    };

    useImperativeHandle(fncRef, () => ({
        resetFrom,
    }));

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className={cn('space-y-3', className)}
            >
                {children}
            </form>
        </FormProvider>
    );
};

export default SForm;
