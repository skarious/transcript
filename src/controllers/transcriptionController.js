const transcriptionService = require('../services/transcriptionService');
const logger = require('../utils/logger');

class TranscriptionController {
    async transcribeFromUrl(req, res) {
        try {
            const { url } = req.body;
            logger.info(`📝 Iniciando transcripción desde URL: ${url}`);
            
            const result = await transcriptionService.transcribeFromUrl(url);
            
            logger.info(`✅ Transcripción completada exitosamente`);
            res.json(result);
        } catch (error) {
            logger.error(`❌ Error en transcripción desde URL: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async transcribeFromFile(req, res) {
        try {
            if (!req.file) {
                logger.warn('❌ No se recibió ningún archivo');
                return res.status(400).json({ error: 'No file uploaded' });
            }

            logger.info(`📝 Iniciando transcripción de archivo: ${req.file.originalname}`);
            const result = await transcriptionService.transcribeFromBuffer(req.file.buffer);
            
            logger.info(`✅ Transcripción completada exitosamente`);
            res.json(result);
        } catch (error) {
            logger.error(`❌ Error en transcripción de archivo: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TranscriptionController();
