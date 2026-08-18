import { Link, useLocation } from 'react-router';
import Container from '../Container';
import { cn } from '../../utils/cn';

const headerLinks = [
    {
        path: '/',
        title: 'Products',
    },
];

const Header = () => {
    const location = useLocation();

    return (
        <header className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
            <Container className="py-4 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:opacity-90 transition-opacity"
                >
                    Majesto Production Management
                </Link>

                <nav className="flex items-center gap-6">
                    {headerLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white',
                                location.pathname === link.path
                                    ? 'text-gray-900 dark:text-white font-semibold'
                                    : 'text-gray-500 dark:text-gray-400',
                            )}
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>
            </Container>
        </header>
    );
};

export default Header;
