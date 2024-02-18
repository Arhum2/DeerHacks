import time
import requests
import json

import cv2
import mediapipe as mp
from deepface import DeepFace

# Initialize Mediapipe BodyPose module
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Initialize the pose model
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    # Open a connection to the camera (0 corresponds to the default camera)
    cap = cv2.VideoCapture(0)

    # Load the face cascade classifier
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    while cap.isOpened():
        # Read a frame from the camera
        ret, frame = cap.read()
        if not ret:
            break

        # Convert the BGR frame to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the frame and get the pose results
        results = pose.process(frame_rgb)

        # Perform face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        for x, y, w, h in faces:
            img = cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 1)
            try:
                # Analyze face for emotion
                analyze = DeepFace.analyze(img, actions=['emotion'])
                emotion = analyze[0]['dominant_emotion']
                if emotion == "happy":
                    print('happy')
                elif emotion == "sad":
                    print("sad")
                    

            except Exception as e:
                print('No face detected')

        # Draw the pose landmarks on the frame
        if results.pose_landmarks:
            mp_drawing.draw_landmarks(
                frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            
            left_shoulder = results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
            # Convert from normalized coordinates to pixel coordinates
            image_height, image_width, _ = frame.shape
            left_shoulder_x = int(left_shoulder.x * image_width)
            left_shoulder_y = int(left_shoulder.y * image_height)
            right_shoulder_x = int(right_shoulder.x * image_width)
            right_shoulder_y = int(right_shoulder.y * image_height)
            #print(left_shoulder_x, left_shoulder_y, right_shoulder_x, right_shoulder_y)
            if abs(left_shoulder_x - left_shoulder_y) 

        # Display the frame with pose landmarks and face detection
        cv2.imshow('Real-time Detection', frame)

        # time.sleep(1)
        
        # Break the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close the OpenCV windows
    cap.release()
    cv2.destroyAllWindows()