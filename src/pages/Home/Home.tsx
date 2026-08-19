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
} from 'flowbite-react';
import moment from 'moment';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { HiOutlineDownload } from 'react-icons/hi';
import { Link } from 'react-router';
import { useMemo } from 'react';
import AddProductModal from './modals/AddProductModal';
import EditProductModal from './modals/EditProductModal';
import DeleteProductModal from './modals/DeleteProductModal';
import { useGetAllProductsQuery } from '../../redux/api/productApi';
import { exportProductsToExcel } from '../../utils/exportToExcel';

const Home = () => {
    const { data: products, isLoading } = useGetAllProductsQuery();

    const sortedProducts = useMemo(() => {
        if (!products) return [];
        return [...products].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    }, [products]);

    const handleDownloadExcel = () => {
        if (sortedProducts && sortedProducts.length > 0) {
            exportProductsToExcel(sortedProducts, 'majesto_production_report');
        }
    };

    return (
        <Container className="min-h-[calc(100dvh-198px)] my-10">
            <title>Majesto Production Management</title>
            <SectionHeading
                title="Production Management"
                subTitle="View and manage your manufacturing orders, production plans, and products"
                className="mb-8"
            />
            {isLoading ? (
                <Loader />
            ) : sortedProducts && sortedProducts.length ? (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <AddProductModal buttonText="Add Plan" />
                        <Button
                            size="xs"
                            onClick={handleDownloadExcel}
                            className="flex items-center"
                        >
                            <HiOutlineDownload className="mr-1.5 h-4 w-4" />
                            Download Excel
                        </Button>
                    </div>
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
                                                'Do MMM, YYYY',
                                            )}
                                        </TableCell>
                                        <TableCell className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-gray-900 dark:text-white">
                                            {product.productName}
                                        </TableCell>
                                        <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            {product.plannedQuantity}
                                        </TableCell>
                                        <TableCell className="px-2 py-2 sm:px-4 sm:py-3 font-medium text-blue-600 dark:text-blue-400">
                                            {product.productionQuantity ?? 0}
                                        </TableCell>
                                        <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            {product.manufacturingOrder}
                                        </TableCell>
                                        <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
                                            <Link
                                                to={`/product-details/${product._id}`}
                                            >
                                                <Button size="xs" color="light">
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
                </div>
            ) : (
                <div className="min-h-[40dvh] rounded-lg flex flex-col justify-center items-center text-center p-8">
                    <div className="text-gray-400 mb-4">
                        <IoDocumentTextOutline size={80} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No Products Yet
                    </h3>
                    <p className="max-w-125 text-gray-500 dark:text-gray-400 mb-4">
                        You haven't created any products yet. Start organizing
                        your production schedule by adding your first product!
                    </p>
                    <div className="flex items-center gap-2">
                        <AddProductModal buttonText="Add Plan" />
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Home;
