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
ear_list=[]
total_ear=[]
mar_list=[]
total_mar=[]
ts=[]
total_ts=[]

def detect_faces_and_send():
    # Set up WebSocket server
        # Declare a constant which will work as the threshold for EAR value, below which it will be regared as a blink 
    EAR_THRESHOLD = 0.3
    # Declare another costant to hold the consecutive number of frames to consider for a blink 
    CONSECUTIVE_FRAMES = 20 
    # Another constant which will work as a threshold for MAR value
    MAR_THRESHOLD = 14

    # Initialize two counters 
    BLINK_COUNT = 0 
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
    time.sleep(2) 

    count_sleep = 0
    count_yawn = 0 
    count_all = 0
    # Initialize OpenCV's face detection model

    # Capture video from the default camera (change the parameter to your camera index if needed)
    cap = cv2.VideoCapture(0)

    while True: 
        
        # Extract a frame 
        frame = vs.read()
        cv2.putText(frame, "PRESS 'q' TO EXIT", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 3) 
        # Resize the frame 
        if frame is None:
            continue
        
        frame = imutils.resize(frame, width = 500)
        # Convert the frame to grayscale 
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # Detect faces 
        rects = detector(frame, 1)
        count_all += 1
    

        # Now loop over all the face detections and apply the predictor 
        for (i, rect) in enumerate(rects): 
            shape = predictor(gray, rect)
            # Convert it to a (68, 2) size numpy array 
            shape = face_utils.shape_to_np(shape)

            # Draw a rectangle over the detected face 
            (x, y, w, h) = face_utils.rect_to_bb(rect) 
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)	
            # Put a number 
            cv2.putText(frame, "Driver", (x - 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            leftEye = shape[lstart:lend]
            rightEye = shape[rstart:rend] 
            mouth = shape[mstart:mend]
            # Compute the EAR for both the eyes 
            leftEAR = eye_aspect_ratio(leftEye)
            rightEAR = eye_aspect_ratio(rightEye)

            # Take the average of both the EAR
            EAR = (leftEAR + rightEAR) / 2.0
            #live datawrite in csv
            ear_list.append(EAR)
            #print(ear_list)
            

            ts.append(dt.datetime.now().strftime('%H:%M:%S.%f'))
            # Compute the convex hull for both the eyes and then visualize it
            leftEyeHull = cv2.convexHull(leftEye)
            rightEyeHull = cv2.convexHull(rightEye)
            # Draw the contours 
            cv2.drawContours(frame, [leftEyeHull], -1, (0, 255, 0), 1)
            cv2.drawContours(frame, [rightEyeHull], -1, (0, 255, 0), 1)
            cv2.drawContours(frame, [mouth], -1, (0, 255, 0), 1)

            MAR = mouth_aspect_ratio(mouth)
            mar_list.append(MAR/10)
            # Check if EAR < EAR_THRESHOLD, if so then it indicates that a blink is taking place 
            # Thus, count the number of frames for which the eye remains closed 
            if EAR < EAR_THRESHOLD: 
                FRAME_COUNT += 1

                cv2.drawContours(frame, [leftEyeHull], -1, (0, 0, 255), 1)
                cv2.drawContours(frame, [rightEyeHull], -1, (0, 0, 255), 1)

                if FRAME_COUNT >= CONSECUTIVE_FRAMES: 
                    count_sleep += 1
                    with open('drowsiness_log.txt', 'w') as file:
                        file.write('Drowsiness detected!\n')
                        file.write("Total sleep: "f"{count_sleep}\n")
                        file.write("Total yawn: "f"{count_yawn}\n")
                        file.write("Total time: "f"{count_all}\n")

                    time.sleep(5)
                    with open('drowsiness_log.txt', 'w') as file:
                        file.write('All good!\n')
                        file.write("Total sleep: "f"{count_sleep}\n")
                        file.write("Total yawn: "f"{count_yawn}\n")
                        file.write("Total time: "f"{count_all}\n")

                    # Add the frame to the dataset ar a proof of drowsy driving
                    #cv2.imwrite("dataset/frame_sleep%d.jpg" % count_sleep, frame)
                    #playsound('sound files/alarm.mp3')
                    #send_notice()
                    #cv2.putText(frame, "DROWSINESS ALERT!", (270, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            else: 
                #if FRAME_COUNT >= CONSECUTIVE_FRAMES: 
                    #playsound('sound files/warning.mp3')
                FRAME_COUNT = 0
            #cv2.putText(frame, "EAR: {:.2f}".format(EAR), (300, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            # Check if the person is yawning
            if MAR > MAR_THRESHOLD:
                count_yawn += 1
                cv2.drawContours(frame, [mouth], -1, (0, 0, 255), 1) 
                cv2.putText(frame, "DROWSINESS ALERT!", (270, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                with open('drowsiness_log.txt', 'w') as file:
                        file.write('Drowsiness detected!\n')
                        file.write("Total sleep: "f"{count_sleep}\n")
                        file.write("Total yawn: "f"{count_yawn}\n")
                        file.write("Total time: "f"{count_all}\n")
                time.sleep(2)
                with open('drowsiness_log.txt', 'w') as file:
                    file.write('All good!\n')
                 
                 #distracted vars
                    file.write("Total sleep: "f"{count_sleep}\n")
                    file.write("Total yawn: "f"{count_yawn}\n")
                    file.write("Total time: "f"{count_all}\n")


                #non distracted vars
                
                # Add the frame to the dataset ar a proof of drowsy driving
                #cv2.imwrite("dataset/frame_yawn%d.jpg" % count_yawn, frame)
                #playsound('sound files/alarm.mp3')
                #playsound('sound files/warning_yawn.mp3')
                #total data collection for plotting
    cv2.destroyAllWindows()
    vs.stop()
# Run the asyncio event loop
detect_faces_and_send()
asyncio.run(detect_faces_and_send())