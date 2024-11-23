import express from 'express';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
    const { img, apiKey } = req.body;

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).send('Unauthorized');
    }

    if (!img) {
        return res.status(400).send('Image is required');
    }

    const base64Data = img.replace(/^data:image\/png;base64,/, "");

    const fileName = `${crypto.randomBytes(16).toString('hex')}.png`;

    fs.writeFile(`./images/${fileName}`, base64Data, 'base64', (err) => {
        if (err) {
            return res.status(500).send('Error saving the image');
        }
        res.send('Image saved successfully');
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});