import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './HolderPage.css';

const HolderPage = () => {
    const [documents, setDocuments] = useState([]);
    const [expandedDoc, setExpandedDoc] = useState(null);
    const [docImage, setDocImage] = useState(null);
    const [approvals, setApprovals] = useState([]);

    useEffect(() => {
        // Fetch the initial documents
        const fetchDocuments = async () => {
            var address = Cookies.get('address');
            try {
                const response = await fetch('http://localhost:8080/eth/nfts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ owner: address }),
                });
                const data = await response.json();
                setDocuments(data);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []);

    const handleExpand = async (doc) => {
        if (expandedDoc === doc.imageURI) {
            setExpandedDoc(null);
            setDocImage(null);
            setApprovals([]);
            console.log("--------------------")
        } else {
            console.log('tttttt');
            setExpandedDoc(doc.imageURI);
            try {
                // Fetch the document image
                const imageResponse = await fetch(`http://localhost:8080/getImage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ hash: doc.imageURI }),
                });

                if (imageResponse.ok) {
                    const blob = await imageResponse.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    setDocImage(imageUrl);
                }
                // Fetch the approvals for the document
                const approvalsResponse = await fetch(`http://localhost:8080/eth/pending-approvals`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tokenId: 0 }),
                });
                const approvalsData = await approvalsResponse.json();
                setApprovals(approvalsData);
            } catch (error) {
                console.error('Error fetching document details:', error);
            }
        }
    };

    const handleApprove = async (tonkenId, requester) => {

        console.log(`Document ${tonkenId} approved ${requester}`);
        try {
            await fetch(`http://localhost:8080/eth/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requester: requester, tokenId: tonkenId }),

            });
            console.log("Approved");
            const approvalsResponse = await fetch(`http://localhost:8080/eth/pending-approvals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tokenId: 0 }),
            });
            const approvalsData = await approvalsResponse.json();
            setApprovals(approvalsData);
        } catch (error) {
            console.error('Error approving document:', error);
        }
    };

    return (
        <div className = "over-holder">
        <div className="holder-container">
            <h2>Holder's Documents</h2>
            <ul>
                {documents.map(doc => (
                    <li key={doc.tokenId}>
                        <div onClick={() => handleExpand(doc)}>
                            {doc.attributes.name} was viewed for {doc.viewCount} times. Last view time: {doc.timestamp}
                        </div>
                        {expandedDoc === doc.imageURI && (
                            <div className="document-details">
                                <p>Issue Date: {doc.attributes.issueDate}</p>
                                <p>Expire Date: {doc.attributes.expiryDate}</p>
                                <p>Serial Number: {doc.attributes.serialNumber}</p>
                                <p>Description: {doc.attributes.details}</p>
                                {docImage && <img src={docImage} alt={doc.name} />}
                                <ul className="approvals-list">
                                    {approvals.map(approval => (
                                        <li key={approval.name}>
                                            {approval.approvalType === 1 ? (
                                                <span>{approval.name} requests to see image</span>
                                            ) : (
                                                <span>{approval.name} requests to see information</span>
                                            )}
                                            <button onClick={() => handleApprove(doc.tokenId, approval.name)}>Approve</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default HolderPage;
