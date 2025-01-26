import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './InstitutionsPage.css';

const InstitutionsPage = () => {
    const [username, setUsername] = useState('');
    const [account, setAccount] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedTokenId, setSelectedTokenId] = useState('');
    const [approvals, setApprovals] = useState([]);
    const [docImage, setDocImage] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Fetch the list of approvals when the component mounts
        const fetchApprovals = async () => {
            try {
                const response = await fetch('http://localhost:8080/eth/getAskedApprovals', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ requester: Cookies.get('address') }),
                });
                const data = await response.json();
                setApprovals(data);
            } catch (error) {
                console.error('Error fetching approvals:', error);
            }
        };

        fetchApprovals();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:8080/user/getAccountForUsername', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username }),
            });
            const data = await response.json();
            console.log(data.address);
            setAccount(data.address);

            // Make the second fetch call after the account has been set
            if (data.address) {
                const nftResponse = await fetch('http://localhost:8080/eth/safe/nfts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ owner: data.address }),
                });
                const docData = await nftResponse.json();
                setDocuments(docData);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
        console.log("test");
    };

    const handleRequest = async (id, requestType) => {
        var reqType;
        if (requestType === "image") reqType = 1;
        else reqType = 2;
        try {
            await fetch('http://localhost:8080/eth/request-approval', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requester: Cookies.get('address'), tokenId: id, type: reqType }),
            });
        } catch (error) {
            console.error('Error requesting approval:', error);
        }
        console.log(`Document ${id} requested for ${requestType}`);
    };

    const handleViewDocument = async (hash, id, status) => {
        setSelectedTokenId(id);
        setApprovalStatus(status);
        try {
            let data;
            if (status === 3) {
                // Fetch image
                const imageResponse = await fetch(`http://localhost:8080/getImagefromDocHash`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ hash: hash }),
                });

                if (imageResponse.ok) {
                    const blob = await imageResponse.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    setDocImage(imageUrl);
                }
            } else if (status === 4) {
                // Fetch attributes
                const response = await fetch('http://localhost:8080/getAttributes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ hash: hash }),
                });
                data = await response.json();
                setSelectedDocument(data.retVal);
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
        setShowModal(true);
    };

    const closeModal = async () => {
        try {
            const response = await fetch('http://localhost:8080/eth/consume-approval', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requester: Cookies.get('address'), tokenId: selectedTokenId })
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error consuming approval:', error);
        }

        setShowModal(false);
        setSelectedDocument(null);
        setApprovalStatus(null);
    };

    return (
        <div className='over-institutions'>
        <div className="institutions-container">
            <h2>Institutions Request Page</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {documents.map(doc => (
                    <li key={doc.id}>
                        {doc.name}
                        <div className="button-group">
                            <button className="request-button" onClick={() => handleRequest(doc.id, 'information')}>Request Information</button>
                            <button className="request-button" onClick={() => handleRequest(doc.id, 'image')}>Request Image</button>
                        </div>
                    </li>
                ))}
            </ul>
            <h2>Requested Approvals</h2>
            <ul>
                {approvals.map(approval => (
                    <li key={approval.hash}>
                        {approval.docName} - {approval.username}
                        {approval.status === 1 || approval.status === 2 ? (
                            <span>Pending Approval</span>
                        ) : (
                            <button className='view-button' onClick={() => handleViewDocument(approval.hash, approval.tokenId, approval.status)}>View</button>
                        )}
                    </li>
                ))}
            </ul>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        {approvalStatus === 3 ? (
                            <img src={docImage} alt="Document" className="document-image" />
                        ) : approvalStatus === 4 ? (
                            <>
                                <h2>{selectedDocument.name}</h2>
                                <p>Issue Date: {selectedDocument.issueDate}</p>
                                <p>Expiry Date: {selectedDocument.expiryDate}</p>
                                <p>Serial Number: {selectedDocument.serialNumber}</p>
                                <p>Details: {selectedDocument.details}</p>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default InstitutionsPage;
