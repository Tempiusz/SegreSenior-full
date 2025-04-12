from fastapi import FastAPI, File, UploadFile, HTTPException
import shutil

app = FastAPI()

@app.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print("Działam")
        return {"message": "Plik zapisany", "filename": file.filename}
    
    except Exception as e:
        print(f"Błąd zapisu pliku: {e}")
        raise HTTPException(status_code=500, detail="Nie udało się zapisać pliku.")