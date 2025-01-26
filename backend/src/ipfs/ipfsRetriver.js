const axios = require('axios');

const retrieveFromIPFS = async (ipfsHash) => {
    try {
        const url = `https://coral-casual-gecko-602.mypinata.cloud/ipfs/${ipfsHash}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error retrieving data from IPFS:', error);
        return null;
    }
};

const retrieveFileFromIPFS = async (ipfsHash) => {
    try {
        const url = `https://coral-casual-gecko-602.mypinata.cloud/ipfs/${ipfsHash}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error('Error retrieving file from IPFS:', error);
        return null;
    }
};

module.exports = {
    retrieveFromIPFS,
    retrieveFileFromIPFS
};
