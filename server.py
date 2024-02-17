from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

# 
# python -m flask --app server run
# 

app = Flask(__name__)
CORS(app)

# expression endpoints ______________________________________________________________________________
last_expression = None
@app.route('/save_expression', methods=['Post'])
def saveExpression():
    global last_expression
    
    data = request.json
    print(data)
    
    if 'expression' not in data:
        return jsonify({'status': 'error', 'message': 'Expression not found'})
    
    last_expression = data['expression']
    
    return jsonify({'status': 'ok'})

@app.route('/get_expression', methods=['Get'])
def getExpression():
    global last_expression
    return jsonify({'status': 'ok', 'expression': last_expression})

# shoulder position endpoints _______________________________________________________________________
last_shoulder_position = None # (left shoulder, right shoulder)
@app.route('/save_shoulder_position', methods=['Post'])
def saveShoulderPosition():
    global last_shoulder_position
    
    data = request.json
    print(data)
    
    if 'position' not in data:
        return jsonify({'status': 'error', 'message': 'Position not found'})
    
    last_shoulder_position = data['position']
    
    return jsonify({'status': 'ok'})


# everything else ___________________________________________________________________________________
@app.route('/get_everything', methods=['Get'])
def getEverything():
    global last_expression, last_shoulder_position
    return jsonify({'status': 'ok', 'expression': last_expression, 'position': last_shoulder_position})