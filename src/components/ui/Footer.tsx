import Container from '../Container';

const Footer = () => {
    return (
        <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
            <Container className="py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <p>Majesto Production Management</p>
                <p>
                    &copy; {new Date().getFullYear()} All rights reserved by
                    Majesto.
                </p>
            </Container>
        </footer>
    );
};

export default Footer;
