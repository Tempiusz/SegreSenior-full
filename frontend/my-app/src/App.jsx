import { useState } from 'react';

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
      await fetch('http://localhost:8000/działa', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Błąd przy wysyłaniu pliku:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gdzie mam wyrzucić śmiecia?</h1>

      <input
        type="file"
        accept=".png"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Gdzie mam wyrzucić?
      </button>
    </div>
  );
}

export default App;
