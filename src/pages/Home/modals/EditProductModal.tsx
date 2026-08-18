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
import IconButton from '../../../components/IconButton';
import { MdOutlineEdit } from 'react-icons/md';
import type { TProduct } from '../../../types';
import { useUpdateProductMutation } from '../../../redux/api/productApi';

type EditProductModalProps = {
    product: TProduct;
};

const EditProductModal = ({ product }: EditProductModalProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    const handleUpdateProduct = async (data: FieldValues) => {
        setOpenModal(false);
        const toastId = toast.loading('Updating Product...');

        try {
            await updateProduct({
                productId: product._id as string,
                data,
            }).unwrap();

            toast.success('Product updated successfully', {
                id: toastId,
            });
        } catch (error: any) {
            toast.error(error.message || error.data || 'Something went wrong', {
                id: toastId,
            });
        }
    };

    const defaultValues = {
        productName: product.productName,
        productionPlan: product.productionPlan,
        manufacturingOrder: product.manufacturingOrder,
        date: product.date ? new Date(product.date) : undefined,
    };

    return (
        <>
            <IconButton onClick={() => setOpenModal(true)} disabled={isLoading}>
                <MdOutlineEdit size={20} />
            </IconButton>
            <Modal
                show={openModal}
                size="md"
                onClose={() => setOpenModal(false)}
                popup
            >
                <ModalHeader className="mt-2">
                    <span className="ml-4">Update Product</span>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <SForm
                            onSubmit={handleUpdateProduct}
                            resolver={zodResolver(productSchema)}
                            defaultValues={defaultValues}
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
                                Update Product
                            </Button>
                        </SForm>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default EditProductModal;
