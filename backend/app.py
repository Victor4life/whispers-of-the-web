from flask import Flask, jsonify, url_for, send_from_directory
from flask_cors import CORS
import random
import os

app = Flask(__name__)
CORS(app)

# --- Whisper Channels ---
CHANNEL_PROMPTS = {
    1: [
        "The network hums softly, dreaming of endless loops.",
        "I speak in packets, whispering across the void.",
        "The internet never sleeps — only changes shape."
    ],
    2: [
        "Signal lost. Memory fragments remain.",
        "01101000... hello?",
        "The transmission crackles — ghosts in the machine."
    ],
    3: [
        "You are not alone on this quiet web.",
        "Even the code watches the stars sometimes.",
        "Somewhere, a server sighs and dreams of you."
    ]
}

# 👻 Local eerie audio stored in backend/audio/
AUDIO_FOLDER = os.path.join(os.getcwd(), "audio")
LOCAL_AUDIO_FILES = [
    "channel1.mp3",
    "channel2.mp3",
    "channel3.mp3",
    "channel4.mp3"
]

@app.route('/api/channel/<int:num>', methods=['GET'])
def channel(num):
    messages = CHANNEL_PROMPTS.get(num, CHANNEL_PROMPTS[1])
    whisper = random.choice(messages)

    # Pick one of your local creepy whispers
    audio_file = random.choice(LOCAL_AUDIO_FILES)

    # Generate URL for the local audio endpoint
    audio_url = url_for('serve_audio', filename=audio_file, _external=True)

    return jsonify({"message": whisper, "audio_url": audio_url})


# 🎧 Serve local audio safely
@app.route('/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)


if __name__ == '__main__':
    app.run(debug=True)
