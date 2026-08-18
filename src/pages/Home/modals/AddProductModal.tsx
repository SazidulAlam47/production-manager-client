/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';
import { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import SForm from '../../../components/form/SForm';
import SInput from '../../../components/form/SInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import SDatePicker from '../../../components/form/SDatePicker';
import { productSchema } from '../../../schemas/product.schema';
import { useCreateProductMutation } from '../../../redux/api/productApi';

type AddProductModalProps = {
    buttonText?: string;
    disabled?: boolean;
};

const productDefaultValues = {
    date: undefined,
    productName: '',
    productionPlan: '',
    manufacturingOrder: '',
};

const AddProductModal = ({
    buttonText = 'Add Product',
    disabled,
}: AddProductModalProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [createProduct, { isLoading }] = useCreateProductMutation();

    const handleCreateProduct = async (data: FieldValues) => {
        setOpenModal(false);
        const toastId = toast.loading('Adding Product...');

        try {
            await createProduct(data).unwrap();

            toast.success('Product added successfully', {
                id: toastId,
            });
        } catch (error: any) {
            toast.error(error.message || error.data || 'Something went wrong', {
                id: toastId,
            });
        }
    };

    return (
        <>
            <Button
                size="xs"
                onClick={() => setOpenModal(true)}
                disabled={disabled || isLoading}
            >
                {buttonText}
            </Button>
            <Modal
                show={openModal}
                size="md"
                onClose={() => setOpenModal(false)}
                popup
            >
                <ModalHeader className="mt-2">
                    <span className="ml-4">Add Product</span>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <SForm
                            onSubmit={handleCreateProduct}
                            resolver={zodResolver(productSchema)}
                            defaultValues={productDefaultValues}
                        >
                            <SDatePicker
                                name="date"
                                label="Date"
                                placeholder="Please Select a Date"
                            />
                            <SInput
                                name="productName"
                                label="Product Name"
                                placeholder="Enter product name"
                            />
                            <SInput
                                name="productionPlan"
                                label="Production Plan"
                                type="number"
                                placeholder="Enter production plan"
                            />
                            <SInput
                                name="manufacturingOrder"
                                label="Manufacturing Order"
                                placeholder="Enter manufacturing order"
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                Add Product
                            </Button>
                        </SForm>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default AddProductModal;
