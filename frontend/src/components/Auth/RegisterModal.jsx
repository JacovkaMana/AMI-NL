import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import authService from '../../services/authService';

function RegisterModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(email, password);
      const userData = await authService.login(email, password);
      dispatch(login(userData));
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay dark:bg-gray-800/90">
      <div className="modal-content dark:bg-gray-700">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal; 