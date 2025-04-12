import torch
from torchvision import models, transforms
from PIL import Image

# Funkcja do ładowania modelu i nazw klas
def load_model(model_path="trashnet_model.pth", device=None):
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Załaduj model
    checkpoint = torch.load(model_path, map_location=device)
    model = models.resnet18()
    model.fc = torch.nn.Linear(model.fc.in_features, len(checkpoint['class_names']))
    model.load_state_dict(checkpoint['model_state_dict'])
    class_names = checkpoint['class_names']
    model = model.to(device)
    model.eval()

    return model, class_names, device

# Funkcja do klasyfikowania obrazu
def classify_image(image_path, model, class_names, device):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ])

    # Załaduj obraz i zastosuj transformacje
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)

    # Klasyfikacja
    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output, 1)
        predicted_class = class_names[predicted.item()]
    
    return predicted_class