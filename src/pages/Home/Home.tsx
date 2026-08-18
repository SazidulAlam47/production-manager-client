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
} from 'flowbite-react';
import moment from 'moment';
import { IoDocumentTextOutline } from 'react-icons/io5';
import AddProductModal from './modals/AddProductModal';
import EditProductModal from './modals/EditProductModal';
import DeleteProductModal from './modals/DeleteProductModal';
import { useGetAllProductsQuery } from '../../redux/api/productApi';

const Home = () => {
    const { data: products, isLoading } = useGetAllProductsQuery();

    return (
        <Container className="min-h-[calc(100dvh-198px)] my-10">
            <title>Production Management - Products</title>
            <SectionHeading
                title="Production Management"
                subTitle="View and manage your manufacturing orders, production plans, and products"
                className="mb-8"
            />
            {isLoading ? (
                <Loader />
            ) : products && products.length ? (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <AddProductModal buttonText="Add Product" />
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
                                        Actions
                                    </TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <TableRow
                                        key={product._id}
                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <TableCell className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {moment(product.date).format(
                                                'Do MMM, YYYY',
                                            )}
                                        </TableCell>
                                        <TableCell className="px-2 py-2 sm:px-4 sm:py-3">
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
                        <AddProductModal buttonText="Add Product" />
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Home;
