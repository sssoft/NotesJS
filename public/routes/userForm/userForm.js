angular.module('app')
    .controller("UserFormCtrl", function($scope, $http) {
        $scope.user = {};
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