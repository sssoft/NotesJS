angular.module('app').factory("UserService", function($http, $q) {
    var service = {};
    service.userName = "";
    service.login = function(login, password) {
        var deferred = $q.defer();

        $http.post("/login", {login:login, password:password})
            .success(function(res) {
                if (res) {
                    service.loggedIn = true;
                    service.userName = login;
                    deferred.resolve("logged in");
                    console.log("logged in!");
                } else {
                    deferred.reject("wrong username/password");
                    console.log("wrong user/password!");
                }
            });
        return deferred.promise;
    };

    service.logout = function() {
        service.loggedIn = false;
        return $http.get("/logout");
    };

    service.refreshLogin = function () {
        var deferred = $q.defer();

        $http.get("/authUser")
            .success(function (res) {
                service.userName = res;
                service.loggedIn = !!res;
                deferred.resolve("logged in");
            });
        return deferred.promise;
    }

    return service;
});