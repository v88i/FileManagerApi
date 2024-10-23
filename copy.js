const fs = require('fs-extra'); // First Install this module

// Copy a file
fs.copy('sourcePath', 'destinationPath', err => {  // To be created and solved inside frontend
    if (err) {
        console.error('Error copying file:', err);
    } else {
        console.log('File copied successfully');
    }
});

// Copy a folder
fs.copy('sourcePath', 'destinationPath', err => {
    if (err) {
        console.error('Error copying folder:', err);
    } else {
        console.log('Folder copied successfully');
    }
}); 
