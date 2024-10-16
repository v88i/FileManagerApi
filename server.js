const express = require('express');
const uploadRoutes = require('./upload');
const downloadRoutes = require('./download');
const trashRoutes = require('./trash'); 
const folderRoutes = require('./folder') // Import the folder routes
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

/*  Serve static files from the frontend directory  */
app.use(express.static(path.join(__dirname, 'frontend')));  // Created a separate directory for Frontend portion
// app.get('/', (req, res) => {
//     res.send('Welcome to the File Upload API! Go to /api/upload to upload files.');
//  });-

/*  Middleware for routes   */
app.use('/api', uploadRoutes);
app.use('/api', downloadRoutes);
app.use('/api', folderRoutes); // Use folder routes
app.use('/api', trashRoutes);
// app.use('./upload') // can also use this but this may create problem later
// app.use('./download')

/*  Start the server  */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
