import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LandingPage from './pages/LandingPage';
// ... other imports

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        {/* Your existing app content */}
        <LandingPage />
      </AuthProvider>
    </Provider>
  );
}

export default App; 