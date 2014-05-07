(function () {'use strict';

    var splashController = function ($rootScope, $location, $interval, ClientService) {
        //debugger;
        console.log('SplashController');

        // verifica se o dispositivo tem suporte a WebSockets
        if (!window.hasOwnProperty('WebSocket') || (typeof WebSocket !== 'function')) {
            $window.alert("Error! Your browser does NOT support HTML5 Web Sockets.");
        } else {
            var milliseconds = 5000, path = '/login';

            if (!$rootScope.splashing) {
                if (ClientService.doNeedLogin()) {
                    milliseconds = 0;
                    path = '/login';
                } else {
                    milliseconds = 0;
                    path = '/main';
                }
            }

            $interval(function () {
                console.log('indo para ' + path + ' em ' + milliseconds + 'ms');
                $location.path(path);
            }, milliseconds, 1);

            $rootScope.splashing = false; // ja mostrou o splash
        }
    };
              
    splashController.$inject = ["$rootScope", "$location", "$interval", "ClientService"];
              
    angular.module("webClient").controller('SplashController', splashController);

}());
