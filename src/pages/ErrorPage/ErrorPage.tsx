import Container from '../../components/Container';
import Footer from '../../components/ui/Footer';
import Header from '../../components/ui/Header';
import { Link } from 'react-router';
import { Button } from 'flowbite-react';
import NormalText from '../../components/NormalText';

const ErrorPage = () => {
    return (
        <>
            <Header />
            <Container className="min-h-[calc(100dvh-198px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
                    <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 dark:text-white">
                        404
                    </h1>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                        Page Not Found
                    </h2>
                    <NormalText>
                        We couldn't find the page you're looking for.
                    </NormalText>
                    <Link to="/">
                        <Button>Go to Home</Button>
                    </Link>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default ErrorPage;
