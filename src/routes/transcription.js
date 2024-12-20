const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const transcriptionController = require('../controllers/transcriptionController');
const logger = require('../utils/logger');

const router = express.Router();

// Middleware para manejar datos binarios de n8n
const handleN8nBinaryData = async (req, res, next) => {
    try {
        // Verifica si los datos vienen como buffer directo
        if (req.body && Buffer.isBuffer(req.body)) {
            logger.info('📦 Recibiendo datos binarios directos');
            req.file = {
                buffer: req.body,
                originalname: 'audio.mp3'
            };
            return next();
        }

        // Si no es buffer directo, usa multer
        const upload = multer({
            storage: multer.memoryStorage(),
            fileFilter: (req, file, cb) => {
                logger.info(`📁 Tipo de archivo recibido: ${file.mimetype}`);
                cb(null, true);
            }
        }).single('data');

        upload(req, res, (err) => {
            if (err) {
                logger.error(`❌ Error al procesar archivo: ${err.message}`);
                return res.status(400).json({ error: err.message });
            }
            next();
        });
    } catch (error) {
        logger.error(`❌ Error en middleware: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

// Configuración para recibir datos binarios crudos
router.use('/file', express.raw({ 
    type: ['audio/*', 'application/octet-stream'],
    limit: '50mb'
}));

// Ruta para transcribir desde URL
router.post('/url', 
    body('url').isURL(),
    transcriptionController.transcribeFromUrl
);

// Ruta para transcribir desde archivo
router.post('/file', 
    handleN8nBinaryData,
    transcriptionController.transcribeFromFile
);

module.exports = router;
