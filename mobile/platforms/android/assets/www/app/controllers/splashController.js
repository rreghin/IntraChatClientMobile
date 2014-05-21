(function () {'use strict';

    var splashController = function ($rootScope, $window, $location, $interval, ClientService) {
        console.log('SplashController');
        
        var readyCheck;
        readyCheck = $interval(function () {
            if ($rootScope.isPhoneGapLoaded) {
                $interval.cancel(readyCheck);
                // verifica se o dispositivo tem suporte a WebSockets
                if ((typeof($window.WebSocket) === 'function') || ('WebSocket' in $window)) {
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
                } else {
                    $window.alert("Error! Your browser does NOT support HTML5 Web Sockets.");
                }
            }
        }, 1000);

    };
              
    splashController.$inject = ["$rootScope", "$window", "$location", "$interval", "ClientService"];
              
    angular.module("webClient").controller('SplashController', splashController);

}());
