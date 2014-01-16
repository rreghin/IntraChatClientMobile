var webClient = angular.module("webClient", []);

webClient.config(function($routeProvider) {
	$routeProvider.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginController'
		});
	$routeProvider.otherwise({ redirectTo: '/login' })
});

webClient.controller('LoginController', function() {

});

