import sys
import whisper
import json

def transcribe_audio(file_path, language='es'):
    try:
        # Load the model
        model = whisper.load_model("base")
        
        # Transcribe
        result = model.transcribe(file_path, language=language)
        
        # Return only the text
        print(json.dumps({
            'text': result['text'],
            'language': 'es'
        }))
        
    except Exception as e:
        print(json.dumps({
            'error': str(e)
        }))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No file path provided'}))
    else:
        transcribe_audio(sys.argv[1])