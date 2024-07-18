const express = require('express');

const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});


// API Route - Get all notes
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => {
    console.log(data)
    res.json(JSON.parse(data))})
  });
  
  app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (req.body) {
      const newNote = { id: uuidv4(), title, text };
      readAndAppend(newNote, './db/db.json')
    } else{
      res.error('error adding note')
    }
  }
  
);

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});