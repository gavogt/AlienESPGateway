import React, { useState } from 'react';
import { login } from './api';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const data = await login(email, password);
            setMessage(`Welcome back, ${data.user.name || data.user.email}!`);
            localStorage.setItem('token', data.token);
        } catch (error) {
            setMessage(error.message || 'Login failed. Please try again.');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              value={email} 
              onChange={e => 
              setEmail(e.target.value)} 
              placeholder="Email" 
              required />
            
            <input 
              type="password" 
              value={password} 
              onChange={e => 
              setPassword(e.target.value)} 
              placeholder="Password"
              required />
              
            <button type="submit">Login</button>
            {message && <p className='auth-message'>{message}</p>}
        </form>
    )
}