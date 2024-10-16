const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/* Define the base directory for folders (for demonstration purposes)  */
const baseDir = path.join(__dirname, 'Folders');

/* Ensure the base directory exists  */
if (!fs.existsSync(baseDir)){
    fs.mkdirSync(baseDir);
}

/* Create a new folder */
router.post('/folders', (req, res) => {
    const folderName = req.body.name; // Expecting { "name": "folderName" }
    if (!folderName) {
        return res.status(400).json({ error: 'Folder name is required.' });
    }
    const folderPath = path.join(baseDir, folderName);
    if (fs.existsSync(folderPath)) {
        return res.status(409).json({ error: 'Folder already exists.' });
    }
    fs.mkdirSync(folderPath);
    res.status(201).json({ message: 'Folder created successfully.' });
});

/* Read all folders */
router.get('/folders', (req, res) => {
    fs.readdir(baseDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Could not list folders.' });
        }
        res.status(200).json(files);
    });
});

/* Update (rename) a folder  */
router.put('/folders/:oldName', (req, res) => {
    const oldName = req.params.oldName;
    const newName = req.body.name; // Expecting { "name": "newFolderName" }
    if (!newName) {
        return res.status(400).json({ error: 'New folder name is required.' });
    }
    const oldFolderPath = path.join(baseDir, oldName);
    const newFolderPath = path.join(baseDir, newName);
    if (!fs.existsSync(oldFolderPath)) {
        return res.status(404).json({ error: 'Folder not found.' });
    }

    if (fs.existsSync(newFolderPath)) {
        return res.status(409).json({ error: 'New folder name already exists.' });
    }
    fs.renameSync(oldFolderPath, newFolderPath);
    res.status(200).json({ message: 'Folder renamed successfully.' });
});

/* Delete a folder  */
router.delete('/folders/:folderName', (req, res) => {
    const folderName = req.params.folderName;
    const folderPath = path.join(baseDir, folderName);
    if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: 'Folder not found.' });
    }
    fs.rmdirSync(folderPath, { recursive: true });
    res.status(200).json({ message: 'Folder deleted successfully.' });
});

module.exports = router;
