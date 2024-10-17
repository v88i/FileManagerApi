const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

/*  Create the uploads directory if it doesn't exist  */
const uploadDir = path.join(__dirname, 'Recent');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

/* Configure multer for file storage  */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const originalName = path.basename(file.originalname, path.extname(file.originalname));
        const extension = path.extname(file.originalname);

        let newFilename = `${originalName}${extension}`;   // Base filename to start checking for conflicts
        let count = 1;
    
        while (fs.existsSync(path.join(uploadDir, newFilename))) {    // Check if the file already exists and modify the filename accordingly
            newFilename = `${originalName}[${count}]${extension}`;
            count++;
        }
        cb(null, newFilename);
    },
});
const upload = multer({ storage: storage });

/* Define the file upload route to be used in case of API  */
// router.post('/api/upload', upload.single('file'), (req, res) => {  
router.post('/upload', upload.single('file'), (req, res) => {  
    if (!req.file) {
        console.log('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }
    res.json({
        message: 'File uploaded successfully!',
        filename: req.file.filename,
    });
});

// // Error handling middleware can be added here if required 
// app.use((err, req, res, next) => {
//     if (err instanceof multer.MulterError) {
//         return res.status(500).json(err);
//     } else if (err) {
//         return res.status(500).send(err);    
//     }
//     next();    // The next() function is called to pass control to the next middleware if no errors are found.
// });

module.exports = router;