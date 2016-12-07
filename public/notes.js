angular.module('app', ['dndLists']);

(function() {
    angular.module('app').controller('NotesController', ['$http', NotesController]);

    function NotesController($http) {
        var self = this;
        self.notes = [];
        self.newSection = "";

        var update = function() {
            var params = {params: {section: self.activeSection}};
            $http.get("/notes", params)
                .success(function (notes) {
                    self.notes = notes;
                })
        };
        update();

        self.add = function () {
            if (!self.text || self.text.length == 0) {
                return;
            }

            var note = {text: self.text, section: self.activeSection};
            $http.post("/notes", note)
                .success(function () {
                    self.text = "";
                    update();
                });
        };

        self.remove = function(id) {
            $http.delete("/notes", {params: {'id' : id}})
                .success(function (res) {
                    update();
                });
        };

        self.top = function (id) {
            $http.put("/notes", {'id' : id})
                .success(function () {
                    update();
                });
        };

        var readSections = function () {
            $http.get("/sections")
                .success(function (sections) {
                    self.sections = sections;
                    if (self.activeSection == null && self.sections.length > 0) {
                        self.activeSection = self.sections[0].title;
                    }
                    update();
                })
        };
        readSections();

        self.showSection = function(section) {
            self.activeSection = section.title;
            update();
        };

        self.writeSections = function() {
            if (self.sections && self.sections.length > 0) {
                $http.post("/sections/replace", self.sections);
            }
        };

        self.addSection = function() {
            if (self.newSection.length==0) {
                return;
            }
            for (var i = 0; i < self.sections.length; i++) { // check for duplicates
                if (self.sections[i].title == self.newSection) {
                    return;
                }
            }

            var section = {title: self.newSection};
            self.sections.unshift(section);
            self.activeSection = self.newSection;
            self.newSection = "";
            self.writeSections();
            update();
        };
    }
})();