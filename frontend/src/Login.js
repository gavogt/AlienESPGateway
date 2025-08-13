import React, { useState } from 'react';
import { login } from './api';
import logo from './assets/logo.png';
import './AuthForm.css';
import { Session } from './SessionState';
import { useNavigate } from 'react-router-dom';

export default function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const data = await login(email, password);

            Session.set({
             firstname: data.user.firstName,
             lastname: data.user.lastName,
             email: data.user.email,
             token: data.token
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            navigate('/dashboard');

        } catch (error) {
            setMessage(error.message || 'Login failed. Please try again.');
        }
    }

    return (
        <div className="auth-wrap">
            <div className="auth-card">
                <img src={logo} alt="Logo" className="auth-logo" />
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Log in to your account to continue.</p>
                <form onSubmit={handleSubmit}>
                    <div className='auth-grid'>
                        <div className='field'>
                            <input 
                            type="email" 
                            value={email} 
                            onChange={e => 
                            setEmail(e.target.value)} 
                            placeholder="Email" 
                            required />
                        </div>
                        <div className='field'>
                            <input 
                            type="password" 
                            value={password} 
                            onChange={e => 
                            setPassword(e.target.value)} 
                            placeholder="Password"
                            required />
                        </div>
                    </div>
                    <button type="submit" className='auth-button'>Login</button>
                    {message && <p className='auth-message'>{message}</p>}
                </form>
                <div className="auth-links">
                    <a href="/register">Create an account</a>
                </div>
            </div>
        </div>
    )
}