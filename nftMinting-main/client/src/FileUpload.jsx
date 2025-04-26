import { useState } from "react";
import './FileUpload.css';

const FileUpload = ({ addMintedImage }) => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [fileName, setFileName] = useState("");
  
  // Get API URL from environment variable or default to localhost for development
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        }).then(response => response.json())
          .then(data => {
            setCid(data.cid);
            addMintedImage(data.cid);
            console.log(`Image IPFS Link: https://${data.cid}.ipfs.dweb.link`);
          })
          .catch(error => {
            console.error(error);
          });
      }
    } catch (error) {
      alert(error);
    }
  };

  const retrieveFile = (event) => {
    try {
      const data = event.target.files[0];
      setFile(data);
      setFileName(data.name);
      event.preventDefault();
    } catch (error) {
      alert("Failed to retrieve file");
    }
  };

  return (
    <>
      <div className="img-ctr">
        {cid && <a href={`https://${cid}.ipfs.dweb.link`}><img src={`https://${cid}.ipfs.dweb.link`} height={"250px"} alt="Minted NFT" /></a>}
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label className="file-label">
            Choose File
            <input type="file" className="input-file" onChange={retrieveFile} />
          </label>
          {fileName && <p className="file-name">Selected File: {fileName}</p>}
          <button className="button" type="submit">Mint NFT</button>
        </form>
      </div>
    </>
  );
};

export default FileUpload;