'use client'

import React, { useState } from 'react';

const RegisterPage = (): React.ReactNode => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your registration logic here
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} onSubmit={handleSubmit}>
                <h1 style={{ textAlign: 'center' }}>Register</h1>
                <div style={{ marginBottom: '10px' }}>
                    <label>Username:</label>
                    <input type="username" value={username} onChange={handleUsernameChange} style={{ width: '100%', padding: '5px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={handleEmailChange} style={{ width: '100%', padding: '5px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} style={{ width: '100%', padding: '5px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
