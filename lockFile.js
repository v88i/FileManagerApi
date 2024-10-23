// install proper-lockfile // 

/*	Unlock Portion  */

const fs = require('fs');
const fcntl = require('node-fcntl');

// const filePath = 'yourfile.txt';
const fd = fs.openSync(filePath, 'r+');

fcntl.lock(fd, fcntl.LOCK_EX, (err) => {
    if (err) {
        console.error('Could not lock file:', err);
        return;
    }

    console.log('File locked. Performing operations...');

    // Perform file operations here

    // Unlock the file after operations
    fcntl.unlock(fd, (err) => {
        if (err) {
            console.error('Could not unlock file:', err);
        } else {
            console.log('File unlocked.');
        }
        fs.closeSync(fd);
    });
});






/*	Lock Portion	*/
const lockfile = require('proper-lockfile');

const filePath = 'yourfile.txt';

async function lockFile() {
    try {
        /* Acquire the lock */
        await lockfile.lock(filePath);
        console.log('File locked.');

        // Perform file operations here

    } catch (err) {
        console.error('Error locking the file:', err);
    } finally {
        /* Always release the lock */
        try {
            await lockfile.unlock(filePath);
            console.log('File unlocked.');
        } catch (err) {
            console.error('Error unlocking the file:', err);
        }
    }
}

lockFile();
