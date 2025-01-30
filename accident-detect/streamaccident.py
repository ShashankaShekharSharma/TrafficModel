import streamlit as st
from ultralytics import YOLO
import tempfile
import os
import glob
from moviepy import VideoFileClip

def convert_to_mp4(video_path):
    mp4_output_path = video_path.replace(".avi", ".mp4")
    clip = VideoFileClip(video_path)
    clip.write_videofile(mp4_output_path, codec='libx264')
    clip.close()
    return mp4_output_path

# Set up the Streamlit UI
def main():
    st.title("Accident")
    st.write("Upload a video.")

    # Video uploader
    uploaded_video = st.file_uploader("Upload Video File", type=["mp4", "avi", "mov"])

    if uploaded_video is not None:
        # Save the uploaded video temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
            temp_video.write(uploaded_video.read())
            temp_video_path = temp_video.name

        st.video(temp_video_path)
        st.write("Video uploaded successfully.")

        # YOLO model loading
        model = YOLO("accident.pt")

        # Perform detection and save the results
        st.write("Running detection...")
        
        with st.spinner("Processing video. Please wait..."):
            result = model.predict(source=temp_video_path, show=False, save=True)
        
        st.success("detection complete.")

        # Find the latest result video from the predict directories
        output_dirs = sorted(glob.glob("runs/detect/*/"), key=os.path.getmtime, reverse=True)
        result_video_path = None

        for output_dir in output_dirs:
            video_files = glob.glob(os.path.join(output_dir, "*.avi"))
            if video_files:
                result_video_path = video_files[0]
                break

        if result_video_path and os.path.exists(result_video_path):
            st.write("Resulting Video:")
            
            # Convert to mp4 if necessary
            if result_video_path.endswith(".avi"):
                result_video_path = convert_to_mp4(result_video_path)
        
            st.video(result_video_path)
        else:
            st.error("Result video not found.")
        

if __name__ == "__main__":
    main()
