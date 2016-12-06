var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'angular_notes',
    resave: true,
    saveUninitialized: true
}));

app.listen(3000);

app.get("/greeting", function (req, res) {
    res.send("Hello, " + req.query.name + "! I'm server");
});

app.get("/notes", function (req, res) {
    console.log("Notes:");
    console.log(req.session.notes || []);
    res.send(req.session.notes || []);
});

app.post("/notes", function (req, res) {
   if (!req.session.notes) {
       req.session.notes = [];
       req.session.last_note_id = 0;
   }
   var note = req.body;
   note.id = req.session.last_note_id;
   console.log(note.id + ". " + note);
   req.session.last_note_id++;
   req.session.notes.push(note);
   res.end();
});

app.delete("/notes", function (req, res) {
    var id = req.query.id;
    var notes = req.session.notes || [];
    var updatedNotesList = [];

    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id != id) {
            updatedNotesList.push(notes[i]);
        }
    }

    req.session.notes = updatedNotesList;
    res.end();
});

app.put("/notes", function (req, res) {
    var id = req.body.id;
    var notes = req.session.notes || [];
    var updatedNotesList = [];

    console.log(JSON.stringify(req.body));
    console.log('Send to top : ' + id);
    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id == id) {
            updatedNotesList.push(notes[i]);
        }
    }

    for (var i = 0; i < notes.length; i++) {
        if (notes[i].id != id) {
            updatedNotesList.push(notes[i]);
        }
    }

    console.log(updatedNotesList);
    req.session.notes = updatedNotesList;
    res.end();
});