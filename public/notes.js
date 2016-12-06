angular.module('app', []);

(function() {
    angular.module('app').controller('NotesController', ['$http', NotesController]);

    function NotesController($http) {
        var self = this;
        self.notes = [];

        var update = function () {
            $http.get("/notes")
                .success(function (notes) {
                    self.notes = notes;
                })
        };

        update();
    }
})();