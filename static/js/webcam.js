const video = document.getElementById("video");
const gestureText = document.getElementById("gestureText");
const gestureGif = document.getElementById("gestureGif");
const instructionText = document.getElementById("instructionText");
const captureBtn = document.getElementById("captureBtn");
const predictBtn = document.getElementById("predictBtn");
const autoCaptureBtn = document.getElementById("autoCaptureBtn");
const imageUpload = document.getElementById("imageUpload");
const framePreview = document.getElementById("framePreview");

const textToGifInput = document.getElementById("textToGifInput");
const textToGifBtn = document.getElementById("textToGifBtn");

let videoReady = false;
let lastCapturedBlob = null;
let predicting = false;
let autoCaptureInterval = null;

// Start webcam
async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video:{width:320,height:240}, audio:false});
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      videoReady = true;
      instructionText.innerText = "Webcam ready. Show your hand or say 'capture'.";
    });
  } catch (err) {
    console.error("Webcam error:", err);
    instructionText.innerText = "Unable to access webcam.";
  }
}

// Capture frame
function captureFrame() {
  if (!videoReady) return;
  const canvas = document.createElement("canvas");
  const PRED_SIZE = 128;
  canvas.width = PRED_SIZE;
  canvas.height = PRED_SIZE;
  canvas.getContext("2d").drawImage(video, 0, 0, PRED_SIZE, PRED_SIZE);

  canvas.toBlob((blob) => {
    lastCapturedBlob = blob;

    // Preview
    const previewCanvas = document.createElement("canvas");
    previewCanvas.width = video.videoWidth;
    previewCanvas.height = video.videoHeight;
    previewCanvas.getContext("2d").drawImage(video,0,0,previewCanvas.width, previewCanvas.height);
    framePreview.src = previewCanvas.toDataURL("image/jpeg");
    framePreview.style.display = "block";
    instructionText.innerText = "Frame captured! Press Predict or say 'predict'.";
  }, "image/jpeg", 0.8);
}

// Predict (text first)
async function predictFromBlob(blob) {
  if (!blob || predicting) return;
  predicting = true;
  instructionText.innerText = "Predicting...";

  try {
    const formData = new FormData();
    formData.append("file", blob, "gesture.jpg");
    const response = await fetch("/predict", {method:"POST", body:formData});
    const result = await response.json();

    if (result.gesture) {
      gestureText.innerText = result.gesture;
      instructionText.innerText = "Gesture detected!";

      // Clear GIF initially
      gestureGif.src = "";
    } else {
      gestureText.innerText = result.error || "Not recognized!";
      instructionText.innerText = "Try again!";
      gestureGif.src = "";
    }
  } catch (err) {
    console.error("Prediction error:", err);
    gestureText.innerText = "Prediction error!";
    gestureGif.src = "";
    instructionText.innerText = "Try again!";
  } finally {
    predicting = false;
  }
}

// Auto capture loop (every 2s)
autoCaptureBtn.addEventListener("click", () => {
  if (autoCaptureInterval) {
    clearInterval(autoCaptureInterval);
    autoCaptureInterval = null;
    autoCaptureBtn.innerText = "🤖 Auto";
    instructionText.innerText = "Auto capture stopped.";
  } else {
    autoCaptureInterval = setInterval(() => {
      captureFrame();
      predictFromBlob(lastCapturedBlob);
    }, 2000);
    autoCaptureBtn.innerText = "⏹ Stop Auto";
    instructionText.innerText = "Auto capture started.";
  }
});

// Upload file
imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (!file) return;
  lastCapturedBlob = file;
  framePreview.src = URL.createObjectURL(file);
  framePreview.style.display = "block";
  predictFromBlob(file);
});

// Buttons
captureBtn.addEventListener("click", captureFrame);
predictBtn.addEventListener("click", () => predictFromBlob(lastCapturedBlob));

// Text to GIF
textToGifBtn.addEventListener("click", async () => {
  const text = textToGifInput.value.trim();
  if (!text) return;

  try {
    const response = await fetch(`/text_to_gif?text=${encodeURIComponent(text)}`);
    const data = await response.json();
    if (data.gif) gestureGif.src = data.gif;
    else gestureGif.src = "";
  } catch (err) {
    console.error("GIF fetch error:", err);
    gestureGif.src = "";
  }
});

// Voice commands
function startVoiceCommands() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  let lastCommandTime = 0;

  recognition.onresult = (event) => {
    const now = Date.now();
    if (now - lastCommandTime < 200) return;
    lastCommandTime = now;
    const transcript = event.results[event.results.length-1][0].transcript.trim().toLowerCase();
    if (transcript.includes("capture")) captureFrame();
    else if (transcript.includes("predict")) predictFromBlob(lastCapturedBlob);
  };
  recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
  recognition.onend = () => recognition.start();
  recognition.start();
}

// Initialize
startWebcam();
startVoiceCommands();
