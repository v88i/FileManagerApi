const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/* Define directories  */
const baseDirectory = path.join(__dirname, '../shared_files');
const sharedDirectory = path.join(baseDirectory, 'shared');  // Shared By Me
const receivedDirectory = path.join(baseDirectory, 'received'); // Shared With Me

/* Array to be used as Dummy database to store shared files */
let sharedFiles = []; // Will use and connect this with MongoDB later

/* Route to share a file */
router.post('/share', (req, res) => {
    const { filename, method, recipient } = req.body;

    if (!filename || !method || !recipient) {
        return res.status(400).json({ error: 'Filename, method, and recipient are required.' });
    }

    /* Logic for sharing based on the method */
    switch (method.toLowerCase()) {
        // case 'email':
        //     /* Here, we should implement our email sending logic. For example, using nodemailer or another email service.  */
        //     console.log(`Sending ${filename} to ${recipient} via email.`);
        //     break;

        case 'link':
            /* Generate a shareable link (simulated here)  */
            const shareableLink = `http://localhost:3000/shared/${filename}`;
            console.log(`Generated shareable link: ${shareableLink}`);
            return res.status(200).json({ message: `File ${filename} shared. Link: ${shareableLink}` });

        // case 'social':
        //     /* Here you might integrate with a social media API  */
        //     console.log(`Sharing ${filename} on social media for ${recipient}.`);
        //     break;

        default:
            return res.status(400).json({ error: 'Invalid sharing method. Supported methods: email, link, social.' });
    }

    const sharedFilePath = path.join(sharedDirectory, filename);
    
    /* Simulating saving file metadata, Here you could implement logic to move or copy the actual file */
    fs.writeFileSync(sharedFilePath, 'This is a shared file content.'); // Simulated file creation

    res.status(200).json({ message: `File ${filename} shared using ${method}.` });
});

/* Route to receive a file  */
router.post('/receive', (req, res) => {
    const { filename, sender } = req.body;

    if (!filename || !sender) {
        return res.status(400).json({ error: 'Filename and sender are required.' });
    }

    const receivedFilePath = path.join(receivedDirectory, filename);

    // Simulating storing received file metadata
    fs.writeFileSync(receivedFilePath, 'This is a received file content.'); // Simulated file creation

    res.status(200).json({ message: `File ${filename} received from ${sender}.` });
});

/* Route to get shared files (optional) */
router.get('/shared-files', (req, res) => {
    res.status(200).json(sharedFiles);
});

/* Route to get received files  */
router.get('/received-files', (req, res) => {
    const files = fs.readdirSync(receivedDirectory);
    res.status(200).json(files);
});

module.exports = router;
