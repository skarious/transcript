const { PythonShell } = require('python-shell');
const axios = require('axios');
const { file: tmpFile } = require('tmp-promise');
const fs = require('fs').promises;
const path = require('path');

class TranscriptionService {
  async transcribeFromUrl(url) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const { path: tmpPath, cleanup } = await tmpFile({ postfix: '.mp3' });
      
      await fs.writeFile(tmpPath, response.data);
      
      try {
        const result = await this.transcribeFile(tmpPath);
        await cleanup();
        return result;
      } catch (error) {
        await cleanup();
        throw error;
      }
    } catch (error) {
      throw new Error(`Error processing audio from URL: ${error.message}`);
    }
  }

  async transcribeFromBuffer(buffer) {
    try {
      const { path: tmpPath, cleanup } = await tmpFile({ postfix: '.mp3' });
      
      await fs.writeFile(tmpPath, buffer);
      
      try {
        const result = await this.transcribeFile(tmpPath);
        await cleanup();
        return result;
      } catch (error) {
        await cleanup();
        throw error;
      }
    } catch (error) {
      throw new Error(`Error processing audio buffer: ${error.message}`);
    }
  }

  async transcribeFile(filePath) {
    return new Promise((resolve, reject) => {
      let options = {
        mode: 'json',
        pythonPath: 'python',
        scriptPath: path.join(__dirname, '..'),
        args: [filePath]
      };

      PythonShell.run('whisper_transcribe.py', options).then(results => {
        if (results && results[0]) {
          if (results[0].error) {
            reject(new Error(results[0].error));
          } else {
            // Solo devolvemos el texto
            resolve({
              text: results[0].text,
              success: true
            });
          }
        } else {
          reject(new Error('No transcription result'));
        }
      }).catch(err => {
        reject(new Error(`Error transcribing audio: ${err.message}`));
      });
    });
  }
}

module.exports = new TranscriptionService();