import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import authService from '../../services/authService';

function RegisterButton() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.register(email, password);
      // Auto-login after successful registration
      const userData = await authService.login(email, password);
      dispatch(login(userData));
      setShowModal(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Register
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default RegisterButton; 