'use strict';

/* Controllers */

angular.module('webClient.controllers', []).
    controller('main', function($scope, $routeParams, $location) {
        
        // DEBUG (inicializar com alguns valores para testes)
        $scope.loginServerAddress = 'localhost';
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
            
            var parts = $scope.loginServerAddress.split(':');
            var endereco = parts[0];
            var porta = parts[1] || 55000;
            
            // guarda as informacoes para quemm sabe usar durante um auto-cadastro
            $scope.serverAddress = endereco;
            $scope.serverPort = porta;
            $scope.userId = $scope.loginUserId;
            $scope.userPassword = $scope.loginUserPassword;
            
            //alert('Conectar a ' + endereco + ':' + porta);
            
            $scope.client = new CICClientSession($scope.serverAddress, $scope.serverPort, 
                                                 $scope.userId, $scope.userPassword,
                                                 false, false);
                                                 
            // DESLIGA SSL por enquanto...
            $scope.client.ServerSecure = false;
                                                 
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
