'use strict';

webClient.factory('SessionService', function() {
	//debugger;
	console.log('SessionService');
	return {
		get: function(key) {
			return sessionStorage.getItem(key);
		},
		set: function(key, value) {
			return sessionStorage.setItem(key, value);
		},
		del: function(key) {
			return sessionStorage.removeItem(key);
		}
	};
});

webClient.factory('StorageService', function() {
	//debugger;
	console.log('StorageService');
	return {
		get: function(key) {
			return localStorage.getItem(key);
		},
		set: function(key, value) {
			return localStorage.setItem(key, value);
		},
		del: function(key) {
			return localStorage.removeItem(key);
		}
	};
});

webClient.factory('FlashService', function($rootScope) {
	return {
		show: function(message) {
			$rootScope.flash = message;
			$rootScope.$apply();
		},
		clear: function() {
			$rootScope.flash = '';
		}
	};
});

webClient.factory('ProgressService', function($rootScope) {
	return {
		show: function(message) {
			$rootScope.progress = message;
			$rootScope.$apply();
		},
		clear: function() {
			$rootScope.progress = '';
		}
	};
});

webClient.factory('AuthenticationService', function($rootScope, $location, $interval, SessionService, FlashService, ProgressService) {
	//debugger;
	console.log('AuthenticationService');
	return {
		login: function(serveraddress, username, password) {
			if (serveraddress !== '') {
				//debugger;
				// inicializa sessao do cliente, mas nao conecta ainda
				$rootScope.intrachat = new CICClientSession(
												serveraddress,
												username,
												password,
												false);
				// liga eventos do cliente
				$rootScope.intrachat.onConnect = function() {
					console.log('CONECTADO');
					FlashService.clear();
					$rootScope.connecting = false;
					$rootScope.authenticating = true;
					$rootScope.loading = false;
				};

				$rootScope.intrachat.onDisconnect = function() {
					console.log('DESCONECTADO');
					//FlashService.show('DESCONECTADO');
					$rootScope.connecting = false;
					$rootScope.authenticating = false;
					$rootScope.loading = false;
			    	$interval(function() {
				    	console.log('indo para /login');
				    	$location.path('/login');
				    }, 0, 1);
				};

				$rootScope.intrachat.onError = function(error) {
					console.log('ERRO: ' + error.data);
					FlashService.show('ERRO: ' + error.data);
					//alert('ERROR! ' + error.data);
					$rootScope.connecting = false;
					$rootScope.authenticating = false;
					$rootScope.loading = false;
				};

	            $rootScope.intrachat.onAuthenticationOk = function() {
					FlashService.clear();
					console.log('AUTENTICADO: ' 
						+ $rootScope.intrachat.ServerInfo.Name 
						+ ':' + $rootScope.intrachat.ServerInfo.ServerID 
						+ ' (' + $rootScope.intrachat.ServerInfo.VersionInfo + ')');
					$rootScope.connecting = false;
					$rootScope.authenticating = false;
					$rootScope.loading = true;
					// envia NOOP para o servidor, e quando ele voltar 
					// é porque todos os pedidos anteriores ja retornaram,
					// entao devemos ir para a janela principal da aplicacao
					$rootScope.pendingNOOP = $rootScope.intrachat.sendNOOPPacket();
					ProgressService.show('Carregando listas iniciais...');
	            };

	            $rootScope.intrachat.onAuthenticationFailed = function(errornumber, errormessage) {
					console.log('FALHA NA AUTENTICACAO: ' + errormessage);
					FlashService.show(errormessage);
					//alert('FALHA NA AUTENTICACAO: ' + errormessage);
					$rootScope.connecting = false;
					$rootScope.authenticating = false;
					$rootScope.loading = false;
	            };

			    $rootScope.intrachat.onPacket = function(packet) {
			    	//debugger;
					switch (packet.Command) {
						// verifica se é o PacketID que estavamos esperando...
						case CIC_COMMAND_BACK_AND_FORTH:
							if (packet.PacketID === $rootScope.pendingNOOP.PacketID) {
								$rootScope.loading = false;
								ProgressService.clear();
						    	$interval(function() {
							    	console.log('indo para /main');
							    	$location.path('/main');
							    }, 0, 1);
							}
							break;
					}
			    };

				/*$rootScope.intrachat.onUnitCount = function(count) {
					if ($rootScope.loading) {
						ProgressService.show('Carregando lista de unidades...');
					}
				};*/

				$rootScope.intrachat.onUserCount = function(count) {
					if ($rootScope.loading) {
						ProgressService.show('Carregando lista de usuários...');
					}
				};

				/*$rootScope.intrachat.onFolderCount = function(count) {
					if ($rootScope.loading) {
						ProgressService.show('Carregando lista de pastas...');
					}
				};*/

				$rootScope.intrachat.onMessageCount = function(count) {
					if ($rootScope.loading) {
						ProgressService.show('Carregando lista de mensagens...');
					}
				};

				$rootScope.intrachat.onFileCount = function(count) {
					if ($rootScope.loading) {
						ProgressService.show('Carregando lista de arquivos...');
					}
				};

				$rootScope.intrachat.onRoomCount = function(count) {
					if ($rootScope.loading) {
						ProgressService.show('Carregando lista de salas...');
					}
				};

	            // agora sim conecta
				$rootScope.connecting = true;
				$rootScope.authenticating = false;
				$rootScope.loading = false;

	            $rootScope.intrachat.ServerSecure = ($location.protocol().toUpperCase()==='HTTPS');
	            //$rootScope.intrachat.logPackets = true;
	            $rootScope.intrachat.connect();
			}
		},
		logout: function() {
			$rootScope.intrachat.disconnect();
		},
		isConnecting: function() {
			return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.connecting);
		},
		isAuthenticating: function() {
			return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.authenticating);
		},
		isLoading: function() {
			return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.loading);
		},
		isConnected: function() {
			return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.intrachat.isConnected);
		},
		isAuthenticated: function() {
			return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.intrachat.isConnected && $rootScope.intrachat.isAuthenticated);
		},
		doNeedLogin: function() {
			//debugger;
			return (   $rootScope.intrachat === undefined 
					|| $rootScope.intrachat === null
					|| $rootScope.connecting
					|| $rootScope.authenticating
					|| $rootScope.loading
					|| !$rootScope.intrachat.isConnected
					|| !$rootScope.intrachat.isAuthenticated);
		}
	};
});