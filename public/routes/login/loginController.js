angular.module('app').controller("LoginController", function($scope, $location, $route, UserService) {
    $scope.loggedIn = UserService.loggedIn;
    $scope.login = function() {
        UserService.login($scope.username, $scope.password)
            .then(
                function() {
                    $scope.loggedIn = UserService.loggedIn;
                    $location.path("/");
                    $route.reload();
                },
                function() {
                    $scope.wrongPassword = true;
                    $timeout(function() {
                        $scope.wrongPassword = false;
                    }, 1000);
                }
            );
    };
    $scope.logout = function() {
        UserService.logout().then(function() {
            $scope.loggedIn = UserService.loggedIn;
            $location.path("/");
            $route.reload();
        });
    };

    UserService.refreshLogin()
        .then(function () {
            $scope.loggedIn = UserService.loggedIn;
            $scope.username = UserService.userName;
        });
});