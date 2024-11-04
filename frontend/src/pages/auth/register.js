import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.username);
      router.push('/characters');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
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
              Register
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

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
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-roboto mb-1 text-[var(--color-text-primary)]">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                required
                minLength={6}
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
              {isSubmitting ? 'Creating Account...' : 'Register'}
            </button>

            <div className="text-center text-sm text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                Login here
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register; 