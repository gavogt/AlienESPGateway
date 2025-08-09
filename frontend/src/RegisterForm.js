import React, { useState } from 'react';
import logo from './assets/logo.png';
import { register } from './api';
import './RegisterForm.css';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await register({ email, password, firstName, lastName });
      setMessage(`Account created for ${data.email}. You can now log in.`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join the gateway and sync across the cosmos.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <h3>Create Account</h3>

          <div className="auth-grid">
            <div className="field">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="field">
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="field">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-button">Register</button>

          {message && <div className="auth-message">{message}</div>}
        </form>
      </div>
    </div>
  );
}