angular.module('app', []);

angular.module('app').controller('NotesController', NotesController);

function NotesController() {
    this.notes = [
        {text: "Note number One"},
        {text: "Note number Two"},
        {text: "Note number Three"}
    ];
}