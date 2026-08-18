/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useGetProductByIdQuery } from '../../redux/api/productApi';
import {
    useCreateBarcodeMutation,
    useGetAllBarcodesByProductIdQuery,
} from '../../redux/api/barcodeApi';
import Container from '../../components/Container';
import SectionHeading from '../../components/SectionHeading';
import Loader from '../../components/Loader';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    TextInput,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
} from 'flowbite-react';
import moment from 'moment';
import { HiArrowLeft, HiOutlineDownload } from 'react-icons/hi';
import { IoBarcodeOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import DeleteBarcodeModal from './modals/DeleteBarcodeModal';
import { exportProductBarcodesToExcel } from '../../utils/exportToExcel';

const ProductDetails = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [barcodeInput, setBarcodeInput] = useState('');
    const [showCongratsModal, setShowCongratsModal] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const prevProductionQtyRef = useRef<number | null>(null);

    const {
        data: product,
        isLoading: isProductLoading,
        isError: isProductError,
    } = useGetProductByIdQuery(productId as string, {
        skip: !productId,
    });

    const { data: barcodes, isLoading: isBarcodesLoading } =
        useGetAllBarcodesByProductIdQuery(productId as string, {
            skip: !productId,
        });

    const [createBarcode, { isLoading: isCreatingBarcode }] =
        useCreateBarcodeMutation();

    useEffect(() => {
        if (product?.productName) {
            document.title = `${product.productName} - Majesto Production Management`;
        }
    }, [product?.productName]);

    useEffect(() => {
        if (isProductError) {
            toast.error('Product not found');
            navigate('/');
        }
    }, [isProductError, navigate]);

    // Check if Planned Quantity === Production Quantity and trigger Congratulations modal
    useEffect(() => {
        if (product && product.plannedQuantity > 0) {
            const isCompleted =
                product.productionQuantity === product.plannedQuantity;
            const hasQtyChanged =
                prevProductionQtyRef.current !== product.productionQuantity;

            if (isCompleted && hasQtyChanged) {
                setShowCongratsModal(true);
                const timer = setTimeout(() => {
                    setShowCongratsModal(false);
                }, 3500); // Auto-close after 3.5 seconds

                return () => clearTimeout(timer);
            }
            prevProductionQtyRef.current = product.productionQuantity;
        }
    }, [product]);

    const handleAddBarcode = async (e?: FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        const trimmedBarcode = barcodeInput.trim();
        if (!trimmedBarcode) {
            toast.error('Please enter a barcode');
            return;
        }

        if (!productId) return;

        const toastId = toast.loading('Adding barcode...');
        try {
            await createBarcode({
                productId,
                barcode: trimmedBarcode,
            }).unwrap();

            toast.success('Barcode added successfully', { id: toastId });
            setBarcodeInput('');
            // Keep focus on input for continuous scanning
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        } catch (error: any) {
            toast.error(
                error.message || error.data || 'Failed to add barcode',
                {
                    id: toastId,
                },
            );
            setBarcodeInput('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    };

    const handleDownloadExcel = () => {
        if (product) {
            exportProductBarcodesToExcel(product, barcodes || []);
        }
    };

    if (isProductLoading) {
        return (
            <Container className="min-h-[calc(100dvh-198px)] my-10 flex justify-center items-center">
                <Loader />
            </Container>
        );
    }

    if (!product) {
        return null;
    }

    // Calculate Remaining Quantity (never negative)
    const remainingQuantity = Math.max(
        0,
        (product.plannedQuantity || 0) - (product.productionQuantity || 0),
    );

    return (
        <Container className="min-h-[calc(100dvh-198px)] my-8">
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <HiArrowLeft size={16} />
                    Back to Products
                </Link>
            </div>

            {/* Page Header */}
            <SectionHeading
                title={product.productName}
                subTitle="Product Details & Barcode Management"
                className="mb-6"
            />

            {/* Congratulations Modal */}
            <Modal
                show={showCongratsModal}
                size="md"
                onClose={() => setShowCongratsModal(false)}
                popup
                dismissible
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center py-4 space-y-3">
                        <div className="text-5xl animate-bounce">🎉</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Congratulations!
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Production target of{' '}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {product.plannedQuantity}
                            </span>{' '}
                            units for{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {product.productName}
                            </span>{' '}
                            has been successfully completed!
                        </p>
                        <div className="pt-2">
                            <Button
                                color="success"
                                className="mx-auto"
                                size="xs"
                                onClick={() => setShowCongratsModal(false)}
                            >
                                Great Job!
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <div className="space-y-8">
                {/* 1. Small Font Metadata Bar at the Top */}
                <div className="bg-white dark:bg-gray-800 px-5 py-3.5 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm shadow-xs">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                            Date:{' '}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {moment(product.date).format('Do MMM, YYYY')}
                        </span>
                    </div>
                    <div className="hidden sm:block text-gray-300 dark:text-gray-600">
                        |
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                            Product Name:{' '}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {product.productName}
                        </span>
                    </div>
                    <div className="hidden sm:block text-gray-300 dark:text-gray-600">
                        |
                    </div>
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                            Manufacturing Order:{' '}
                        </span>
                        <span className="font-semibold font-mono text-gray-900 dark:text-white">
                            {product.manufacturingOrder}
                        </span>
                    </div>
                </div>

                {/* 2. Large Font Quantities Grid: Planned Quantity, Production Quantity, Remaining Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Planned Quantity Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-xs">
                        <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">
                            Planned Quantity
                        </span>
                        <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                            {product.plannedQuantity}
                        </span>
                    </div>

                    {/* Production Quantity Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-xs">
                        <span className="text-xs sm:text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-3">
                            Production Quantity
                        </span>
                        <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-blue-600 dark:text-blue-400 tracking-tight leading-none">
                            {product.productionQuantity ?? 0}
                        </span>
                    </div>

                    {/* Remaining Quantity Card */}
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-xs">
                        <span className="text-xs sm:text-sm uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-3">
                            Remaining Quantity
                        </span>
                        <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-amber-600 dark:text-amber-400 tracking-tight leading-none">
                            {remainingQuantity}
                        </span>
                    </div>
                </div>

                {/* 3. Barcode Input Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <IoBarcodeOutline size={20} />
                            Add Barcode
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Scan or type barcode here and press Enter.
                        </p>
                    </div>
                    <form
                        onSubmit={handleAddBarcode}
                        className="flex flex-col sm:flex-row gap-2 max-w-xl"
                    >
                        <TextInput
                            ref={inputRef}
                            type="text"
                            placeholder="Scan or enter barcode number..."
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            disabled={isCreatingBarcode}
                            autoFocus
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={
                                isCreatingBarcode || !barcodeInput.trim()
                            }
                            className="whitespace-nowrap"
                        >
                            Add Barcode
                        </Button>
                    </form>
                </div>

                {/* 4. Barcodes List Table */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                            Scanned Barcodes ({barcodes?.length || 0})
                        </h2>
                        <Button
                            size="xs"
                            color="light"
                            onClick={handleDownloadExcel}
                            disabled={!barcodes || barcodes.length === 0}
                            className="flex items-center"
                        >
                            <HiOutlineDownload className="mr-1.5 h-4 w-4" />
                            Download Excel
                        </Button>
                    </div>

                    {isBarcodesLoading ? (
                        <Loader />
                    ) : barcodes && barcodes.length ? (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <Table className="text-xs sm:text-base" hoverable>
                                <TableHead>
                                    <TableRow>
                                        <TableHeadCell className="px-3 py-2.5 sm:px-4 sm:py-3 w-16">
                                            #
                                        </TableHeadCell>
                                        <TableHeadCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                                            Barcode
                                        </TableHeadCell>
                                        <TableHeadCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                                            Created At
                                        </TableHeadCell>
                                        <TableHeadCell className="px-3 py-2.5 sm:px-4 sm:py-3 w-24">
                                            Action
                                        </TableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {barcodes.map((barcode, index) => (
                                        <TableRow
                                            key={barcode._id}
                                            className="bg-white dark:bg-gray-800"
                                        >
                                            <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3 text-gray-500">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3 font-mono font-medium text-gray-900 dark:text-white">
                                                {barcode.barcode}
                                            </TableCell>
                                            <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3 text-gray-500 dark:text-gray-400">
                                                {barcode.createdAt
                                                    ? moment(
                                                          barcode.createdAt,
                                                      ).format(
                                                          'Do MMM YYYY, h:mm:ss a',
                                                      )
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                                                <DeleteBarcodeModal
                                                    barcode={barcode}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="min-h-[25dvh] rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex flex-col justify-center items-center text-center p-8">
                            <IoBarcodeOutline
                                size={50}
                                className="text-gray-400 mb-2"
                            />
                            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                No Barcodes Scanned Yet
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                Scan or type a barcode above and press Enter to
                                record production.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default ProductDetails;
