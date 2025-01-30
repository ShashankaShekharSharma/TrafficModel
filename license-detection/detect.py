# from ultralytics import YOLO

# model = YOLO("betterlicense.pt")

# result = model.predict(source="test.mp4", show=True, save=True)


# import cv2
# from ultralytics import YOLO
# import pytesseract
# from pytesseract import Output

# # Initialize the YOLO model
# model = YOLO("betterlicense.pt")

# # Perform prediction on a video file
# results = model.predict(source="test.mp4", show=True, save=True, save_txt=False)

# # Iterate through each frame and its detections
# for result in results:
#     frame = result.orig_img  # Original frame
#     detections = result.boxes  # Detected objects
    
#     for box in detections:
#         # Extract bounding box coordinates
#         x1, y1, x2, y2 = map(int, box.xyxy[0])  # Convert coordinates to integers

#         # Crop the detected number plate
#         cropped_plate = frame[y1:y2, x1:x2]

#         # Convert the cropped image to grayscale for better OCR accuracy
#         gray_plate = cv2.cvtColor(cropped_plate, cv2.COLOR_BGR2GRAY)

#         # Perform OCR on the cropped plate
#         text = pytesseract.image_to_string(gray_plate, config='--psm 7')  # Adjust PSM for number plate detection

#         print("Detected Plate Number:", text.strip())

#         # Optional: Save the cropped plate image
#         cv2.imwrite(f"cropped_plate_{x1}_{y1}.png", cropped_plate)



from ultralytics import YOLO
import cv2
from paddleocr import PaddleOCR
import csv

# Initialize the YOLO model and PaddleOCR
model = YOLO("betterlicense.pt")
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Prepare CSV file for output
csv_filename = 'license_plates.csv'
csv_file = open(csv_filename, 'w', newline='')
csv_writer = csv.writer(csv_file)
csv_writer.writerow(['Frame', 'License Plate', 'Coordinates'])

# Set to track detected license plates to avoid duplicates
detected_plates = set()

# Perform prediction on a video file
results = model.predict(source="test.mp4", show=True, save=True, save_txt=False)

# Iterate through each frame and its detections
for frame_idx, result in enumerate(results):
    frame = result.orig_img  # Original frame
    detections = result.boxes  # Detected objects
   
    for box in detections:
        # Extract bounding box coordinates
        x1, y1, x2, y2 = map(int, box.xyxy[0])  # Convert coordinates to integers
        
        # Crop the detected number plate
        cropped_plate = frame[y1:y2, x1:x2]
        
        # Perform OCR using PaddleOCR
        try:
            ocr_result = ocr.ocr(cropped_plate, cls=True)
            
            # Extract text from OCR results
            if ocr_result:
                plate_text = ocr_result[0][0][1][0].strip()  # Get the detected text and strip extra spaces
                
                # Check if the plate number is already detected
                if plate_text not in detected_plates:
                    detected_plates.add(plate_text)  # Add to the set
                    
                    # Write to CSV
                    csv_writer.writerow([
                        frame_idx, 
                        plate_text, 
                        f"({x1},{y1},{x2},{y2})"
                    ])
                    
                    print(f"Frame {frame_idx}: Detected Plate {plate_text}")
        except Exception as e:
            print(f"OCR error on frame {frame_idx}: {e}")

# Close the CSV file
csv_file.close()

print(f"License plate numbers saved to {csv_filename}")