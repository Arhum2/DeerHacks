from flask import Flask, request, jsonify
from flask_cors import CORS
from model_integrated import detect_faces_and_send
from threading import Thread

app = Flask(__name__) 
CORS(app, origins=["http://localhost:3000"])  # Adjust the origin as per your React app's URL
#app.config['SECRET_KEY'] = 'secret!'

@app.route('/data', methods=["GET"])
def get_data():
    message = ""
    with open("drowsiness_log.txt", "r") as log:
        message += log.readline().strip()
    data = {"message": message} 
    response =  jsonify(data)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Methods", "GET")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    return response

def run_flask():
    app.run(port=5000)
    
def run_detection():
    detect_faces_and_send()
    
if __name__ == '__main__':
    # Start the sleepiness check in a separate thread
    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    # Start the sleepiness check
    detection_thread = Thread(target=run_detection)
    detection_thread.start()
    