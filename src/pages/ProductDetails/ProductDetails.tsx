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
    const inputRef = useRef<HTMLInputElement>(null);

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
                className="mb-8"
            />

            <div className="space-y-8">
                {/* 1. Product Info Section: 1:3 Grid Ratio */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* First Column (1 part): Date, Product Name, Manufacturing Order */}
                    <div className="md:col-span-1 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center space-y-4 shadow-xs">
                        <div>
                            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                                Date
                            </span>
                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-0.5">
                                {moment(product.date).format('Do MMM, YYYY')}
                            </p>
                        </div>
                        <hr className="border-gray-100 dark:border-gray-700/60" />
                        <div>
                            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                                Product Name
                            </span>
                            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                                {product.productName}
                            </p>
                        </div>
                        <hr className="border-gray-100 dark:border-gray-700/60" />
                        <div>
                            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                                Manufacturing Order
                            </span>
                            <p className="text-sm sm:text-base font-semibold font-mono text-gray-900 dark:text-white mt-0.5">
                                {product.manufacturingOrder}
                            </p>
                        </div>
                    </div>

                    {/* Second Column (3 parts): Planned Quantity & Production Quantity in large font */}
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Planned Quantity Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-xs">
                            <span className="text-sm sm:text-base uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
                                Planned Quantity
                            </span>
                            <span className="text-9xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                {product.plannedQuantity}
                            </span>
                        </div>

                        {/* Production Quantity Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-xs">
                            <span className="text-sm sm:text-base uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                Production Quantity
                            </span>
                            <span className="text-9xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                {product.productionQuantity ?? 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Barcode Input Section */}
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
                            disabled={isCreatingBarcode || !barcodeInput.trim()}
                            className="whitespace-nowrap"
                        >
                            Add Barcode
                        </Button>
                    </form>
                </div>

                {/* 3. Barcodes List Table */}
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
