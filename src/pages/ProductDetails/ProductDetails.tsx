/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
    useGetDailySummaryQuery,
    useGetProductByIdQuery,
} from '../../redux/api/productApi';
import {
    useCreateBarcodeMutation,
    useGetAllBarcodesByProductIdQuery,
    useLazyGetAllBarcodesByProductIdQuery,
} from '../../redux/api/barcodeApi';
import Container from '../../components/Container';
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
    Pagination,
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
    const [barcodePage, setBarcodePage] = useState(1);
    const [barcodeLimit] = useState(10);
    const [showCongratsModal, setShowCongratsModal] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        data: product,
        isLoading: isProductLoading,
        isError: isProductError,
    } = useGetProductByIdQuery(productId as string, {
        skip: !productId,
    });

    const productDateStr = product?.date
        ? moment(product.date).format('YYYY-MM-DD')
        : undefined;

    const { data: dailySummary } = useGetDailySummaryQuery(productDateStr, {
        skip: !productDateStr,
    });

    const { data: barcodeResponse, isLoading: isBarcodesLoading } =
        useGetAllBarcodesByProductIdQuery(
            {
                productId: productId as string,
                params: {
                    page: barcodePage,
                    limit: barcodeLimit,
                },
            },
            {
                skip: !productId,
            },
        );

    const [triggerGetBarcodes, { isFetching: isExportingBarcodes }] =
        useLazyGetAllBarcodesByProductIdQuery();

    const barcodes = barcodeResponse?.data;
    const barcodeMeta = barcodeResponse?.meta;

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

    const handleCloseCongratsModal = () => {
        setShowCongratsModal(false);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    useEffect(() => {
        if (!showCongratsModal) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showCongratsModal]);

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

        const toastId = toast.loading('Updating production...');
        try {
            await createBarcode({
                productId,
                barcode: trimmedBarcode,
            }).unwrap();

            const newProductionQty = (product?.productionQuantity ?? 0) + 1;
            const productName = product?.productName ?? 'Product';

            toast.success(
                `Production of ${productName} is now at ${newProductionQty} units.`,
                {
                    id: toastId,
                },
            );
            setBarcodeInput('');

            // Check if adding this barcode achieves the planned quantity target
            if (
                product &&
                product.plannedQuantity > 0 &&
                newProductionQty === product.plannedQuantity
            ) {
                setShowCongratsModal(true);
                setTimeout(() => {
                    handleCloseCongratsModal();
                }, 3500); // Auto-close after 3.5 seconds
            }

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

    const handleDownloadExcel = async () => {
        if (!product) return;
        const toastId = toast.loading(
            'Preparing full barcodes Excel report...',
        );
        try {
            const res = await triggerGetBarcodes({
                productId: product._id as string,
                params: { limit: 0 },
            }).unwrap();

            if (res?.data && res.data.length > 0) {
                exportProductBarcodesToExcel(product, res.data);
                toast.success('Excel report downloaded successfully', {
                    id: toastId,
                });
            } else {
                toast.error('No barcodes found to export', { id: toastId });
            }
        } catch (error: any) {
            toast.error(
                error?.message ||
                    error?.data ||
                    'Failed to export barcodes report',
                { id: toastId },
            );
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

    // Selected Product Calculations
    const plannedQty = product.plannedQuantity || 0;
    const productionQty = product.productionQuantity || 0;
    const isExtra = productionQty > plannedQty;

    const diffQuantity = isExtra
        ? productionQty - plannedQty
        : plannedQty - productionQty;

    const diffLabel = isExtra ? 'Extra Quantity' : 'Remaining Quantity';
    const diffColorClass = isExtra
        ? 'text-green-600 dark:text-green-400'
        : 'text-amber-600 dark:text-amber-400';

    // Daily Total Calculations
    const totalPlannedQty = dailySummary?.totalPlannedQuantity ?? plannedQty;
    const totalProductionQty =
        dailySummary?.totalProductionQuantity ?? productionQty;
    const isTotalExtra = totalProductionQty > totalPlannedQty;

    const totalDiffQuantity = isTotalExtra
        ? totalProductionQty - totalPlannedQty
        : totalPlannedQty - totalProductionQty;

    const totalDiffLabel = isTotalExtra
        ? 'Total Extra Quantity'
        : 'Total Remaining Quantity';
    const totalDiffColorClass = isTotalExtra
        ? 'text-green-600 dark:text-green-400'
        : 'text-amber-600 dark:text-amber-400';

    return (
        <Container className="min-h-[calc(100dvh-198px)] my-3">
            {/* Back Button */}
            <div className="flex justify-between items-center mb-1">
                <div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <HiArrowLeft size={16} />
                    </Link>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Production Status
                </h1>
                <div />
            </div>

            {/* Congratulations Modal */}
            <Modal
                show={showCongratsModal}
                size="md"
                onClose={handleCloseCongratsModal}
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
                                onClick={handleCloseCongratsModal}
                            >
                                Great Job!
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <div className="space-y-3">
                {/* 1. Small Font Metadata Bar at the Top */}
                <div className="bg-white dark:bg-gray-800 px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm shadow-xs">
                    <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                            Date:{' '}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {moment(product.date).format('Do MMM, YYYY')}
                        </span>
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

                {/* 2. Daily Total Production Summary Section */}
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Total Planned Quantity Card */}
                        <div className="bg-white dark:bg-gray-800 px-6 py-4 sm:px-8 sm:py-5 md:px-8 md:py-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-xs">
                            <span className="text-sm sm:text-lg font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                Total Planned Quantity
                            </span>
                            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                                {totalPlannedQty}
                            </span>
                        </div>

                        {/* Total Production Quantity Card */}
                        <div className="bg-white dark:bg-gray-800 px-6 py-4 sm:px-8 sm:py-5 md:px-8 md:py-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-xs">
                            <span className="text-sm sm:text-lg font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                                Total Production Quantity
                            </span>
                            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-blue-600 dark:text-blue-400 tracking-tight leading-none">
                                {totalProductionQty}
                            </span>
                        </div>

                        {/* Total Remaining / Extra Quantity Card */}
                        <div className="bg-white dark:bg-gray-800 px-6 py-4 sm:px-8 sm:py-5 md:px-8 md:py-5 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-xs">
                            <span
                                className={`text-sm sm:text-lg font-bold uppercase tracking-wider mb-2 ${totalDiffColorClass}`}
                            >
                                {totalDiffLabel}
                            </span>
                            <span
                                className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none ${totalDiffColorClass}`}
                            >
                                {totalDiffQuantity}
                            </span>
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl text-gray-900 dark:text-white mb-4 text-center">
                    Running Production:{' '}
                    <span className="font-bold">{product.productName}</span>
                </h2>
                {/* 3. Selected Product (Running Production) Summary Section */}
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Planned Quantity Card */}
                        <div className="bg-blue-50/50 dark:bg-slate-800/90 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-5 rounded-xl border border-blue-100 dark:border-blue-900/40 flex flex-col items-center justify-center text-center shadow-xs">
                            <span className="text-sm sm:text-lg font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                                {product.productName} Planned Quantity
                            </span>
                            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                                {plannedQty}
                            </span>
                        </div>

                        {/* Production Quantity Card */}
                        <div className="bg-blue-50/50 dark:bg-slate-800/90 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-5 rounded-xl border border-blue-100 dark:border-blue-900/40 flex flex-col items-center justify-center text-center shadow-xs">
                            <span className="text-sm sm:text-lg font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                                {product.productName} Production
                                Quantity
                            </span>
                            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-blue-600 dark:text-blue-400 tracking-tight leading-none">
                                {productionQty}
                            </span>
                        </div>

                        {/* Remaining / Extra Quantity Card */}
                        <div className="bg-blue-50/50 dark:bg-slate-800/90 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-5 rounded-xl border border-blue-100 dark:border-blue-900/40 flex flex-col items-center justify-center text-center shadow-xs">
                            <span
                                className={`text-sm sm:text-lg font-bold uppercase tracking-wider mb-2 ${diffColorClass}`}
                            >
                                {product.productName} {diffLabel}
                            </span>
                            <span
                                className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none ${diffColorClass}`}
                            >
                                {diffQuantity}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. Barcode Input Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <IoBarcodeOutline size={20} />
                            Add Barcode
                        </h2>
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

                {/* 5. Barcodes List Table */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                            Scanned Barcodes (
                            {barcodeMeta?.total ?? barcodes?.length ?? 0})
                        </h2>
                        <Button
                            size="xs"
                            color="light"
                            onClick={handleDownloadExcel}
                            disabled={
                                isExportingBarcodes ||
                                (barcodeMeta?.total === 0 &&
                                    barcodes?.length === 0)
                            }
                            className="flex items-center"
                        >
                            <HiOutlineDownload className="mr-1.5 h-4 w-4" />
                            {isExportingBarcodes
                                ? 'Exporting...'
                                : 'Download Excel'}
                        </Button>
                    </div>

                    {isBarcodesLoading ? (
                        <Loader />
                    ) : barcodes && barcodes.length ? (
                        <div className="space-y-3">
                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <Table
                                    className="text-xs sm:text-base"
                                    hoverable
                                >
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
                                        {barcodes.map((barcode, index) => {
                                            const rowIndex =
                                                (barcodePage - 1) *
                                                    barcodeLimit +
                                                index +
                                                1;
                                            return (
                                                <TableRow
                                                    key={barcode._id}
                                                    className="bg-white dark:bg-gray-800"
                                                >
                                                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3 text-gray-500">
                                                        {rowIndex}
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
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Barcodes Pagination */}
                            {barcodeMeta && barcodeMeta.totalPage > 1 && (
                                <div className="flex justify-center items-center pt-2">
                                    <Pagination
                                        currentPage={barcodePage}
                                        totalPages={barcodeMeta.totalPage}
                                        onPageChange={(page) =>
                                            setBarcodePage(page)
                                        }
                                        showIcons
                                    />
                                </div>
                            )}
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
