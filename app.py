import os
import json
import cv2
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, render_template, send_from_directory, url_for

app = Flask(__name__)

# Paths and settings
MODEL_PATH = "signova_model.h5"
GIF_FOLDER = os.path.join("static", "gifs")
IMG_SIZE = (128, 128)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'gif'}

# Load model
model = tf.keras.models.load_model(MODEL_PATH)

# Load GIF mapping
with open("gif_map.json", "r") as f:
    gif_map = json.load(f)

classes = sorted(list(gif_map.keys()))

# Allowed file check
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ---------------- Routes ---------------- #

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    try:
        # Read image
        file_bytes = file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"error": "Invalid image"}), 400

        # Preprocess
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, IMG_SIZE) / 255.0
        img = np.expand_dims(img, axis=0)

        # Predict
        pred = model.predict(img, verbose=0)
        class_idx = int(np.argmax(pred))
        class_label = classes[class_idx]

        # Get GIF URL
        gif_file = gif_map.get(class_label.upper())
        gif_url = url_for('get_gif', filename=gif_file) if gif_file else None

        return jsonify({"gesture": class_label, "gif": gif_url})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/gif/<filename>")
def get_gif(filename):
    return send_from_directory(GIF_FOLDER, filename)

@app.route("/text_to_gif")
def text_to_gif():
    text = request.args.get("text", "").upper()
    gif_file = gif_map.get(text)
    gif_url = url_for('get_gif', filename=gif_file) if gif_file else None
    return jsonify({"gif": gif_url})

# ---------------- Main ---------------- #
if __name__ == "__main__":
    app.run(debug=True, threaded=True, use_reloader=False)
