🚀 Signova – Two-Way Indian Sign Language Communication System

Signova is a deep learning–based Indian Sign Language (ISL) recognition system designed to bridge the communication gap between hearing-impaired and non-hearing-impaired users.
The system supports two-way communication by converting:

✋ Hand gestures → Text

⌨️ Text → ISL GIFs

This project is built as a research-driven prototype, focusing on simplicity, real-time performance, and accessibility using only a standard webcam.

📌 Problem Statement

Millions of hearing-impaired people rely on sign language for communication. However, most people do not understand Indian Sign Language, which creates barriers in:

Daily conversations

Healthcare

Education

Social interaction

Existing solutions often depend on costly sensors or wearable devices, making them impractical for everyday use.

Signova solves this problem using computer vision and deep learning without any extra hardware.

🎯 Objectives

Enable real-time ISL gesture recognition

Support two-way communication

Avoid external sensors or gloves

Use low-cost, camera-based vision

Build a system suitable for daily life usage

🧠 System Overview

The system works in the following stages:

Webcam captures hand gesture images

Image preprocessing (resizing, noise removal, normalization)

Feature extraction using a CNN model

Gesture classification

Output displayed as:

Text (gesture → text)

ISL GIF (text → gesture)

This workflow ensures smooth and understandable communication between both users.

📊 Dataset Details

A custom Indian Sign Language dataset was created specifically for this project.

Attribute	Description
Total Gestures	12 ISL gestures
Images per Gesture	~250
Total Images	~3000
Capture Device	Webcam
Variations	Lighting, background, hand pose
Supported Gestures

Hello

Namaste

Help

Doctor

Food

Water

Yes

No

Please

Stop

Thank You

Friends

⚙️ Models Used

Three deep learning models were trained and compared:

Model	Training Accuracy	Validation Accuracy	Remarks
CNN	~86%	~85%	Selected for real-time use
RNN	~99.8%	~90.9%	Better for sequential data
LSTM	~99.9%	~99.9%	High accuracy but computationally heavy
✅ Final Model Choice: CNN

Although RNN and LSTM achieved higher accuracy, CNN was selected because:

Dataset is image-based

Faster inference (~30 FPS)

Lower computational cost

More suitable for real-time applications

🧪 Features

📷 Real-time gesture recognition using webcam

🔁 Two-way communication system

🧠 CNN-based deep learning model

📝 Gesture-to-Text conversion

🎞️ Text-to-ISL GIF conversion

💻 No external hardware required

🛠️ Technology Stack

Python

TensorFlow / Keras

OpenCV

NumPy

Matplotlib

Deep Learning (CNN, RNN, LSTM)

🚧 Limitations

Supports only 12 static gestures

Performance may vary with:

Poor lighting

Background clutter

Dynamic (continuous) gestures not supported yet

🔮 Future Enhancements

Expand gesture dataset

Add dynamic / continuous gesture recognition

Convert system into a mobile application

Improve robustness with more real-world data

Support regional sign variations

📄 Research Paper

This project is based on the research paper:

https://drive.google.com/file/d/11ScH2az4sSOIKHGKWxyfy4KNMNEdmT5z/view?usp=sharing

🤝 Contribution

Contributions, suggestions, and improvements are welcome.
Feel free to fork the repository and submit a pull request.

⭐ Final Note

Signova aims to make communication inclusive, simple, and accessible using deep learning and computer vision.

If this project helps you or inspires you, don’t forget to ⭐ the repository!
