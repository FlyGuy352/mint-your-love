import fs from 'fs';
import { pinNftToIpfs } from '../../utils/uploadToPinata';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
    }
    const form = new formidable.IncomingForm();
    await new Promise(resolve => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                resolve(res.status(400).json({ error: err.message }));
            }
            const metadata = files.length === 1 ? {
                name: fields.name, description: fields.description, attributes: {
                    tags: Object.keys(fields).filter(key => key.startsWith('tag')).map(key => fields[key])
                }, fileStream: fs.createReadStream(files[0].filepath)
            } : { name: fields.name, description: fields.description, attributes: { eventDate: fields.date } };

            try {
                const { imgHash, jsonHash } = await pinNftToIpfs(metadata);
                resolve(res.status(200).json({ success: true, imgHash, jsonHash }));
            } catch (error) {
                resolve(res.status(200).json({ error: JSON.stringify(error) }));
            }
        });
    });
};