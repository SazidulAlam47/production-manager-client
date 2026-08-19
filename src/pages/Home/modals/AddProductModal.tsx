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

const AddProductModal = ({
    buttonText = 'Add Product',
    disabled,
}: AddProductModalProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [createProduct, { isLoading }] = useCreateProductMutation();

    const handleCreateProduct = async (data: FieldValues) => {
        const toastId = toast.loading('Adding Product...');

        try {
            await createProduct(data).unwrap();

            toast.success('Product added successfully', {
                id: toastId,
            });
            setOpenModal(false);
        } catch (error: any) {
            toast.error(error.message || error.data || 'Something went wrong', {
                id: toastId,
            });
        }
    };

    const productDefaultValues = {
        date: new Date(),
        productName: '',
        plannedQuantity: '',
        manufacturingOrder: '',
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
                dismissible
            >
                <ModalHeader className="mt-2">
                    <span className="ml-4">Add Plan</span>
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
                                name="plannedQuantity"
                                label="Planned Quantity"
                                type="number"
                                placeholder="Enter planned quantity"
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
