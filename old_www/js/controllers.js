'use strict';

/* Controllers */

angular.module('webClient.controllers', []).
    controller('main', function($scope, $routeParams, $location) {
        
        // DEBUG (inicializar com alguns valores para testes)
        $scope.loginServerAddress = '192.168.2.10';
        $scope.loginUserId = 'administrador';
        $scope.loginUserPassword = 'abc123';
        
        $scope.loginConnect = function() {
            if ($scope.loginServerAddress === undefined || $scope.loginServerAddress === '') {
                alert('É necessário informar o endereço do servidor');
                return;
            }
            if ($scope.loginUserId === undefined || $scope.loginUserId === '') {
                alert('É necessário informar o id do usuário');
                return;
            }
            if ($scope.loginUserPassword === undefined || $scope.loginUserPassword === '') {
                alert('É necessário informar a senha do usuário');
                return;
            }
            
            //alert('Conectar a ' + $scope.loginServerAddress);
            
            $scope.client = new CICClientSession($scope.loginServerAddress, 
                                                 $scope.loginUserId, $scope.loginUserPassword,
                                                 false, false);
                                                 
            // DESLIGA SSL por enquanto...
            $scope.client.ServerSecure = true;
                                                 
            $scope.client.onConnect = function() {
                alert('CONECTADO');
            };

            $scope.client.onDisconnect = function() {
                alert('DESCONECTADO');
            };

            $scope.client.onError = function(error) {
                alert('<span style="color: red;">ERRO:</span> ' + error.data); 
            };

            $scope.client.onAuthenticationOk = function() {
                alert('AUTENTICADO: ' + $scope.client.ServerInfo.Name + ':' + $scope.client.ServerInfo.ServerID + ' (' + $scope.client.ServerInfo.VersionInfo + ')');
            };

            // conecta manualmente agora
            $scope.client.connect();
            
            // vai pra view principal
            $location.path('/main');
        };
    });
