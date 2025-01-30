import streamlit as st
from ultralytics import YOLO
from paddleocr import PaddleOCR
import tempfile
import os
import glob
import csv
from moviepy import VideoFileClip
from difflib import SequenceMatcher
from collections import defaultdict

def convert_to_mp4(video_path):
    mp4_output_path = video_path.replace(".avi", ".mp4")
    clip = VideoFileClip(video_path)
    clip.write_videofile(mp4_output_path, codec='libx264')
    clip.close()
    return mp4_output_path

def calculate_similarity(str1, str2):
    """Calculate similarity ratio between two strings"""
    return SequenceMatcher(None, str1, str2).ratio()

def group_similar_plates(plates_data):
    """Group similar license plates together and select the most frequent one"""
    similarity_threshold = 0.8
    groups = defaultdict(list)
    
    # First pass: Create initial groups
    for frame, plate, coords in plates_data:
        if not groups:
            groups[plate].append((frame, plate, coords))
            continue
            
        found_match = False
        for key in list(groups.keys()):
            if calculate_similarity(plate, key) >= similarity_threshold:
                groups[key].append((frame, plate, coords))
                found_match = True
                break
                
        if not found_match:
            groups[plate].append((frame, plate, coords))
    
    # Select most frequent plate from each group
    final_plates = []
    for group in groups.values():
        # Count occurrences of each plate text in the group
        plate_counts = defaultdict(int)
        for _, plate, _ in group:
            plate_counts[plate] += 1
            
        # Get the most frequent plate
        most_common_plate = max(plate_counts.items(), key=lambda x: x[1])[0]
        
        # Get the first occurrence of the most common plate
        for frame, plate, coords in group:
            if plate == most_common_plate:
                final_plates.append((frame, plate, coords))
                break
                
    return final_plates

def main():
    st.title("License Plate Detection App")
    st.write("Upload a video to detect license plates.")
    
    uploaded_video = st.file_uploader("Upload Video File", type=["mp4", "avi", "mov"])
    if uploaded_video is not None:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
            temp_video.write(uploaded_video.read())
            temp_video_path = temp_video.name
        st.video(temp_video_path)
        st.write("Video uploaded successfully.")
        
        model = YOLO("betterlicense.pt")
        ocr = PaddleOCR(use_angle_cls=True, lang='en')
        
        csv_filename = 'license_plates.csv'
        csv_file_path = os.path.join(tempfile.gettempdir(), csv_filename)
        
        # Store detections in a list before writing to CSV
        all_detections = []
        detected_plates = set()
        
        results = model.predict(source=temp_video_path, show=False, save=True)
        
        for frame_idx, result in enumerate(results):
            frame = result.orig_img
            detections = result.boxes
            
            for box in detections:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cropped_plate = frame[y1:y2, x1:x2]
                
                try:
                    ocr_result = ocr.ocr(cropped_plate, cls=True)
                    if ocr_result and ocr_result[0] and ocr_result[0][0]:
                        plate_text = ocr_result[0][0][1][0].strip()
                        if plate_text not in detected_plates:
                            detected_plates.add(plate_text)
                            all_detections.append([
                                frame_idx,
                                plate_text,
                                f"({x1},{y1},{x2},{y2})"
                            ])
                except Exception as e:
                    pass
        
        # Group similar plates and get the most frequent ones
        final_plates = group_similar_plates(all_detections)
        
        # Write final results to CSV
        with open(csv_file_path, 'w', newline='') as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(['Frame', 'License Plate', 'Coordinates'])
            csv_writer.writerows(final_plates)
        
        st.success(f"License plate numbers saved to {csv_file_path}")
        
        # Display the contents of the CSV file
        st.write("### Detected License Plates (Filtered)")
        with open(csv_file_path, 'r') as csv_file:
            csv_reader = csv.reader(csv_file)
            next(csv_reader)  # Skip header
            plate_data = list(csv_reader)
            if plate_data:
                st.table(plate_data)
            else:
                st.write("No license plates detected.")

if __name__ == "__main__":
    main()