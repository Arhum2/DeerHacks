import datetime as dt
from imutils import face_utils 
from imutils.video import VideoStream
import imutils 
import dlib
import time 
import cv2 
from scipy.spatial import distance as dist
import numpy as np
from datetime import datetime
from scipy.spatial import distance as dist 
import asyncio
import mediapipe as mp
from deepface import DeepFace

def eye_aspect_ratio(eye):
	# Vertical eye landmarks
	A = dist.euclidean(eye[1], eye[5])
	B = dist.euclidean(eye[2], eye[4])
	# Horizontal eye landmarks 
	C = dist.euclidean(eye[0], eye[3])

	# The EAR Equation 
	EAR = (A + B) / (2.0 * C)
	return EAR

def mouth_aspect_ratio(mouth): 
	A = dist.euclidean(mouth[13], mouth[19])
	B = dist.euclidean(mouth[14], mouth[18])
	C = dist.euclidean(mouth[15], mouth[17])

	MAR = (A + B + C) / 3.0
	return MAR

#all eye  and mouth aspect ratio with time

def detect_faces_and_send():
    # Set up WebSocket server
        # Declare a constant which will work as the threshold for EAR value, below which it will be regared as a blink 
    EAR_THRESHOLD = 0.3
    # Declare another costant to hold the consecutive number of frames to consider for a blink 
    CONSECUTIVE_FRAMES = 20 
    # Another constant which will work as a threshold for MAR value
    MAR_THRESHOLD = 14

    # Initialize two counters 
    FRAME_COUNT = 0 
    

    # Now, intialize the dlib's face detector model as 'detector' and the landmark predictor model as 'predictor'
    print("[INFO]Loading the predictor.....")
    detector = dlib.get_frontal_face_detector() 
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

    # Grab the indexes of the facial landamarks for the left and right eye respectively 
    (lstart, lend) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    (rstart, rend) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]
    (mstart, mend) = face_utils.FACIAL_LANDMARKS_IDXS["mouth"]

    # Now start the video stream and allow the camera to warm-up
    print("[INFO]Loading Camera.....")
    vs = VideoStream(usePiCamera = False).start()
    #cap = cv2.VideoCapture(0)

    count_sleep = 0
    count_yawn = 0 
    count_all = 0
    distracted = 0
    count_distracted = 0
    # Initialize OpenCV's face detection model
    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose
    message = [f"sleepy: False", "bad posture: False", f"emotion: neutral", f"distracted: False", 
               f"count_sleep : 0", f"count_yawn : 0", f"count_total : 0",]
    found = False

# Initialize the pose model
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    # Capture video from the default camera (change the parameter to your camera index if needed)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        while True: 
            print("-1")
            count_all += 1
            message[6] = f"count_total: {count_all}"
            # Extract a frame 
            frame = vs.read()
            # Resize the frame 
            if frame is None:
                print("frame doesnt exist")
                continue
            frame = imutils.resize(frame, width = 500)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(frame_rgb)
            print("0")
            # Convert the frame to grayscale 
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            results = pose.process(frame_rgb)
            # Detect faces 
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
            print("1")
            found_faces = False
            for x, y, w, h in faces:
                found_faces = True
                img = cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 1)
                try:
                    # Analyze face for emotion
                    analyze = DeepFace.analyze(img, actions=['emotion'])
                    emotion = analyze[0]['dominant_emotion']
                    print(emotion)
                    if emotion == "happy":
                        message[2] = "emotion: happy"
                        print("detect happy")
                    elif emotion == "sad":
                        message[2] = "emotion: sad"
                        print("detect sad")
                        
                except Exception as e:
                    continue
            if not found_faces:
                distracted += 1 
            else:
                distracted = 0
            if distracted >= CONSECUTIVE_FRAMES:
                message[4] = "distracted: True"
                print("DISTRACTED")
                count_distracted += 1
            print("2")
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
                if abs(right_shoulder_x - left_shoulder_y) > 100:
                    print("bad posture")
                    found=True
                    message[1] = "bad posture: True"
            print("3")
            rects = detector(frame, 1)

            # Now loop over all the face detections and apply the predictor
            for (i, rect) in enumerate(rects): 
                shape = predictor(gray, rect)
                # Convert it to a (68, 2) size numpy array 
                shape = face_utils.shape_to_np(shape)

                # Draw a rectangle over the detected face 
                (x, y, w, h) = face_utils.rect_to_bb(rect) 

                leftEye = shape[lstart:lend]
                rightEye = shape[rstart:rend] 
                mouth = shape[mstart:mend]
                # Compute the EAR for both the eyes 
                leftEAR = eye_aspect_ratio(leftEye)
                rightEAR = eye_aspect_ratio(rightEye)
                # Take the average of both the EAR
                EAR = (leftEAR + rightEAR) / 2.0

                # Compute the convex hull for both the eyes and then visualize it
                leftEyeHull = cv2.convexHull(leftEye)
                rightEyeHull = cv2.convexHull(rightEye)
                # Draw the contours 

                MAR = mouth_aspect_ratio(mouth)
                # Check if EAR < EAR_THRESHOLD, if so then it indicates that a blink is taking place 
                # Thus, count the number of frames for which the eye remains closed 
                if EAR < EAR_THRESHOLD: 
                    FRAME_COUNT += 1
                    if FRAME_COUNT >= CONSECUTIVE_FRAMES: 
                        print("detected sleepy")
                        count_sleep += 1
                        message[4] = f"count_sleep: {count_sleep}"
                        message[0] = "sleepy:True"
                        with open("drowsiness_log.txt", "w") as file:
                            file.write("\n".join(message))
                        time.sleep(5)
                    continue
                            
                else: 
                    FRAME_COUNT = 0
        

                # Check if the person is yawning
                if MAR > MAR_THRESHOLD:
                    print("detected yawn")
                    time.sleep(5)
                    count_yawn += 1
                    found=True
                    message[5] = f"count_yawn: {count_yawn}"
                    message[3] = "yawn: True"
            print("4")
            with open("drowsiness_log.txt", "w") as file:
                file.write("\n".join(message))
                
            message = [f"sleepy: False", "bad posture: False", f"emotion: neutral", f"distracted: False",
               f"count_sleep : {count_sleep}", f"count_yawn : {count_yawn}", f"count_total : {count_all}", f"count_distracted : {count_distracted}"]
            print("write")
                            
detect_faces_and_send()