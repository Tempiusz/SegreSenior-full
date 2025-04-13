import { useState } from 'react';
import glassImg from './assets/szkło.png';
import metalImg from './assets/plastik.png';
import paperImg from './assets/papier.png';
import plasticImg from './assets/plastik.png';
import trashImg from './assets/zmieszane.png';

const imageMap = {
  glass: glassImg,
  metal: metalImg,
  paper: paperImg,
  cardboard: paperImg,
  plastic: plasticImg,
  trash: trashImg
};

const categoryTranslations = {
  cardboard: 'Papier',
  glass: 'Szkło',
  metal: 'Metale i tworzywa sztuczne',
  paper: 'Papier',
  plastic: 'Metale i tworzywa sztuczne',
  trash: 'Odpady Zmieszane'
};

const categoryPoems = {
  cardboard: 'Jeśli twój karton jest w dobrym stanie, rozważ oddanie go na makulaturę.',
  glass: 'Tu wrzucaj tylko szkło butelkowe! Zbite szklanki czy żarówki idą do mieszanych.',
  metal: 'Pamiętaj aby zgnieść puszkę.',
  paper: 'Uważaj na papierowe kubeczki – często zawierają plastik i należą do zmieszanych!',
  plastic: 'Zgnieć plastikowe butelki – dzięki temu zajmą mniej miejsca!',
  trash: 'Jeśli twoje odpady nie nadają się do segregacji, wrzuć je do zmieszanych!'
};

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile)); // <-- PODGLĄD ZDJĘCIA
      setCategory(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-image/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Serwer zwrócił błąd');
      }

      const data = await response.json();
      setCategory(data.category);
      setError(null);
    } catch (error) {
      console.error('Błąd przy wysyłaniu pliku:', error);
      setError('Nie udało się przetworzyć zdjęcia.');
      setCategory(null);
    }
  };

  return (
    <div className="ml-auto min-h-screen justify-center items-center bg-gray-100 flex w-screen h-auto flex-col py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Gdzie mam wyrzucić śmiecia?</h1>

      <input
        type="file"
        accept="image/*"
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

      {imagePreview && (
        <div className="mt-6">
          <p className="text-lg text-gray-800 font-medium mb-2">Twoje zdjęcie:</p>
          <img
            src={imagePreview}
            alt="Podgląd zdjęcia"
            className="max-h-80 w-auto object-contain rounded shadow-md"
          />
        </div>
      )}

      {category && (
        <div className="flex flex-col items-center mt-6">
          <p className="mt-6 text-xl text-green-700 font-semibold">
            Wyrzuć to do kosza z napisem: <span className="underline">{categoryTranslations[category]}</span>
          </p>
          <img
            src={imageMap[category]}
            alt={categoryTranslations[category]}
            className="mt-4 w-64 h-64 object-contain"
          />
          <p className="mt-4 text-center text-black text-lg italic">
            {categoryPoems[category]}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-6 text-xl text-red-600 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}

export default App;
