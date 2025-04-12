from fastapi import FastAPI, File, UploadFile, HTTPException
import shutil
import os
from model_utils import load_model, classify_image
import torch
app = FastAPI()

# Załaduj model i klasy od razu przy starcie aplikacji
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model, class_names, device = load_model("trashnet_model.pth", device)

@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Zapisz plik tymczasowo
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Klasyfikacja obrazu
        predicted_class = classify_image(file_location, model, class_names, device)

        # Usuń plik tymczasowy po użyciu
        os.remove(file_location)

        return {"filename": file.filename, "category": predicted_class}
    
    except Exception as e:
        print(f"Błąd zapisu pliku: {e}")
        raise HTTPException(status_code=500, detail="Wystąpił błąd podczas klasyfikacji obrazu.")