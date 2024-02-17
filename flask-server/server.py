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
    while True:
        time.sleep(5)
        print('Emitting sleepy notification')  # Confirm it reaches this point
        
        socketio.emit('sleepy_notification', {'sleepy': True})

@app.route('/')
def index():
    return "Sleepiness Detection Server"

@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected') 

if __name__ == '__main__':
    # Start the sleepiness check in a separate thread
    socketio.start_background_task(check_sleepiness)
    # Run the Flask app
    socketio.run(app, port=5000)
