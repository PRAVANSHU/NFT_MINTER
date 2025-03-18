import FileUpload from './FileUpload';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [mintedImages, setMintedImages] = useState([]);

  // Load minted images from local storage on component mount
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('mintedImages')) || [];
    setMintedImages(storedImages);
  }, []);

  // Add a new minted image to the list and update local storage
  const addMintedImage = (cid) => {
    const newImage = `https://${cid}.ipfs.dweb.link`;
    setMintedImages((prevImages) => {
      const updatedImages = [newImage, ...prevImages];
      localStorage.setItem('mintedImages', JSON.stringify(updatedImages));
      return updatedImages;
    });
  };

  return (
    <div className="App">
      <h1>NFT Minter</h1>
      <div className="container">
        <FileUpload addMintedImage={addMintedImage} />
      </div>
      <div className="gallery">
        {mintedImages.map((image, index) => (
          <a key={index} href={image} target="_blank" rel="noopener noreferrer">
            <img src={image} alt={`Minted NFT ${index}`} height="150" />
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;