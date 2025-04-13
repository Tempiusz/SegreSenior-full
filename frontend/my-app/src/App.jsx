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
  glass: 'Tu wrzucaj tylko szkło butelkowe! Zbite szklanki czy żarówki idą do zmieszanych.',
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
      setImagePreview(URL.createObjectURL(selectedFile));
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

      if (!response.ok) throw new Error('Serwer zwrócił błąd');

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
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-8 sm:p-12 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800">
          Gdzie mam to wyrzucić?
        </h1>

        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="fileInput"
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-blue-600 text-white font-medium px-5 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-md"
          >
            {file ? `Wybrany plik: ${file.name}` : 'Wybierz plik'}
          </label>

          <button
            onClick={handleUpload}
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-green-700 transition-all shadow-md"
          >
            Gdzie mam wyrzucić?
          </button>
        </div>

        {imagePreview && (
          <div className="mt-4 flex flex-col items-center">
            <p className="text-lg text-gray-700 font-medium mb-2">Podgląd zdjęcia:</p>
            <img
              src={imagePreview}
              alt="Podgląd zdjęcia"
              className="max-h-80 w-auto object-contain rounded-xl border border-gray-300 shadow-md"
            />
          </div>
        )}

        {category && (
          <div className="bg-white rounded-2xl mt-6 p-6 shadow-lg text-center">
            <p className="text-xl font-semibold text-green-700">
              Wyrzuć to do: <span className="underline">{categoryTranslations[category]}</span>
            </p>
            <img
              src={imageMap[category]}
              alt={categoryTranslations[category]}
              className="mt-4 w-40 h-40 object-contain mx-auto"
            />
            <p className="mt-4 text-gray-800 text-lg italic">
              {categoryPoems[category]}
            </p>
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 text-lg font-semibold mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}

export default App;
