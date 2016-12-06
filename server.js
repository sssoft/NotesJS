var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');

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
    fs.readFile("notes.json", function (err, result) {
       if (result) {
           result = "" + result; // Convert Object to String
           // remove last \n in file
           result = result.substring(0, result.length - 1);
           result = result.split('\n').join(',');
           result = '[' + result + ']';
           res.send(result);
       } else {
           res.end();
       }
    });
});

app.post("/notes", function (req, res) {
    if (!req.session.notes) {
        req.session.notes = [];
        req.session.last_note_id = 0;
    }
    var note = req.body;
    note.id = req.session.last_note_id;
    req.session.last_note_id++;

   var noteText = JSON.stringify(note) + "\n";
   fs.appendFile("notes.json", noteText, function (err) {
       if (err) {
           console.log("Something is wrong");
       }
       res.end();
   });
});

app.delete("/notes", function (req, res) {
    var id = req.query.id;

    fs.readFile("notes.json", function (err, result) {
        if (result) {
            result = "" + result; // Convert Object to String
            // remove last \n in file
            result = result.substring(0, result.length - 1);
            result = result.split('\n');

            var updatedNotesList = [];
            for (var i = 0; i < result.length; i++) {
                console.log(result[i]);
                updatedNotesList.push(JSON.parse(result[i]));
            }

            var noteText = "";
            for (var i = 0; i < updatedNotesList.length; i++) {
                if (updatedNotesList[i].id != id) {
                    noteText = noteText + JSON.stringify(updatedNotesList[i]) + "\n";
                }
            }

            fs.writeFile('notes.json', noteText, function (err) {
                if (err) {
                    console.log("Something is wrong");
                }
                res.end();
            });
        } else {
            res.end();
        }
    });
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