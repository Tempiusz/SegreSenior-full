import torch
from torchvision import models, transforms
from PIL import Image
import os

#Klasy w kolejności, w jakiej są w zbiorze
class_names = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

#Ścieżka do modelu i testowego zdjęcia
model_path = "trashnet_model.pth"
image_path = "redbull.jpg"  # ← tu podaj nazwę swojego zdjęcia

#Transformacje takie same jak przy treningu
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], 
                         [0.229, 0.224, 0.225])
])

#Załaduj obraz
image = Image.open(image_path).convert("RGB")
input_tensor = transform(image).unsqueeze(0)  # [1, 3, 224, 224]

#Załaduj model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, 6)
model.load_state_dict(torch.load(model_path, map_location=device))
model = model.to(device)
model.eval()

#Przewidywanie
with torch.no_grad():
    input_tensor = input_tensor.to(device)
    output = model(input_tensor)
    _, predicted = torch.max(output, 1)
    predicted_class = class_names[predicted.item()]

print(f"Przewidywana kategoria: {predicted_class}")