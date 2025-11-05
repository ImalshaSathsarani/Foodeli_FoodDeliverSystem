from flask import Flask, jsonify
from flask_cors import CORS
from predictor import get_next_day_predictions

app = Flask(__name__)
CORS(app)

@app.route('/predict')
def get_predictions() :
    results = get_next_day_predictions()
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)