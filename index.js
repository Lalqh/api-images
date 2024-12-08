import express from 'express';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = 4000;
const HOST = 'https://compactmcbe.online';

// Obtén la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '10000mb' }));
app.use(express.urlencoded({ limit: '10000mb', extended: true }));

// Configura Express para servir archivos estáticos desde el directorio "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
    const { img, apiKey } = req.body;

    console.log('Received request with API key:', apiKey);

    if (apiKey !== process.env.API_KEY) {
        console.log('Unauthorized access attempt with API key:', apiKey);
        return res.status(401).send('Unauthorized');
    }

    if (!img) {
        console.log('No image provided in the request');
        return res.status(400).send('Image is required');
    }

    const base64Data = img.replace(/^data:image\/png;base64,/, "");

    const fileName = `${crypto.randomBytes(16).toString('hex')}.png`;

    fs.writeFile(`./images/${fileName}`, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving the image:', err);
            return res.status(500).send('Error saving the image');
        }
        const imageUrl = `${HOST}:${PORT}/images/${fileName}`;
        console.log('Image saved successfully as:', fileName);
        res.status(200).send({ message: 'Image saved successfully', url: imageUrl });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});