'use strict';

webClient.controller('SplashController', function($rootScope, $location, $interval, AuthenticationService) {
	//debugger;
	console.log('SplashController');

	// verifica se o dispositivo tem suporte a WebSockets
	if( !('WebSocket' in window) || (typeof(WebSocket) !== 'function') ) {
    	alert("Error! Your browser does NOT support HTML5 Web Sockets.");
    }
    else {
    	var milliseconds = 5000;
    	var path = '/login';

		if (!$rootScope.splashing) {
			if (AuthenticationService.doNeedLogin()) {
		    	milliseconds = 0;
		    	path = '/login';
		    }
		    else {
		    	milliseconds = 0;
		    	path = '/main';
		    }
		}

    	$interval(function() {
	    	console.log('indo para '+path+' em '+milliseconds+'ms');
	    	$location.path(path);
	    }, milliseconds, 1);

	    $rootScope.splashing = false; // ja mostrou o splash
    }
});

