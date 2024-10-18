const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const TRASH_DIR = path.join(__dirname, 'trash');

/* Create trash folder if it doesn't exist  */
(async () => {
    try {
        await fs.mkdir(TRASH_DIR, { recursive: true });
        // console.log('Trash folder is ready.');
    } catch (err) {
        if (err.code !== 'EEXIST') {
            console.error('Error creating trash folder:', err);
        }
    }
})();

/* Endpoint to move a file to the trash */
router.post('/trash', async (req, res) => {
    const { filePath } = req.body;

    if (!filePath) {
        return res.status(400).send('File path is required.');
    }
    const fileName = path.basename(filePath);
    const trashFilePath = path.join(TRASH_DIR, fileName);
    try {
        await fs.rename(filePath, trashFilePath);
        res.send(`Moved ${fileName} to trash.`);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send(`File not found: ${filePath}`);
        }
        res.status(500).send(`Error moving file to trash: ${err.message}`);
    }
});

/* Endpoint to restore a file from trash */
router.post('/restore', async (req, res) => {
    const { fileName } = req.body;
    if (!fileName) {
        return res.status(400).send('File name is required.');
    }
    const trashFilePath = path.join(TRASH_DIR, fileName);
    const originalFilePath = path.join(__dirname, fileName);
    try {
        await fs.rename(trashFilePath, originalFilePath);
        res.send(`Restored ${fileName} from trash.`);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).send(`File not found in trash: ${fileName}`);
        }
        res.status(500).send(`Error restoring file from trash: ${err.message}`);
    }
});

/* Endpoint to list all files in the trash */
router.get('/trash', async (req, res) => {
    try {
        const files = await fs.readdir(TRASH_DIR);
        res.json(files);
    } catch (err) {
        res.status(500).send('Unable to scan trash: ' + err);
    }
});

/* Optional: Endpoint to empty the trash */
router.delete('/trash', async (req, res) => {
    try {
        const files = await fs.readdir(TRASH_DIR);
        await Promise.all(files.map(file => fs.unlink(path.join(TRASH_DIR, file))));
        res.send('Trash emptied.');
    } catch (err) {
        res.status(500).send(`Error emptying trash: ${err.message}`);
    }
});

module.exports = router;
