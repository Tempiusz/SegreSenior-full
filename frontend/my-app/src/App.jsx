import { useState } from 'react';
import './style.css'

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch('http://localhost:8000/upload-image/', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Błąd przy wysyłaniu pliku:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Gdzie mam wyrzucić śmiecia?</h1>

      <input
        type="file"
        accept=".png"
        onChange={handleFileChange}
        className="file-input"
      />

      <button
        onClick={handleUpload}
        className="submit-button"
      >
        Gdzie mam wyrzucić?
      </button>
    </div>
  );
}

export default App;
