const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const jsonUtils = require('./jsonUtils.js');
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzM2Y4N2ZmYS00MGE1LTQ4MzgtOTVjNi0zZWM4MGE0ZGMwM2UiLCJlbWFpbCI6ImNvc21pbmNhbmRyZWExQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1NDEwNmNmN2NlZDdlYTA3MzI4NSIsInNjb3BlZEtleVNlY3JldCI6ImQwMTRkMTlkMThhNzM1NWZiMDk1YjE4YTAyOTUyMjc4Y2JjOTIwYzBiNmEzODc5NGUzYzJhZmNjNjY1NTkwYjYiLCJpYXQiOjE3MTI2ODEzMzh9.Lh2mh6Hs73pQZvlJlGWuxEoKaVGZqHAPGzvGV6dHL8M';

const pinFileToIPFS = async (src) => {
  const formData = new FormData();
  const file = fs.createReadStream(src);
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({ name: 'File name' });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({ cidVersion: 0 });
  formData.append('pinataOptions', pinataOptions);

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Authorization': `Bearer ${JWT}`
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    return null;
  }
};

const pinMetaDataToIPFS = async (src, attributes) => {
  try {
      const imageinfo = await pinFileToIPFS(src);
      if (!imageinfo) {
          throw new Error('Failed to pin file to IPFS');
      }

      const data = {
          imageURI: "ipfs://" + imageinfo.IpfsHash,
          attributes: attributes
      };

      const jsonPath = await jsonUtils.createJsonFile(data);
      console.log(jsonPath);

      const formData = new FormData();
      const file = fs.createReadStream(jsonPath);
      formData.append('file', file);

      const pinataMetadata = JSON.stringify({ name: 'Document' });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataOptions = JSON.stringify({ cidVersion: 0 });
      formData.append('pinataOptions', pinataOptions);

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxBodyLength: "Infinity",
          headers: {
              'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
              'Authorization': `Bearer ${JWT}`
          }
      });

      console.log(res.data);
      return res.data.IpfsHash;
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
};


module.exports = {pinMetaDataToIPFS};
