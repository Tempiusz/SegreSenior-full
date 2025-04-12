import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
    <div className="ml-auto min-h-screen justify-center items-center bg-gray-100 flex w-screen h-screen flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">Gdzie mam wyrzucić śmiecia?</h1>

      <input
        type="file"
        accept=".png"
        onChange={handleFileChange}
        id="fileInput"
        className="hidden"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer py-2 px-4 bg-blue-500 text-white rounded-lg border border-gray-300 hover:bg-blue-600 flex items-center justify-center text-center mb-5"
      >
        {file ? `Wybrany plik: ${file.name}` : 'Wybierz plik'}
      </label>

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