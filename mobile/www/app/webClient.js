(function () {'use strict';
    
    angular.module("webClient", ["ngRoute"]);
     
    angular.module("webClient").config(["$routeProvider", function ($routeProvider) {
        $routeProvider
            .when('/splash', {
                templateUrl: 'app/views/splash.html',
                controller: 'SplashController'
            })
            .when('/login', {
                templateUrl: 'app/views/login.html',
                controller: 'LoginController'
            })
            .when('/main', {
                templateUrl: 'app/views/main.html',
                controller: 'MainController'
            })
            .when('/users', {
                templateUrl: 'app/views/users.html',
                controller: 'UsersController'
            })
            .when('/messages', {
                templateUrl: 'app/views/messages.html',
                controller: 'MessagesController'
            })
            .otherwise({ redirectTo: '/splash' });
    }]);

    angular.module("webClient").run(["$rootScope", function ($rootScope) {
        console.log('webClient.run');
        
        $rootScope.intrachat = null;

        $rootScope.splashing = true;
        $rootScope.connecting = false;
        $rootScope.authenticating = false;
        $rootScope.loading = false;
        
        $rootScope.isPhoneGap = false;
        $rootScope.isPhoneGapLoaded = false;
        $.getScript("cordova.js")
            .done(function () {
                $rootScope.isPhoneGap = true;
                document.addEventListener("deviceready", function () {
                    console.log("Cordova/PhoneGap ready - mobile mode");
                    $rootScope.isPhoneGapLoaded = true;
                }, false);
            })
            .fail(function () {
                console.log("Cordova/PhoneGap failed - browser mode");
                $rootScope.isPhoneGapLoaded = true;
            });
        
    }]);
              
}());