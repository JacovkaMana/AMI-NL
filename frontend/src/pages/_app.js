import { CharacterProvider } from '../contexts/CharacterContext';

function MyApp({ Component, pageProps }) {
  return (
    <CharacterProvider>
      <Component {...pageProps} />
    </CharacterProvider>
  );
}

export default MyApp; 