import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username, password: password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.user);
                Cookies.set('username', data.user.name);
                Cookies.set('address', data.user.address);
                //Cookies.set('username', data.user.name);
                //Cookies.set('username', data.user.name);
                console.log(Cookies.get('address'));
                setUser({ username });
                if(data.user.name == 'admin')
                    navigate('/issuer');
                else 
                    navigate('/holder');
            } else {
                console.error('Login failed');
                // Handle login failure (e.g., show an error message to the user)
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle fetch error (e.g., show an error message to the user)
        }
    };

    const metamaskConnect = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const address = accounts[0];
                const response = await fetch('http://localhost:8080/user/metamasklogin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ address: address }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser({ username });
                    navigate('/issuer');
                } else {
                    console.error('Login failed');
                    // Handle login failure (e.g., show an error message to the user)
                }
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
        <div className="login-container">
            <h2>Login</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            <button onClick={metamaskConnect}>Connect with metamask</button>
        </div>
    );
};

export default LoginPage;
