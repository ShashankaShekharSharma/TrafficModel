from ultralytics import YOLO

model = YOLO("accident.pt")

result = model.predict(source="accident2.mp4", show=True, save=True)