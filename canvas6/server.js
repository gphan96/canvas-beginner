const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;

app.get('/dir', (req, res) => {
   const dirPath = req.query.path;
   const files = fs.readdirSync(dirPath);
   res.json(files);
});

app.use((req, res) => {
   const url = req.url;
   const method = req.method;

   if (url === '/') {
      res.setHeader('Content-Type', 'text/html');
      fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
         if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
         }
      res.writeHead(200);
      res.end(data);
      });
   } else {
    // Handle requests for static files
      const filePath = path.join(__dirname, url);
      const fileExtension = path.extname(filePath);

      let contentType = 'text/html';
      switch (fileExtension) {
      // case '.jpg':
         case '.ico':
            contentType = 'image/x-icon';
            break;
         case '.png':
            contentType = 'image/png';
            break;
         case '.css':
            contentType = 'text/css';
            break;
         case '.js':
            contentType = 'application/javascript';
            break;
      }

      fs.readFile(filePath, (err, data) => {
         if (err) {
            res.writeHead(404);
            return res.end('File not found');
         }
         res.setHeader('Content-Type', contentType);
         res.writeHead(200);
         res.end(data);
      });
   }
});

app.listen(port, () => {
   console.log(`Server listening on port ${port}`);
});
