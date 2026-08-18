import { Outlet } from 'react-router';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default MainLayout;
