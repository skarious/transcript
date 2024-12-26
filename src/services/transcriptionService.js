const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const logger = require('../utils/logger');

// Lista de idiomas soportados
const SUPPORTED_LANGUAGES = {
    'es': 'Spanish',
    'en': 'English',
    'pt': 'Portuguese'
};

const validateLanguage = (language) => {
    if (language && !SUPPORTED_LANGUAGES[language]) {
        throw new Error(`Idioma no soportado. Idiomas disponibles: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`);
    }
    return true;
};

const transcribeAudio = async (audioPath, language = null) => {
    // Usar el idioma proporcionado o el valor por defecto de las variables de entorno
    const selectedLanguage = language || process.env.DEFAULT_LANGUAGE || 'es';
    validateLanguage(selectedLanguage);

    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, '..', 'whisper_transcribe.py');
        const args = [audioPath, selectedLanguage];
        
        logger.info(`🌍 Usando idioma: ${SUPPORTED_LANGUAGES[selectedLanguage]}`);

        const pythonProcess = spawn('python', [pythonScript, ...args]);
        let outputData = '';
        let errorData = '';

        pythonProcess.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            logger.error(`🐍 Python Error: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(errorData || 'Error en la transcripción'));
                return;
            }

            try {
                const result = JSON.parse(outputData);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    });
};

class TranscriptionService {
  async transcribeFromUrl(url, language = null) {
    validateLanguage(language);

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const tempFile = path.join(__dirname, '..', '..', 'uploads', `temp_${Date.now()}.mp3`);
      
      try {
        fs.writeFileSync(tempFile, response.data);
        const result = await transcribeAudio(tempFile, language);
        return result;
      } finally {
        // Limpiar archivo temporal
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
    } catch (error) {
      throw new Error(`Error processing audio from URL: ${error.message}`);
    }
  }

  async transcribeFromBuffer(buffer, language = null) {
    validateLanguage(language);

    try {
      const tempFile = path.join(__dirname, '..', '..', 'uploads', `temp_${Date.now()}.mp3`);
      
      try {
        fs.writeFileSync(tempFile, buffer);
        const result = await transcribeAudio(tempFile, language);
        return result;
      } finally {
        // Limpiar archivo temporal
        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      }
    } catch (error) {
      throw new Error(`Error processing audio buffer: ${error.message}`);
    }
  }
}

module.exports = new TranscriptionService();