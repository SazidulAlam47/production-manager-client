/* eslint-disable @typescript-eslint/no-explicit-any */
import Loader from '../../components/Loader';
import Container from '../../components/Container';
import SectionHeading from '../../components/SectionHeading';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
    Button,
    TextInput,
    Datepicker,
    Pagination,
} from 'flowbite-react';
import moment from 'moment';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { HiOutlineDownload, HiSearch } from 'react-icons/hi';
import { MdDateRange } from 'react-icons/md';
import { Link } from 'react-router';
import { useMemo, useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import AddProductModal from './modals/AddProductModal';
import EditProductModal from './modals/EditProductModal';
import DeleteProductModal from './modals/DeleteProductModal';
import {
    useGetAllProductsQuery,
    useLazyGetAllProductsQuery,
} from '../../redux/api/productApi';
import { exportProductsToExcel } from '../../utils/exportToExcel';

const Home = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const [triggerGetAllProducts, { isFetching: isExporting }] =
        useLazyGetAllProductsQuery();

    const dateQuery = selectedDate
        ? moment(selectedDate).format('YYYY-MM-DD')
        : undefined;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm.trim());
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: responseData, isLoading } = useGetAllProductsQuery({
        page: currentPage,
        limit,
        date: dateQuery,
        searchTerm: debouncedSearch || undefined,
    });

    const products = responseData?.data;
    const meta = responseData?.meta;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target as Node)
            ) {
                setShowDatePicker(false);
            }
        };

        if (showDatePicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDatePicker]);

    const handleDateSelect = (date: Date | null) => {
        setSelectedDate(date);
        setCurrentPage(1);
        setShowDatePicker(false);
    };

    const handleClearDate = () => {
        setSelectedDate(null);
        setCurrentPage(1);
    };

    const handleClearAllFilters = () => {
        setSelectedDate(null);
        setSearchTerm('');
        setDebouncedSearch('');
        setCurrentPage(1);
    };

    const sortedProducts = useMemo(() => {
        if (!products) return [];
        return [...products].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    }, [products]);

    const handleDownloadExcel = async () => {
        const toastId = toast.loading('Preparing full Excel report...');
        try {
            const res = await triggerGetAllProducts({
                date: dateQuery,
                searchTerm: debouncedSearch || undefined,
                limit: 0,
            }).unwrap();

            if (res?.data && res.data.length > 0) {
                const allSorted = [...res.data].sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                );
                exportProductsToExcel(allSorted, 'majesto_production_report');
                toast.success('Excel report downloaded successfully', {
                    id: toastId,
                });
            } else {
                toast.error('No products found to export', { id: toastId });
            }
        } catch (error: any) {
            toast.error(
                error?.message ||
                    error?.data ||
                    'Failed to export Excel report',
                { id: toastId },
            );
        }
    };

    const isFiltered = Boolean(selectedDate || debouncedSearch);

    return (
        <Container className="min-h-[calc(100dvh-198px)] my-10">
            <title>Majesto Production Management</title>
            <SectionHeading
                title="Production Management"
                subTitle="View and manage your manufacturing orders, production plans, and products"
                className="mb-8"
            />

            <div className="space-y-3">
                {/* Fixed Top Action Bar - Never unmounts on filter/search state changes */}
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <AddProductModal buttonText="Add Plan" />

                        {/* Date Filter Picker */}
                        <div className="relative" ref={datePickerRef}>
                            <div className="flex items-center gap-1.5">
                                <TextInput
                                    icon={MdDateRange}
                                    value={
                                        selectedDate
                                            ? moment(selectedDate).format(
                                                  'D MMMM, YYYY',
                                              )
                                            : ''
                                    }
                                    placeholder="Filter by date..."
                                    onClick={() =>
                                        setShowDatePicker((prev) => !prev)
                                    }
                                    readOnly
                                    sizing="sm"
                                    className="w-44 sm:w-48 cursor-pointer"
                                />
                                {selectedDate && (
                                    <Button
                                        size="xs"
                                        color="light"
                                        onClick={handleClearDate}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            {showDatePicker && (
                                <div className="absolute left-0 z-30 mt-1 shadow-lg rounded-lg">
                                    <Datepicker
                                        onChange={handleDateSelect}
                                        inline
                                    />
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <TextInput
                                icon={HiSearch}
                                type="text"
                                placeholder="Search Product or MO..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sizing="sm"
                                className="w-48 sm:w-60"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-bold"
                                    title="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <Button
                        size="xs"
                        onClick={handleDownloadExcel}
                        disabled={isExporting}
                        className="flex items-center"
                    >
                        <HiOutlineDownload className="mr-1.5 h-4 w-4" />
                        {isExporting ? 'Exporting...' : 'Download Excel'}
                    </Button>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <Loader />
                ) : sortedProducts && sortedProducts.length ? (
                    <>
                        <div className="overflow-x-auto rounded-md">
                            <Table className="text-xs sm:text-base" hoverable>
                                <TableHead>
                                    <TableRow>
                                        <TableHeadCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            Date
                                        </TableHeadCell>
                                        <TableHeadCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            Product Name
                                        </TableHeadCell>
                                        <TableHeadCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            Planned Quantity
                                        </TableHeadCell>
                                        <TableHeadCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            Production Quantity
                                        </TableHeadCell>
                                        <TableHeadCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            Manufacturing Order
                                        </TableHeadCell>
                                        <TableHeadCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            Details
                                        </TableHeadCell>
                                        <TableHeadCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            Actions
                                        </TableHeadCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="divide-y divide-gray-200">
                                    {sortedProducts.map((product) => (
                                        <TableRow
                                            key={product._id}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {moment(product.date).format(
                                                    'D MMM, YYYY',
                                                )}
                                            </TableCell>
                                            <TableCell className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-gray-900 dark:text-white">
                                                {product.productName}
                                            </TableCell>
                                            <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                                                {product.plannedQuantity}
                                            </TableCell>
                                            <TableCell className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-blue-600 dark:text-blue-400">
                                                {product.productionQuantity ??
                                                    0}
                                            </TableCell>
                                            <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                                                {product.manufacturingOrder}
                                            </TableCell>
                                            <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                                                <Link
                                                    to={`/product-details/${product._id}`}
                                                >
                                                    <Button
                                                        size="xs"
                                                        color="light"
                                                    >
                                                        Details
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="px-2 py-2 sm:px-4 sm:py-3 flex items-center gap-1.5">
                                                <EditProductModal
                                                    product={product}
                                                />
                                                <DeleteProductModal
                                                    product={product}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {meta && meta.totalPage > 1 && (
                            <div className="flex justify-center items-center pt-2">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={meta.totalPage}
                                    onPageChange={(page) =>
                                        setCurrentPage(page)
                                    }
                                    showIcons
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="min-h-[40dvh] rounded-lg flex flex-col justify-center items-center text-center p-8">
                        <div className="text-gray-400 mb-4">
                            <IoDocumentTextOutline size={80} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {isFiltered
                                ? 'No Products Found'
                                : 'No Products Yet'}
                        </h3>
                        <p className="max-w-125 text-gray-500 dark:text-gray-400 mb-4">
                            {isFiltered
                                ? 'No products match your current search/date filters. Try changing or clearing your filters.'
                                : "You haven't created any products yet. Start organizing your production schedule by adding your first product!"}
                        </p>
                        <div className="flex items-center gap-2">
                            {isFiltered ? (
                                <Button
                                    size="xs"
                                    color="light"
                                    onClick={handleClearAllFilters}
                                >
                                    Clear Filters
                                </Button>
                            ) : (
                                <AddProductModal buttonText="Add Plan" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Home;
