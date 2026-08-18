import { createTheme } from 'flowbite-react';

const customTheme = createTheme({
    darkMode: false,
    button: {
        base: 'flex min-w-[84px] max-w-[480px] items-center justify-center overflow-hidden rounded-lg font-bold leading-normal tracking-[0.015em] transition-all cursor-pointer',
        color: {
            primary:
                'bg-[#3c83f6] text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-4 focus:ring-blue-300',
            secondary:
                'bg-[#f0f2f5] text-[#111418] hover:bg-gray-300 active:bg-gray-400 focus:ring-4 focus:ring-gray-200',
        },
        size: {
            xs: 'h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm',
            sm: 'h-10 px-4 text-sm sm:h-12 sm:px-5 sm:text-base',
            lg: 'h-12 px-6 text-base sm:h-14 sm:px-7 sm:text-lg',
        },
    },
});

export default customTheme;
