import React, { useState } from 'react';
import Modal from 'react-modal';

const RegisterModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none max-h-screen overflow-auto"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="w-full max-w-md bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)] shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-cinzel text-[var(--color-text-primary)]">Register</h2>
            <button
              onClick={onRequestClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-roboto font-bold mb-1 text-[var(--color-text-secondary)]">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-roboto font-bold mb-1 text-[var(--color-text-secondary)]">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-roboto font-bold mb-1 text-[var(--color-text-secondary)]">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-roboto font-bold mb-1 text-[var(--color-text-secondary)]">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onRequestClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;
