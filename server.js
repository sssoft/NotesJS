var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var ObjectID = require('mongodb').ObjectID;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'angular_notes',
    resave: true,
    saveUninitialized: true
}));

var db = new Db('notes_db', new Server('localhost', 27017, {safe: true}, {auto_reconnect: true}, {}));
db.open(function () {
    console.log('MongoDB is opened!');
    db.collection('notes', function (error, notes) {
        db.notes = notes;
    });
    db.collection('sections', function (error, sections) {
        db.sections = sections;
    })
});

app.listen(3000);

app.get("/greeting", function (req, res) {
    res.send("Hello, " + req.query.name + "! I'm server");
});

app.get("/notes", function (req, res) {
    db.notes.find(req.query).toArray(function (err, items) {
        res.send(items);
    })
});

app.post("/notes", function (req, res) {
    var note = req.body;
    note.date = new Date();

    var cursor = db.notes.find({}).sort({order: -1}).limit(1);
    cursor.on("data", function (last_note) {
        note.order = last_note.order + 1;

    });
    cursor.once("end", function () {
        if (note.order === undefined) {
            note.order = 0;
        }
        db.notes.insert(note);
        console.log(note);
        res.end();
    })
});

app.delete("/notes", function (req, res) {
    var id = new ObjectID(req.query.id);
    db.notes.remove({_id: id}, function (err) {
        if (err) {
            console.log(err);
            res.send("Failed");
        } else {
            res.send("Success");
        }
    });
});

app.put("/notes", function (req, res) {
    var id = req.body.id;
    var cursor = db.collection("notes").find({}).sort({order: 1}).limit(1);
    cursor.on("data", function (first_note) {
        var order = first_note.order - 1;
        db.notes.updateOne({_id: ObjectID(id)}, {$set:{order: order}});
        console.log("Reorder note[" + id + "].order = " + order);
        res.end();
    });
});


app.get("/sections", function (req, res) {
    db.sections.find(req.query).toArray(function (err, items) {
        res.send(items);
    });
});

app.post("/sections/replace", function(req, resp) {
    if (req.body.length == 0) { // do not clear the list
        res.end();
    }
    db.sections.remove({}, function(err, res) {
        if (err) {
            console.log(err);
        }
        db.sections.insert(req.body, function(err, res) {
            if (err) {
                console.log("Error after insert", err);
            }
            resp.end();
        });
    });
});

app.get("/checkUser", function(req,res) {
    res.send(req.query.user.length > 2);
});