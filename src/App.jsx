import React, { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext'; // اضافه شده
import { useTheme } from './context/ThemeContext'; // اضافه شده
import AppRoutes from './routes';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { faIR } from '@mui/material/locale';
import './assets/styles/fonts.css';

// RTL تنظیمات
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// کامپوننت اصلی با تم
function AppWithTheme() {
  const { darkMode } = useTheme();

  const theme = useMemo(
    () =>
      createTheme({
        direction: 'rtl',
        typography: {
          fontFamily: 'Vazir, IRANSans, Arial, sans-serif',
          fontSize: 14,
          // ... بقیه تنظیمات typography
        },
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
          },
          secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
          },
          error: {
            main: '#d32f2f',
          },
          warning: {
            main: '#ed6c02',
          },
          info: {
            main: '#0288d1',
          },
          success: {
            main: '#2e7d32',
          },
          background: darkMode ? {
            default: '#1a1a1a',
            paper: '#242424',
          } : {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: darkMode ? {
            primary: '#ffffff',
            secondary: '#9e9e9e',
          } : {
            primary: '#172B4D',
            secondary: '#6B778C',
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
                     url('/fonts/Vazir.woff2') format('woff2');
              }

              @font-face {
                font-family: 'IRANSans';
                font-style: normal;
                font-display: swap;
                font-weight: 400;
                src: local('IRANSans'), local('IRANSans-Regular'),
                     url('/fonts/IRANSans.woff2') format('woff2');
              }

              * {
                font-family: 'Vazir', 'IRANSans', Arial, sans-serif !important;
              }

              body {
                font-family: 'Vazir', 'IRANSans', Arial, sans-serif !important;
                direction: rtl;
                margin: 0;
                padding: 0;
                transition: background-color 0.3s ease;
              }

              // Override Material-UI components
              .MuiTypography-root,
              .MuiButton-root,
              .MuiInputBase-root,
              .MuiMenuItem-root,
              .MuiAlert-root,
              .MuiChip-root,
              .MuiTableCell-root,
              .MuiTab-root,
              .MuiAccordionSummary-root,
              .MuiListItemText-root,
              .MuiInputLabel-root {
                font-family: 'Vazir', 'IRANSans', Arial, sans-serif !important;
              }
            `,
          },
          MuiButton: {
            styleOverrides: {
              root: {
                fontWeight: 500,
                borderRadius: 8,
                textTransform: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: darkMode 
                  ? '0 2px 12px rgba(0,0,0,0.3)'
                  : '0 2px 12px rgba(0,0,0,0.08)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 16,
              },
            },
          },
        },
      }, faIR),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// کامپوننت اصلی
const App = () => {
  return (
    <CacheProvider value={cacheRtl}>
      <CustomThemeProvider>
        <AppWithTheme />
      </CustomThemeProvider>
    </CacheProvider>
  );
};

export default App;