from flask import Flask, request, jsonify
from flask_cors import CORS
#from model_integrated import detect_faces_and_send
from threading import Thread

app = Flask(__name__) 
CORS(app)  # Adjust the origin as per your React app's URL

@app.route('/data', methods=["GET"])
def get_data():
    try:
        message = "hello"
        with open("drowsiness_log.txt", "r") as log_file:
            message += log_file.readline().strip()
            data = {"message": message}
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stats', methods=["POST"])
def get_stats():
    try:
        data = request.json
        print(data)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def run_flask():
    app.run(debug=True, port=5000)
    
def run_detection():
    detect_faces_and_send()
    
if __name__ == '__main__':
    # Start the sleepiness check in a separate thread
    app.run(debug=True, port=5000)
    flask_thread = Thread(target=run_flask)
    flask_thread.start()

    # Start the sleepiness check
    detection_thread = Thread(target=run_detection)
    detection_thread.start()
    