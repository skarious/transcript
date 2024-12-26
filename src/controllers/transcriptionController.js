const transcriptionService = require('../services/transcriptionService');
const logger = require('../utils/logger');

class TranscriptionController {
    async transcribeFromUrl(req, res) {
        try {
            const { url } = req.body;
            const { language } = req.query;

            logger.info(`📝 Iniciando transcripción desde URL: ${url}${language ? ` en ${language}` : ''}`);
            
            const result = await transcriptionService.transcribeFromUrl(url, language);
            
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

            const { language } = req.query;

            logger.info(`📝 Iniciando transcripción de archivo: ${req.file.originalname}${language ? ` en ${language}` : ''}`);
            const result = await transcriptionService.transcribeFromBuffer(req.file.buffer, language);
            
            logger.info(`✅ Transcripción completada exitosamente`);
            res.json(result);
        } catch (error) {
            logger.error(`❌ Error en transcripción de archivo: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TranscriptionController();
