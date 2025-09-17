import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  MantineProvider,
  createTheme,
  ColorSchemeScript,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { ToastContainer } from 'react-toastify';
import { HashRouter as Router, } from 'react-router-dom'
import Login from './components/Login/login';
import { loginStore } from './stores/loginStore';
const Root = () => {
  const [colorScheme, setColorScheme] = useState('light');

  useEffect(() => {
    const stored = localStorage.getItem('mantine-color-scheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = stored || (prefersDark ? 'dark' : 'light');
    setColorScheme(resolved);
  }, []);

  const theme = createTheme({
    fontFamily: 'DM Sans, sans-serif', // 👈 Body font
    primaryColor: 'blue',
    colorScheme,
    fontSizes: {
      xs: '13px',
      sm: '15px',
      md: '17px', // ✅ Default used by <Text />
      lg: '19px',
      xl: '21px',
    },
    headings: {
      fontFamily: 'Space Grotesk, sans-serif', // 👈 Headings font
      fontWeight: '600',
      sizes: {
        h1: { fontSize: '2.5rem' },
        h2: { fontSize: '2rem' },
        h3: { fontSize: '1.5rem' },
      },
    },
    colors: {
      blue: [
        '#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7',
        '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab'
      ],
      dark: [
        '#d5d7e0', '#acaebf', '#8c8fa3', '#666980', '#4d4f66',
        '#34354a', '#2b2c3d', '#1d1e30', '#0c0d21', '#01010a'
      ]
    }
  });
  const [LoginState,setLoginState]=useState(null);
  const handleLoginSuccess = (UserData) => {
    loginStore.setLogin(UserData)
    setLoginState(UserData);
    localStorage.setItem('Login', "true");
    localStorage.setItem('UserId', UserData.id);
  }

  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider
        theme={theme}
        withGlobalStyles
        withNormalizeCSS
        defaultColorScheme={colorScheme}
      >
        <ToastContainer />

        {
          localStorage.getItem("Login") == "true" ?
            <Router>
              <App LoginState={LoginState}/>
            </Router> :
            <Login onLoginSuccess={handleLoginSuccess} />
        }

      </MantineProvider>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
