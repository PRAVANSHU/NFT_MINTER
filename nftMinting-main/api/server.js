const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 1000000, // Limit file size to 1MB
  },
});

// Initialize Starton API client
const starton = axios.create({
  baseURL: 'https://api.starton.io/v3',
  headers: {
    'x-api-key': 'sk_live_19e6d7f4-4698-411e-8547-8a75bd51b119', // Replace with your Starton API key
  },
});

// Endpoint to handle file uploads
app.post('/upload', cors(), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Step 1: Upload the image to IPFS
    const ipfsImgData = await uploadImageOnIpfs(req.file);

    // Step 2: Upload metadata to IPFS
    const ipfsMetadata = await uploadMetadataOnIpfs(ipfsImgData.cid);

    // Step 3: Mint NFT using the metadata CID
    const nft = await mintNFT(ipfsMetadata.cid);

    // Return the transaction hash and image CID to the frontend
    res.status(201).json({
      transactionHash: nft.transactionHash,
      cid: ipfsImgData.cid,
    });
  } catch (error) {
    console.error('Error in /upload endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to upload image to IPFS
async function uploadImageOnIpfs(file) {
  const formData = new FormData();
  const blob = new Blob([file.buffer], { type: file.mimetype });
  formData.append('file', blob, { filename: file.originalname });
  formData.append('isSync', 'true');

  const response = await starton.post('/ipfs/file', formData, {
    headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` },
  });

  return response.data;
}

// Function to upload metadata to IPFS
async function uploadMetadataOnIpfs(imgCid) {
  const metadataJson = {
    name: "A Wonderful NFT",
    description: "Probably the most awesome NFT ever created!",
    image: `ipfs://${imgCid}`, // Use ipfs:// protocol
    attributes: [], // Add attributes if needed
  };

  const ipfsMetadata = await starton.post('/ipfs/json', {
    name: "My NFT metadata Json",
    content: metadataJson,
    isSync: true,
  });

  return ipfsMetadata.data;
}

// Function to mint NFT
async function mintNFT(metadataCid) {
  const SMART_CONTRACT_NETWORK = 'ethereum-sepolia'; // Replace with your network
  const SMART_CONTRACT_ADDRESS = '0x664edD9ec279C7aD4057CDAf7F4e6DC3d164dDC0'; // Replace with your contract address
  const WALLET_IMPORTED_ON_STARTON = '0xcf365bf837ca3a4D9629bc2Fe44eBB90A2287942'; // Replace with your wallet address
  const RECEIVER_ADDRESS = '0xF378fC66C6D50D49B9C98220B8d80744B7fa6d76'; // Replace with the receiver's address

  const response = await starton.post(
    `/smart-contract/${SMART_CONTRACT_NETWORK}/${SMART_CONTRACT_ADDRESS}/call`,
    {
      functionName: 'mint',
      signerWallet: WALLET_IMPORTED_ON_STARTON,
      speed: 'low',
      params: [RECEIVER_ADDRESS, metadataCid],
    }
  );

  return response.data;
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});