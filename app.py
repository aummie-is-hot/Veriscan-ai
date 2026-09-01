import os
import tempfile

from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mov', 'webm', 'avi', 'mkv'}

# Initialize Gemini from the local environment; never commit credentials.
API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    raise RuntimeError('GEMINI_API_KEY is not configured. Add it to .env or the process environment.')
client = genai.Client(api_key=API_KEY)

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/app')
@app.route('/APP')
def index():
    return render_template('index.html')

@app.route('/assistant')
@app.route('/ASSISTANT')
def assistant():
    return render_template('chatbot.html')

@app.route('/upload')
@app.route('/UPLOAD')
def upload():
    return render_template('upload.html')

@app.route('/settings')
@app.route('/SETTINGS')
def settings():
    return render_template('settings.html')

@app.route('/analyze-video', methods=['POST'])
def analyze_video():
    uploaded_file = request.files.get('video')
    if not uploaded_file or not uploaded_file.filename:
        return jsonify({'error': 'Choose a video file before analyzing.'}), 400

    extension = uploaded_file.filename.rsplit('.', 1)[-1].lower() if '.' in uploaded_file.filename else ''
    if extension not in ALLOWED_VIDEO_EXTENSIONS:
        return jsonify({'error': 'Unsupported video type. Use MP4, MOV, WebM, AVI, or MKV.'}), 400

    temporary_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{extension}') as temporary_file:
            temporary_path = temporary_file.name
            uploaded_file.save(temporary_path)

        video_file = client.files.upload(file=temporary_path)
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[video_file, (
                'Analyze this video as an assistive, neutral observation. Return concise JSON with keys: '
                'summary (string), observed_context (array of strings), observable_metrics (array of objects with '
                'name and value), stress_cue_score (integer 0-100), stress_cue_samples (array of 8 integers from '
                '0-100 for a simple timeline chart), signal_profile (array with exactly four objects using labels '
                'Motion, Vocal energy, Facial activity, Speech activity and integer values from 0-100), '
                'signal_quality_score (integer 0-100), limitations (array of strings). '
                'Only describe directly observable audiovisual content and uncertainty. Do not infer identity, '
                'intent, mental state as fact, deception, criminality, guilt, innocence, or risk. The stress score '
                'must be labeled as an estimate of observable stress-related cues, not a measurement of internal '
                'stress. Never provide a '
                'guilty/not-guilty score or confidence. Mention that human review is required for consequential decisions.'
            )]
        )
        return jsonify({'analysis': response.text})
    except Exception as error:
        return jsonify({'error': f'Video analysis failed: {error}'}), 502
    finally:
        if temporary_path and os.path.exists(temporary_path):
            os.remove(temporary_path)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # System prompt to give the AI context about VeriScan AI
        system_instruction = (
            "You are VeriScan Assistant, an AI built into the VeriScan AI telemetry dashboard. "
            "You help users analyze body language metrics, stress scores, facial action units (AU04/AU12), "
            "and fidget scores extracted by MediaPipe."
        )

        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=user_message,
            config={
                'system_instruction': system_instruction
            }
        )

        return jsonify({'reply': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate-verdict', methods=['POST'])
def generate_verdict():
    data = request.get_json(silent=True) or {}
    metrics = data.get('metrics')
    if not isinstance(metrics, dict):
        return jsonify({'error': 'Session metrics are required.'}), 400

    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=(
                'Create a concise, detailed, neutral summary of this live behavioral telemetry session. '
                'Return JSON with keys: headline (string), summary (string), observations (array of strings), '
                'metric_interpretation (array of strings), next_steps (array of strings), confidence_note (string). '
                f'Session metrics: {metrics}. Only discuss observable signal patterns and data quality. '
                'Do not infer personality, intent, deception, mental state as fact, criminality, guilt, innocence, '
                'or risk. Do not call this a verdict about a person. Explain that stress values are estimates of '
                'observable cues and that human review is required for consequential decisions.'
            )
        )
        return jsonify({'verdict': response.text})
    except Exception as error:
        return jsonify({'error': f'Could not generate session summary: {error}'}), 502

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', 5500)))

    