import { createTheme } from '@mui/material/styles';
import { faIR } from '@mui/material/locale';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
    h1: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
    },
    subtitle2: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
    },
    body1: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
    },
    body2: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
    },
    button: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
      fontWeight: 500,
    },
    caption: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
    },
    overline: {
      fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Vazir';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Vazir'), local('Vazir-Regular'),
               url('https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.woff2') format('woff2');
        }
        
        * {
          font-family: 'Vazir, IRANSans, Tahoma, Arial, sans-serif' !important;
        }
        
        body {
          font-family: 'Vazir, IRANSans, Tahoma, Arial, sans-serif';
          direction: rtl;
        }

        /* تنظیمات اضافی برای المان‌های خاص */
        .MuiTypography-root {
          font-family: 'Vazir, IRANSans, Tahoma, Arial, sans-serif' !important;
        }
        
        .MuiButton-root {
          font-family: 'Vazir, IRANSans, Tahoma, Arial, sans-serif' !important;
        }
        
        .MuiInputBase-root {
          font-family: 'Vazir, IRANSans, Tahoma, Arial, sans-serif' !important;
        }
      `,
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
          fontWeight: 500,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: 'Vazir, IRANSans, Tahoma, Arial, sans-serif',
        },
      },
    },
  },
}, faIR); // اضافه کردن تنظیمات لوکال فارسی

export default theme;