import React, { useState , useRef} from 'react';
import axios from 'axios';
import {GrUploadOption} from "react-icons/gr";
import {TiTick} from "react-icons/ti"
import "./App.css"
function App() {
  const inputRef=useRef(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(false);
  const [received, setReceived] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(document.getElementById('fileInput').value)
  };

  const handleClick = () =>{
    inputRef.current.click()
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    axios.post('http://localhost:4000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      setMessage(response.data.success);
      setReceived(true)
    }).catch((error) => {
      console.error(error);
      setMessage('Error uploading file to API');
    });
  };

  return (
    <div className='appForm'>
      {
        message===true ? (
          <div className='output'>
              <div className='green' id='thanks'>
                  Thank You!
            </div>
            <div>
              <TiTick className='green'/> File Successfully Uploaded.
          </div>
          <div>
            Your records will be processed shortly.
          </div>
          </div>
        ):(
          <div>
            {
              received ? (
                <div id='notUploaded'>
                  File not uploaded please try again later
                  </div>
              ):(
                <div>
                  <form onSubmit={handleSubmit}>
        <GrUploadOption onClick={handleClick} id="uploadSvg"/>
        <div id='fileName'>
            {fileName.slice(12,-1)}
        </div>
        <input type="file" onChange={handleChange} ref={inputRef} id='fileInput' value={fileName}/>
        <button type="submit" id='submitButton' onClick={handleSubmit}>Submit</button>
      </form>
                  </div>
              )
            }
            </div>
        )
      }
    </div>
  );
}

export default App;
