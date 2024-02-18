from flask import Flask, request, jsonify
from flask_cors import CORS
# from model_integrated import detect_faces_and_send
from threading import Thread

app = Flask(__name__) 
CORS(app)  # Adjust the origin as per your React app's URL

@app.route('/data', methods=["GET"])
def get_data():
    try:
        message = ""
        data = {}
        with open("drowsiness_log.txt", "r") as log_file:
            message = log_file.readline().strip()
            if (message.split(":")[1].strip() == "True"):
                data["sleepy"] =  True
            else:
                data["sleepy"] = False
            message = log_file.readline().strip()
            if (message.split(":")[1].strip() == "True"):
                data["bad_posture"] =  True
            else:
                data["bad_posture"] = False
            data["emotion"] = log_file.readline().strip().split(":")[1].strip()
            message = log_file.readline().strip()
            if (message.split(":")[1].strip() == "True"):
                data["distracted"] =  True
            else:
                data["distracted"] = False
            print(data)
            return jsonify(data), 200
        
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stats', methods=["GET"])
def get_stats():
    try:
        with open("drowsiness_log.txt", "r") as log_file:
            json = {}
            for line in log_file:
                message = line.strip()
                if message:
                    # Sleepy
                    if message.__contains__("sleepy"):
                        if (message.split(":")[1].strip() == "True"):
                            json["sleepy"] = True
                        else:
                            json["sleepy"] = False
                    # bad posture
                    if message.__contains__("bad posture"):
                        if (message.split(":")[1].strip() == "True"):
                            json["bad_posture"] = True
                        else:
                            json["bad_posture"] = False
                    # Emotion
                    if message.__contains__("emotion"):
                        json["emotion"] =  message.split(":")[1].strip()
                    # count sleep
                    if message.__contains__("count_sleep"):
                        sleepy_frames = int(message.split(":")[1].strip())
                        json["count_sleep"] =  sleepy_frames
                    # count yawn
                    if message.__contains__("count_distracted"):
                        yawn_frames = int(message.split(":")[1].strip())
                        json["count_distracted"]= yawn_frames
                    # total count
                    if message.__contains__("count_total"):
                        total_frames = int(message.split(":")[1].strip())
                        json["count_total"] =  int(total_frames)
                    # yawn
                    if message.__contains__("distracted"):
                        if (message.split(":")[1].strip() == "True"):
                            json["distracted"] = True
                        else:
                            json["distracted"] = False
                    # time distracted and distracted duration
            json["count_sleep"] =  "%.2f" % (json["count_sleep"] /  json["count_total"])
            json["distracted_percentage"] = "%.2f" % ((json["count_distracted"] + json["count_sleep"]) / (json["count_total"] + 1))
            json["focus_percentage"] = "%.2f" % 1 - json["distracted_percentage"]
            json["count_total"] = json["count_total"]/50
            print(json)
            return jsonify(json), 200
                
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# def run_flask():
#     app.run(debug=True, port=5000)
    
# def run_detection():
#     detect_faces_and_send()
    
if __name__ == '__main__':
    # Start the sleepiness check in a separate thread
    #print(f"Flask server running on {app.config['SERVER_NAME']}")

    app.run(debug=True, port=5000)