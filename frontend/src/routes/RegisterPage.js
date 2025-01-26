import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username, password: password, address: address }),
            });

            if (response.ok) {
                navigate('/login');
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const getAddressFromMetaMask = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAddress(accounts[0]);
            } catch (error) {
                console.error('An error occurred:', error);
                // Handle error (e.g., show an error message to the user)
            }
        } else {
            console.error('MetaMask is not installed');
            // Handle error (e.g., show an error message to the user)
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
            <button onClick={handleRegister}>Register</button>
            <button onClick={getAddressFromMetaMask}>Get key from MetaMask</button>
        </div>
    );
};

export default RegisterPage;
