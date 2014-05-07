'use strict';

webClient.controller('LoginController', function($scope, $location, AuthenticationService) {
	//debugger;
	console.log('LoginController');

	if (!AuthenticationService.doNeedLogin()) {
		console.log('voltando para /main');
		$location.path('/main');
		return;
	}

	$scope.serveraddress = $location.host() + ':' + $location.port();
	$scope.credentials = { username: 'administrador', password: 'abc123' }

	$scope.login = function() {
		AuthenticationService.login($scope.serveraddress, $scope.credentials.username, $scope.credentials.password);
	};

});
