const fs = require('fs-extra');

// Move a file
fs.move('sourcePath', 'destinationPath', err => {
    if (err) {
        console.error('Error moving file:', err);
    } else {
        console.log('File moved successfully');
    }
});

// Move a folder
fs.move('sourcePath', 'destinationPath', err => {
    if (err) {
        console.error('Error moving folder:', err);
    } else {
        console.log('Folder moved successfully');
    }
});
