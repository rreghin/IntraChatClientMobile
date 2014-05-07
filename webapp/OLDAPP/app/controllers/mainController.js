'use strict';

webClient.controller('MainController', function($rootScope, $scope, $location, AuthenticationService) {
	//debugger;
	console.log('MainController');

	if (AuthenticationService.doNeedLogin()) {
		console.log('voltando para /login');
		$location.path('/login');
		return;
	}

	$scope.includes = [
		{ title: 'IntraChat', url: '' },
		{ title: 'Usuários',  url: '/view/users.html' }
	];
	$scope.include = $scope.includes[0];

	$scope.optionAllUsers = function() {
		//debugger;
		$scope.include = $scope.includes[1];
	};

	$scope.logout = function() {
		AuthenticationService.logout();
	};

	/*var logo = $rootScope.intrachat.getServerLogo();
	if (logo !== undefined) {
		$scope.serverlogo = logo.Data; 
		$rootScope.$apply();
	}*/

});
