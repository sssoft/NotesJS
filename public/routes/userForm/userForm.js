angular.module('app')
    .controller("UserFormCtrl", function($scope, $http, $location) {
        $scope.user = {};

        $scope.submitForm = function() {
            $http.post("/users", $scope.user)
                .success(function(data) {
                    console.log("saved!");
                    $location.path("/");
                });
        }
    });

angular.module('app').directive("matchTo", function() {
    return {
        require: "ngModel",
        scope: { otherValue: "=matchTo" },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.matchTo = function(modelValue) {
                return modelValue == scope.otherValue;
            };
            scope.$watch("otherValue", function() {
                ngModel.$validate();
            });
        }
    };
});

angular.module('app').directive('uniqueUser', function($http, $q) {
    var timer;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {
            ngModel.$asyncValidators.unique =
                function(modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    return $http.get('/checkUser?user=' + value).
                    then(function(response) {
                        if (!response.data) {
                            return $q.reject();
                        }
                        return true;
                    });
                };
        }
    };
});