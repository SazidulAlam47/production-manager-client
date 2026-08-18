import { createBrowserRouter } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import ErrorPage from '../pages/ErrorPage/ErrorPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: '/products',
                element: <Home />,
            },
            {
                path: '/product-details/:productId',
                element: <ProductDetails />,
            },
            {
                path: '/products/:productId',
                element: <ProductDetails />,
            },
        ],
    },
]);

export default router;
