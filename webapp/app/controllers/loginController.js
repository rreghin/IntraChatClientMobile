(function () {'use strict';
              
    var loginController = function ($rootScope, $scope, $location, ClientService) {
        console.log('LoginController');

        if (!ClientService.doNeedLogin()) {
            console.log('voltando para /main');
            $location.path('/main');
            return;
        }

        $scope.serveraddress = $location.host() + ':' + $location.port();
        $scope.credentials = { username: 'administrador', password: 'abc123' };
        
        $rootScope.loginButtonStatus = "";
        $rootScope.newMessageClass = "noNewMessage";
        $rootScope.newMessageCount = 0;
        
        ClientService.justSentMessages = {};

        $scope.login = function () {
            if ($rootScope.loginButtonStatus === "") {
                $rootScope.loginButtonStatus = "disabled";
                ClientService.login($scope.serveraddress, $scope.credentials.username, $scope.credentials.password);
            }
        };
        
    };
              
    loginController.$inject = ["$rootScope", "$scope", "$location", "ClientService"];

    angular.module("webClient").controller('LoginController', loginController);
    
}());
