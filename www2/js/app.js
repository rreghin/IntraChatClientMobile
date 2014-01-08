'use strict';

// Declare app level module which depends on filters, and services
angular.module('webClient', [
  'ngRoute',
  'webClient.filters',
  'webClient.services',
  'webClient.directives',
  'webClient.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'main'});
  $routeProvider.when('/main', {templateUrl: 'partials/main.html', controller: 'main'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
