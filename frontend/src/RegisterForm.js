import React, { useState } from 'react';
import { register } from './api';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState(''); 

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const data = await register({ email, password, firstName, lastName });
            setMessage(`Account created for ${data.email}. You can now log in.`);
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Create Account</h2>
            <input 
            type='text'
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            />
            <input 
            type='text'
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            />
            <input
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e)}
            required
            />
            <input 
            type="password"
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
            <button type="submit">Register</button>
            {message && <div className="message">{message}</div>}
        </form>
    );
}