    const express = require('express');
    const fs = require('fs');
    const path = require('path');

    const router = express.Router();

    /*  Directory where uploaded files are stored   */
    const uploadDir = path.join(__dirname, 'Recent');
    const trashDir = path.join(__dirname, 'trash'); // Path to the trash directory

    // Create the trash directory if it doesn't exist
    if (!fs.existsSync(trashDir)) {
        fs.mkdirSync(trashDir);
    }

    /* Route to delete an uploaded file  */
    router.delete('/delete/:filename', (req, res) => {
        const filename = req.params.filename; // Get the filename from the URL parameters
        const filePath = path.join(uploadDir, filename); // Construct the full file path
        const trashFilePath = path.join(trashDir, filename);

        /* Check if the file exists   */
        fs.stat(filePath, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    // File does not exist
                    return res.status(404).json({ message: 'File not found.' });
                }
                // Some other error occurred
                return res.status(500).json({ message: 'Error checking file.', error: err });
            }

            /* If file exists, delete it  */
            // fs.unlink(filePath, (err) => {
            //     if (err) {
            //         return res.status(500).json({ message: 'Error deleting file.', error: err });
            //     }
            //     // File deleted successfully
            //     res.json({ message: 'File deleted successfully!' });
            // });

            /* If file exists, move it to the trash */
            fs.rename(filePath, trashFilePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error moving file to trash.', error: err });
                }
                // console.log(`Attempting to delete: ${filename}`);
                res.json({ message: 'File moved to trash successfully!' });  
            });

        });
    });

    module.exports = router;


