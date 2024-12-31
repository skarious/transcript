# Audio Transcription API

Una API robusta para transcripción de audio utilizando Whisper, diseñada para ser fácil de usar y desplegar con Docker.

## Características

- Transcripción de audio desde archivos o URLs
- Soporte para múltiples formatos de audio
- Integración con n8n y otras herramientas de automatización
- Logs detallados del proceso de transcripción
- Fácil despliegue con Docker
- API RESTful con endpoints bien documentados

## Tecnologías Utilizadas

- Node.js
- Express.js
- Python
- OpenAI Whisper
- Docker
- Winston (para logging)

## Inicio Rápido con Docker

```bash
# Descargar la imagen
docker pull skarious/audio-transcription-api:0.0.1

# Ejecutar el contenedor
docker run -p 3000:3000 skarious/audio-transcription-api:0.0.1
```

O usando docker-compose:

```yaml
version: '3.8'
services:
  api:
    image: skarious/audio-transcription-api:latest
    ports:
      - "3000:3000"
    volumes:
      - ./models:/app/models
      - ./uploads:/app/uploads
    environment:
      - NODE_ENV=production
      - PORT=3000
```

## API Endpoints

### Transcribir desde URL

```bash
POST /api/transcription/url
Content-Type: application/json

{
    "url": "https://ejemplo.com/audio.mp3"
}
```

### Transcribir archivo

```bash
POST /api/transcription/file
Content-Type: multipart/form-data

Form data:
- data: [archivo de audio]
```

## Configuración

Variables de entorno disponibles:

```env
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
DEFAULT_LANGUAGE=es  # Idioma por defecto para transcripciones
```

### Configuración de Idiomas

La API soporta transcripción en múltiples idiomas:

- `es`: Español (por defecto)
- `en`: Inglés
- `pt`: Portugués

Puedes configurar el idioma de dos formas:

1. **Global (por defecto)**: Configura la variable de entorno `DEFAULT_LANGUAGE` en tu archivo `.env`
2. **Por petición**: Especifica el idioma en el cuerpo de la petición

### Ejemplos de Uso de Idiomas

#### Transcribir desde URL con idioma específico

```bash
POST /api/transcription/url
Content-Type: application/json

{
    "url": "https://ejemplo.com/audio.mp3",
    "language": "en"  # Opcional: sobrescribe DEFAULT_LANGUAGE
}
```

#### Transcribir archivo con idioma específico

```bash
POST /api/transcription/file
Content-Type: multipart/form-data

Form data:
- data: [archivo de audio]
- language: en  # Opcional: sobrescribe DEFAULT_LANGUAGE
```

## Integración con n8n

1. Usar el nodo "HTTP Request"
2. Configurar:
   - Method: POST
   - URL: http://tu-servidor:3000/api/transcription/file
   - Body Content Type: n8n Binary File
   - Binary Data: archivo de audio a transcribir

## Volúmenes Docker

- `/app/models`: Almacena modelos de Whisper
- `/app/uploads`: Archivos temporales de audio

## Respuestas de la API

### Éxito
```json
{
    "text": "Texto transcrito del audio",
    "language": "es",
    "success": true
}
```

### Error
```json
{
    "error": "Descripción del error"
}
```

### Errores Específicos de Idioma
```json
{
    "error": "Idioma no soportado. Idiomas disponibles: es, en, pt"
}
```

## Límites y Consideraciones

- Tamaño máximo de archivo: 50MB
- Formatos soportados: MP3, WAV, M4A, etc.
- Tiempo de procesamiento: Varía según la duración del audio

## Seguridad

- No se almacenan archivos de audio permanentemente
- Los archivos temporales se eliminan después de la transcripción
- Logs sin información sensible

## Logs

La API proporciona logs detallados:
```
2024-12-20 11:39:50 info: Server running on port 3000
2024-12-20 11:39:51 info: POST /api/transcription/file
2024-12-20 11:39:51 info: Iniciando transcripción de archivo
2024-12-20 11:39:55 info: Transcripción completada exitosamente
```

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

### Resumen de la licencia

Esta licencia permite a otros:

- **Compartir** — copiar y redistribuir el material en cualquier medio o formato
- **Adaptar** — remezclar, transformar y construir a partir del material

Bajo los siguientes términos:

- **Atribución** — Debe dar crédito adecuado, proporcionar un enlace a la licencia e indicar si se realizaron cambios.
- **NoComercial** — No puede utilizar el material con fines comerciales.
- **CompartirIgual** — Si remezcla, transforma o crea a partir del material, debe distribuir sus contribuciones bajo la misma licencia que el original.

[Ver texto completo de la licencia](LICENSE)

## Soporte

Para soporte, abrir un issue en el repositorio o contactar a los mantenedores.
