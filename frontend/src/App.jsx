import { Provider } from 'react-redux';
import { store } from './store/store';
import LandingPage from './pages/LandingPage';
// ... other imports

function App() {
  return (
    <Provider store={store}>
      {/* Your existing app content */}
      <LandingPage />
    </Provider>
  );
}

export default App; 