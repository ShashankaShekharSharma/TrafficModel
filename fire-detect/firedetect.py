from ultralytics import YOLO

model = YOLO("fire.pt")

result = model.predict(source="fire.mp4", show=True, save=True)