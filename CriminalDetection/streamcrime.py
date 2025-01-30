import os
import cv2
import numpy as np
import torch
import streamlit as st
from facenet_pytorch import InceptionResnetV1, MTCNN
from PIL import Image

st.title("Real-Time Face Recognition App")

mtcnn = MTCNN(keep_all=True)
resnet = InceptionResnetV1(pretrained='vggface2').eval()

def detect_and_encode(image):
    with torch.no_grad():
        boxes, _ = mtcnn.detect(image)
        if boxes is not None:
            faces = []
            for box in boxes:
                face = image[int(box[1]):int(box[3]), int(box[0]):int(box[2])]
                if face.size == 0:
                    continue
                face = cv2.resize(face, (160, 160))
                face = np.transpose(face, (2, 0, 1)).astype(np.float32) / 255.0
                face_tensor = torch.tensor(face).unsqueeze(0)
                encoding = resnet(face_tensor).detach().numpy().flatten()
                faces.append(encoding)
            return boxes, faces
    return [], []

def encode_images_from_folder(folder_path):
    known_face_encodings = []
    known_face_names = []
    
    for file_name in os.listdir(folder_path):
        if file_name.lower().endswith(('png', 'jpg', 'jpeg')):
            image_path = os.path.join(folder_path, file_name)
            image = cv2.imread(image_path)
            if image is not None:
                image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                _, encodings = detect_and_encode(image_rgb)
                if encodings:
                    known_face_encodings.append(encodings[0])
                    known_face_names.append(os.path.splitext(file_name)[0])
    
    return known_face_encodings, known_face_names

def recognize_faces(known_encodings, known_names, test_encodings, threshold=0.6):
    recognized_results = []
    for test_encoding in test_encodings:
        distances = np.linalg.norm(known_encodings - test_encoding, axis=1)
        min_distance_idx = np.argmin(distances)
        if distances[min_distance_idx] < threshold:
            recognized_results.append((known_names[min_distance_idx], "Detected"))
        else:
            recognized_results.append((None, "Not found"))
    return recognized_results

folder_path = "Images"
known_face_encodings, known_face_names = encode_images_from_folder(folder_path)

if st.button("Start Camera"):
    cap = cv2.VideoCapture(0)
    stframe = st.empty()
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        boxes, test_face_encodings = detect_and_encode(frame_rgb)
        criminal_detected = False
        detected_criminal_name = None

        if test_face_encodings and known_face_encodings:
            results = recognize_faces(np.array(known_face_encodings), known_face_names, test_face_encodings, 0.6)
            for (box, (name, label)) in zip(boxes, results):
                if box is not None:
                    (x1, y1, x2, y2) = map(int, box)
                    color = (0, 0, 255) if label == "Detected" else (0, 255, 0)
                    if label == "Detected":
                        criminal_detected = True
                        detected_criminal_name = name
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    display_name = name if name else label
                    cv2.putText(frame, display_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)
        
        if criminal_detected and detected_criminal_name:
            text = f"{detected_criminal_name.upper()} FOUND!!"
            cv2.putText(frame, text, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 3, cv2.LINE_AA)
        
        stframe.image(frame, channels="BGR")
    
    cap.release()
    cv2.destroyAllWindows()
