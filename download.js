const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const uploadDir = path.join(__dirname, 'Recent');

// Add this route to handle file downloads
// router.get('/api/download/:filename', (req, res) => {
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename; // Get the filename from the request parameters
    const filePath = path.join(uploadDir, filename); // Create the full file path

    // Check if the file exists
    fs.stat(filePath, (err) => {
        if (err) {
            return res.status(404).send('File not found.'); // Send a 404 if the file does not exist
        }
        
        // Send the file to the client
        res.download(filePath, (err) => {
            if (err) {
                return res.status(500).send('Error in downloading file.'); // Handle any errors during download
            }
        });
    });
});

/* Add this route to list all uploaded files */
router.get('/download', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan files: ' + err);
        }
        res.json(files);
    });
});

module.exports = router;
