(function () {'use strict';
    
    angular.module("webClient", ["ngRoute"]);
     
    angular.module("webClient").config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/splash', {
                templateUrl: '/app/views/splash.html',
                controller: 'SplashController'
            })
            .when('/login', {
                templateUrl: '/app/views/login.html',
                controller: 'LoginController'
            })
            .when('/main', {
                templateUrl: '/app/views/main.html',
                controller: 'MainController'
            })
            .when('/users', {
                templateUrl: '/app/views/users.html',
                controller: 'UsersController'
            })
            .when('/messages', {
                templateUrl: '/app/views/messages.html',
                controller: 'MessagesController'
            })
            .otherwise({ redirectTo: '/splash' });
    }]);

    angular.module("webClient").run(function ($rootScope) {
        console.log('webClient.run');
        
        $rootScope.intrachat = null;

        $rootScope.splashing = true;
        $rootScope.connecting = false;
        $rootScope.authenticating = false;
        $rootScope.loading = false;
    });
              
}());