const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const uploadDir = path.join(__dirname, 'Recent');

const favoritesDir = path.join(__dirname, 'Favorites');
/* Ensure favoritesDir exists  */
fs.mkdir(favoritesDir, { recursive: true }).catch(err => {
    console.error('Could not create favorites directory:', err);
});

/* Endpoint to add a file to favorites  */
router.post('/favorites', async (req, res) => {
    const { filename } = req.body;
    const originalFilePath = path.join(uploadDir, filename);
    const favoriteFilePath = path.join(favoritesDir, filename);

    try {
        await fs.stat(originalFilePath);  //Check if the original file exists 
        /* Move the file to the favorites folder  */
        await fs.rename(originalFilePath, favoriteFilePath);
        res.json({ message: `${filename} added to favorites!` });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ message: 'File not found.' });
        }
        res.status(500).json({ message: 'Error adding file to favorites.', error: err });
    }
});

/* Endpoint to remove a file from favorites  */
router.delete('/favorites/:filename', async (req, res) => {
    const { filename } = req.params;
    const favoriteFilePath = path.join(favoritesDir, filename);

    try {
        await fs.stat(favoriteFilePath);
        await fs.unlink(favoriteFilePath);
        res.json({ message: `${filename} removed from favorites!` });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ message: 'File not found in favorites.' });
        }
        res.status(500).json({ message: 'Error removing file from favorites.', error: err });
    }
});

/* Endpoint to list all files in favorites */
router.get('/favorites', async (req, res) => {
    try {
        const files = await fs.readdir(favoritesDir);
        res.json(files);
    } catch (err) {
        res.status(500).json({ message: 'Unable to scan favorites.', error: err });
    }
});

module.exports = router;
