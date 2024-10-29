import React, { useState } from 'react';
import Modal from 'react-modal';

const LoginModal = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle login
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="p-6 bg-beige rounded-md max-w-md w-full mx-auto">
      <h2 className="text-2xl font-cinzel text-green mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-slate-gray/20 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-slate-gray/20 focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button type="submit" className="w-full bg-gold text-slate-gray px-4 py-2 rounded hover:bg-amber-500 transition-colors">
          Login
        </button>
      </form>
    </Modal>
  );
};

export default LoginModal;
