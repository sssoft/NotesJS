var module = angular.module('app', ['dndLists', 'ngRoute']);
module.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'routes/notes/notes.html',
            controller: 'NotesController'
        })
        .when('/section/:name', {
            templateUrl: 'routes/viewSection/viewSection.html',
            controller: 'ViewSectionController'
        })
        .when('/:section?', {
            templateUrl: 'routes/notes/notes.html',
            controller: 'NotesController'
        })
        .otherwise({redirectTo: "/"});

});