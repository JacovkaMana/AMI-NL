import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { CharacterProvider } from '../contexts/CharacterContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CharacterProvider>
          <Component {...pageProps} />
        </CharacterProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
