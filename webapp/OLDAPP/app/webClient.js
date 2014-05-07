'use strict';

var webClient = angular.module('webClient', ['ngRoute']);

webClient.config(function($routeProvider) {
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
        /*.when('/users', {
            templateUrl: '/app/views/users.html',
            controller: 'MainController'
        })*/
        .otherwise({ redirectTo: '/splash' });
});

webClient.run(function($rootScope, $location, SessionService) {
    console.log('webClient.run');

    $rootScope.intrachat = null;

    $rootScope.splashing = true;
    $rootScope.connecting = false;
    $rootScope.authenticating = false;
    $rootScope.loading = false;
});
