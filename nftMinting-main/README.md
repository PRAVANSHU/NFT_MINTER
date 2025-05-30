# NFT Minter Application

This is a full-stack application for minting NFTs using the Starton API. It consists of a React frontend and an Express backend.

## Project Structure

- `client/`: React frontend built with Vite
- `api/`: Express backend that handles file uploads and NFT minting

## Local Development

### Backend (API)

```bash
cd api
npm install
npm start
```

The API server will run on http://localhost:5000.

### Frontend (Client)

```bash
cd client
npm install
npm run dev
```

The React development server will run on http://localhost:5173.

## Deployment on Render

This project is configured for deployment on Render using the `render.yaml` file.

### Steps to Deploy

1. Create a Render account at https://render.com

2. Install the Render CLI:
   ```bash
   npm install -g @render/cli
   ```

3. Log in to Render:
   ```bash
   render login
   ```

4. Deploy the application:
   ```bash
   render blueprint apply
   ```

5. Alternatively, you can deploy manually:

   a. Create a new Web Service for the API:
      - Connect to your repository
      - Set the Build Command: `cd api && npm install`
      - Set the Start Command: `cd api && npm start`
      - Set the environment variable `PORT` to `10000`

   b. Create a new Static Site for the client:
      - Connect to your repository 
      - Set the Build Command: `cd client && npm install && npm run build`
      - Set the Publish Directory: `client/dist`
      - Set the environment variable `VITE_API_URL` to the URL of your API service

### Important Notes

- Make sure to update the Starton API key in `api/server.js` with your own key
- Update the smart contract details in the `mintNFT` function in `api/server.js` to match your own smart contract configuration
- You may need to adjust CORS settings based on your specific domain names on Render

## Features

- Upload images to mint as NFTs
- Store images on IPFS via Starton
- Mint NFTs on Ethereum (Sepolia testnet)
