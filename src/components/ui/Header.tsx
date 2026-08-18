import { Link } from 'react-router';
import Container from '../Container';
import logoImage from '../../assets/Majesto.webp';

const Header = () => {
    return (
        <header className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
            <Container className="py-4 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                >
                    <img
                        src={logoImage}
                        alt="Majesto Logo"
                        className="h-4 w-auto"
                    />
                </Link>

                <nav className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
                    >
                        <span className="text-md font-bold tracking-tight text-gray-600">
                            Production Management
                        </span>
                    </Link>
                </nav>
            </Container>
        </header>
    );
};

export default Header;
