import React, { useState, useEffect } from 'react';
import './IssuerPage.css';

const IssuerPage = () => {
    const [document, setDocument] = useState({
        name: '',
        issueDate: '',
        expiryDate: '',
        serialNumber: '',
        details: '',
        image: null,
        imagePreview: null,
        account: ''
    });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch the users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/user/users');
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocument(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setDocument(prevState => ({
            ...prevState,
            image: file,
            imagePreview: URL.createObjectURL(file)
        }));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('image', document.image);
        formData.append('attributes', JSON.stringify({
            name: document.name,
            issueDate: document.issueDate,
            expiryDate: document.expiryDate,
            serialNumber: document.serialNumber,
            details: document.details,
            account: document.account
        }));
        //console.log(document.account);
        try {
            const response = await fetch('http://localhost:8080/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Document uploaded successfully');
                // Handle success response
            } else {
                console.error('Upload failed');
                // Handle failure response
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle error
        }
    };

    return (
        <div className="issuer-container">
            <h2>Emitator</h2>
            <input type="text" name="name" value={document.name} onChange={handleChange} placeholder="Nume" />
            <input type="date" name="issueDate" value={document.issueDate} onChange={handleChange} placeholder="Data Emitere" />
            <input type="date" name="expiryDate" value={document.expiryDate} onChange={handleChange} placeholder="Data Expirare" />
            <input type="text" name="serialNumber" value={document.serialNumber} onChange={handleChange} placeholder="Seria Documentului" />
            <textarea name="details" value={document.details} onChange={handleChange} placeholder="Detalii"></textarea>
            <select name="account" value={document.account} onChange={handleChange}>
                <option value="">Select User</option>
                {users.map(user => (
                    <option key={user.address} value={user.address}>{user.name}</option>
                ))}
            </select>
            <input type="file" onChange={handleImageChange} />
            {document.imagePreview && <img src={document.imagePreview} alt="Preview" className="image-preview" />}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default IssuerPage;
