from flask import Flask, request, jsonify
from flask_cors import CORS
from model_integrated import detect_faces_and_send

app = Flask(__name__) 
#app.config['SECRET_KEY'] = 'secret!'
CORS(app) 

@app.route('/data', methods=["GET"])
def get_data():
    message = ""
    with open("drowsiness_log.txt", "r") as log:
        message += log.readline().strip()
    data = {"message": message} 
    return jsonify(data)

if __name__ == '__main__':
    # Start the sleepiness check in a separate thread
    app.run()
    detect_faces_and_send()
    