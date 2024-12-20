# Usa una imagen base con Node.js y Python 3.11
FROM nikolaik/python-nodejs:python3.11-nodejs18

# Instala ffmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json primero para aprovechar el caché de Docker
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Actualiza pip e instala wheel
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copia requirements.txt y instala dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Crea el directorio para los modelos
RUN mkdir -p models

# Expone el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]