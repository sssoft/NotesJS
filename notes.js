angular.module('app', [])
    .controller('NotesController', function() {
       this.notes = [
           {text: "Note number One"},
           {text: "Note number Two"},
           {text: "Note number Three"}
       ];
    });