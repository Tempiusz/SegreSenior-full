from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import torch
from torchvision import models, transforms
from PIL import Image

app = FastAPI()

# Dodanie middleware CORS
origins = [
    "http://localhost:5173",  # front-end działa na porcie 5173
    "http://localhost",       # Dopuszczenie lokalnych żądań
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Dozwolone źródła
    allow_credentials=True,
    allow_methods=["*"],  # Dozwolone metody HTTP (np. GET, POST)
    allow_headers=["*"],  # Dozwolone nagłówki
)

# Funkcja do ładowania modelu
def load_model(model_path, device):
    # Klasy w kolejności, w jakiej są w zbiorze
    class_names = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

    # Załaduj model
    model = models.resnet18()
    model.fc = torch.nn.Linear(model.fc.in_features, len(class_names))
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()

    return model, class_names

# Funkcja do ładowania obrazu i jego transformacji
def load_image(image_path):
    # Transformacje takie same jak przy treningu
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], 
                             [0.229, 0.224, 0.225])
    ])

    # Załaduj obraz
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)  # [1, 3, 224, 224]
    return input_tensor

# Funkcja do klasyfikacji obrazu
def classify_image(image_path, model, class_names, device):
    # Załaduj obraz
    input_tensor = load_image(image_path)
    
    # Przewidywanie
    with torch.no_grad():
        input_tensor = input_tensor.to(device)
        output = model(input_tensor)
        _, predicted = torch.max(output, 1)
        predicted_class = class_names[predicted.item()]

    return predicted_class

# Załaduj model i klasy od razu przy starcie aplikacji
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model, class_names = load_model("trashnet_model.pth", device)

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
