
const ipfsLoader = require('../ipfs/ipfsLoader');
const ipfsRetriver = require('../ipfs/ipfsRetriver');
const ethService = require('../services/ethService')

const uploadToIpfs = async (path, attributes) => {
    var metadataKey = await ipfsLoader.pinMetaDataToIPFS(path, attributes)
    console.log('User account check',attributes.account );
    await ethService.mintNFT(attributes.account, metadataKey);
    console.log("Metadata Key:", metadataKey);
    
    return metadataKey; 
}

const getAttributes = async (hash) => {
    var data = await ipfsRetriver.retrieveFromIPFS(hash);
    if (data.attributes)
        return data.attributes;
}

const getImgHash = async (hash) => {
    var data = await ipfsRetriver.retrieveFromIPFS(hash);
    if (data.imageURI)
        return data.imageURI;
}
const getImage = async (hash) => {
    //var data = await ipfsRetriver.retrieveFromIPFS(hash);
    var imageHash = hash.substring(7);
    console.log(imageHash);
    return await ipfsRetriver.retrieveFileFromIPFS(imageHash);
}

module.exports = {uploadToIpfs, getAttributes, getImage, getImgHash};
