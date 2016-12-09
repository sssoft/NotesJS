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
    db.collection('users', function(error, users) {
        db.users = users;
    });
});

app.listen(3000);

function setUserQuery(req) {
    req.query.userName = req.session.userName || "demo";
}

app.get("/greeting", function (req, res) {
    res.send("Hello, " + req.query.name + "! I'm server");
});

app.get("/notes", function (req, res) {
    setUserQuery(req);
    db.notes.find(req.query).toArray(function (err, items) {
        res.send(items);
    })
});

app.post("/notes", function (req, res) {
    var note = req.body;
    note.date = new Date();
    note.userName = req.session.userName || "demo";

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
    var userName = req.session.userName || "demo";
    db.users.find({userName:userName})
        .toArray(function(err, items) {
            var user = items[0];
            if (user.sections === undefined) {
                user.sections = [];
            }
            res.send(user.sections);
        });
});

app.post("/sections/replace", function(req, resp) {
    var userName = req.session.userName || "demo";
    db.users.update({userName:userName}, {$set:{sections:req.body}},
        function() {
            resp.end();
        });
});

app.get("/checkUser", function(req, res) {
    var cursor = db.users.find({userName: req.query.user});
    var unique = true;
    cursor.on("data", function() {
        unique = false;
    });
    cursor.once("end", function () {
        res.send(unique && req.query.user.length > 2);
    });
});

app.get("/authUser", function (req, res) {
   res.send(req.session.userName);
});

app.post("/users", function(req, res) {
    db.users.insert(req.body, function(resp) {
        req.session.userName = req.body.userName;
        res.end();
    });
});

app.post("/login", function(req, res) {
    db.users.find({userName:req.body.login, password:req.body.password})
        .toArray(function(err, items) {
            if (items.length > 0) {
                req.session.userName = req.body.login;
            }
            res.send(items.length > 0);
        });
});

app.get("/logout", function(req, res) {
    req.session.userName = null;
    res.end();
});