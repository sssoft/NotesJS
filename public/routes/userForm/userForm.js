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

angular.module('app').directive('uniqueUser', function($http, $timeout) {
    var timer;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngModel, function(value) {
                if (timer) $timeout.cancel(timer);
                timer = $timeout(function(){
                    $http.get('/checkUser?user=' + value)
                        .success(function(result) {
                            ctrl.$setValidity('unique', result);
                        });
                }, 200);
            })
        }
    }
});