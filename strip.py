with open("drowsiness_log.txt", "r") as log_file:
    for line in log_file:
        json = {}
        message = line.strip()
        if message:
            # Sleepy
            if message.__contains__("sleepy"):
                json = {"sleepy": bool(message.split(":")[1].strip())}
            # bad posture
            if message.__contains__("bad posture"):
                json = {"bad_posture": bool(message.split(":")[1].strip())}
            # Emotion
            if message.__contains__("emotion"):
                json = {"emotion": message.split(":")[1].strip()}
            # count sleep
            if message.__contains__("count_sleep"):
                sleepy_frames = int(message.split(":")[1].strip())
                json = {"count_sleep": sleepy_frames}
            # count yawn
            if message.__contains__("count_yawn"):
                yawn_frames = int(message.split(":")[1].strip())
                json = {"count_yawn": yawn_frames}
            # total count
            if message.__contains__("count_total"):
                total_frames = int(message.split(":")[1].strip())
                json = {"count_total": int(total_frames//30)}
            # yawn
            if message.__contains__("yawn"):
                json = {"yawn": bool(message.split(":")[1].strip())}
            # time distracted and distracted duration
            distracted_duration = (sleepy_frames * 5) + (yawn_frames * 3)
            total_frames = abs(total_frames - distracted_duration)
            json = {"time_distracted": int(total_frames)}
            json = {"distracted_duration": int(distracted_duration)}
            jsonify(json)

            

