import Container from '../../components/Container';
import Footer from '../../components/ui/Footer';
import Header from '../../components/ui/Header';
import notFoundImage from '../../assets/not-found.png';
import { Link } from 'react-router';
import { Button } from 'flowbite-react';
import NormalText from '../../components/NormalText';

const ErrorPage = () => {
    return (
        <>
            <Header />
            <Container className="min-h-[calc(100dvh-198px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <img
                        src={notFoundImage}
                        alt="404 - Not found"
                        className="mx-auto sm:max-w-md"
                    />
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
