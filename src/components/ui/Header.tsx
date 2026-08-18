import {
    Navbar,
    NavbarCollapse,
    NavbarToggle,
} from 'flowbite-react';
import Container from '../Container';
import logo from '../../assets/logo.png';
import { Link, useLocation } from 'react-router';
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
        <>
            <Container asChild>
                <Navbar className="border-0 py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src={logo}
                            className="mr-3 h-10"
                            alt="Production Manager Logo"
                        />
                        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                            Production Manager
                        </span>
                    </Link>
                    <div className="flex md:order-2 gap-2 items-center">
                        <NavbarToggle />
                    </div>
                    <NavbarCollapse>
                        {headerLinks.map((headerLink, index) => (
                            <Link
                                key={index}
                                to={headerLink.path}
                                className={cn(
                                    'block py-2 pl-3 pr-4 md:p-0 hover:text-primary-700 transition-all font-medium',
                                    {
                                        'text-primary-700':
                                            location.pathname ===
                                            headerLink.path,
                                    },
                                )}
                            >
                                {headerLink.title}
                            </Link>
                        ))}
                    </NavbarCollapse>
                </Navbar>
            </Container>
            <hr className="text-gray-200" />
        </>
    );
};

export default Header;
