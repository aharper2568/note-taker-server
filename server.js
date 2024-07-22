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
  console.info(`${req.method} request received for notes`); //confirm get method
  readFromFile('./db/db.json').then((data) => { //read from json
    console.log(data) //confirm data grabbed
    res.json(JSON.parse(data))})
  });
  
  app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`); //confirm post method
    const { title, text } = req.body; //object deconstruction for req.body
    if (req.body) { // if req.body exists
      const newNote = { id: uuidv4(), title, text }; //make newNote with unique id
      readAndAppend(newNote, './db/db.json'); //append newNote
      readFromFile('./db/db.json').then((data)=> { //re-read JSON to page
        res.json(JSON.parse(data));
      })
    } else{
      res.error('error adding note')
    }
  }
  
);

app.get('*', (req, res) => { // router to handle any directory parameter and send user back to index
  res.sendFile(__dirname + '/public/index.html');
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});