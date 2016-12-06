var express = require('express');
var app = express();
var path = require('path');
app.use(express.static('public'));

app.listen(3000);

app.get("/greeting", function (req, res) {
    res.send("Hello, " + req.query.name + "! I'm server");
});

app.get("/notes", function (req, res) {
    var notes = [
        {text: "1. First note"},
        {text: "2. Second note"},
        {text: "3. Third note"}
    ];
    res.send(notes);
})