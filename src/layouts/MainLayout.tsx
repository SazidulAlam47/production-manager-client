import { Outlet } from 'react-router';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
