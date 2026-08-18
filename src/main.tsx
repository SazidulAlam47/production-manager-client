import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './routes/routes';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from 'flowbite-react';
import customTheme from './theme/customTheme';
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={customTheme}>
                <RouterProvider router={router} />
                <Toaster position="top-center" />
            </ThemeProvider>
        </Provider>
    </StrictMode>
);
