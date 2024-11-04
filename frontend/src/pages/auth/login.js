import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      router.push('/characters');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-8 px-4">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border)] p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-cinzel text-[var(--color-text-primary)] border-b-2 border-[var(--color-border)] pb-2">
              Login
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center text-sm text-[var(--color-text-secondary)]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/auth/register')}
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                Register here
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Login; 