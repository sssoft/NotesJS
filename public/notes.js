angular.module('app', []);

(function() {
    angular.module('app').controller('NotesController', ['$http', NotesController]);

    function NotesController($http) {
        var self = this;
        self.notes = [];

        var update = function() {
            $http.get("/notes")
                .success(function (notes) {
                    self.notes = notes;
                })
        };
        update();

        self.add = function () {
            var note = {text: self.text};
            $http.post("/notes", note)
                .success(function () {
                    self.text = "";
                    update();
                });
        };

        self.remove = function(id) {
            $http.delete("/notes", {params: {'id' : id}})
                .success(function () {
                    update();
                });
        };

        self.top = function (id) {
            $http.put("/notes", {'id' : id})
                .success(function () {
                    update();
                });
        }
    }
})();