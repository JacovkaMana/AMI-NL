import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, setUser } from '../../store/authSlice';
import authService from '../../services/authService';

function AccountStatus() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getMe();
        dispatch(setUser(userData));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center space-x-4 dark:text-white">
      <span>{user?.email}</span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

export default AccountStatus; 