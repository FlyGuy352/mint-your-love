require('dotenv').config();
const fs = require('fs');
const { pinNftToIpfs } = require('./utils/uploadToPinata');
const express = require('express');
const next = require('next');
const formidable = require('formidable');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    //server.use(express.json());
    //server.use(express.urlencoded({ extended: true }));
    server.post('/pinNftToIpfs', async (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            const metadatas = Object.keys(files).length > 0 ? Object.values(files).map(file => {
                return {
                    name: fields.name, description: fields.description, attributes: {
                        tags: Object.keys(fields).filter(key => key.startsWith('tag')).map(key => fields[key])
                    }, fileStream: fs.createReadStream(file.filepath)
                };
            }) : [{ name: fields.name, description: fields.description, attributes: { eventDate: fields.date } }];
            try {
                const ipfsHashes = await pinNftToIpfs(metadatas);
                res.status(200).json({ success: true, ipfsHashes });
            } catch (error) {
                res.status(200).json({ error });
            }
        });
    });
    server.get('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(port, error => {
        if (error) {
            throw error;
        }
    });
}).catch(error => {
    if (error) {
        throw error;
    }
});