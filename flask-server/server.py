from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from model_integrated import detect_faces_and_send
import threading
import time

app = Flask(__name__) 
app.config['SECRET_KEY'] = 'secret!'
CORS(app) 
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for SocketIO

def check_sleepiness():
    print('Sleepiness check thread started')  # Confirm the thread starts
    detect_faces_and_send()

@app.route('/')
def index():
    print('Sleepiness check thread started')  # Confirm the thread starts 

if __name__ == '__main__':
    # Start the sleepiness check in a separate thread
    app.run()
    detect_faces_and_send()
    