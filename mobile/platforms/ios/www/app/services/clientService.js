(function () {'use strict';
    
    // ================================================================================================================
    var clientService = function ($rootScope, $window, $document, $location, $interval, SessionService, FlashService, ProgressService, NavigationService, AllRecipients, SelectedRecipients, AllNewMessages, AllArchivedMessages, AllSentMessages) {
        console.log('ClientService');
                
        var factory = {};
        
        var findCSSRule = function (rulename) {
            for (var s=0; s<$document[0].styleSheets.length; s++) {
                var mysheet = $document[0].styleSheets[s];
                var myrules = mysheet.cssRules ? mysheet.cssRules: mysheet.rules;
                for (var i=0; i<myrules.length; i++) {
                    var selectorname = myrules[i].selectorText;
                    if (selectorname === rulename) {
                        return myrules[i];
                    }
                }
            }
            return null;
        };
        
        factory.justSentMessages = {};
        
        factory.statusClasses = {};
        
        factory.getStatusClass = function (userid) {
            var classname = 'status_' + CryptoJS.MD5(userid);
            return factory.statusClasses[classname];
        };
        
        factory.setStatusClass = function (userid, status) {
            var classname = 'status_' + CryptoJS.MD5(userid);
        };
        
        factory.buildStatusClasses = function () {
            var baseclass = findCSSRule('.status_online');
            $("<style>")
                .prop("type", "text/css")
                .html(baseclass.html() /*"\
                #my-window {\
                    position: fixed;\
                    z-index: 102;\
                    display:none;\
                    top:50%;\
                    left:50%;\
                }"*/)
                .appendTo("head");
        };
        
        factory.statusClasses = ["status_offline", "status_online", "status_busy", "status_away", "status_onchat"];
        
        factory.setSelectorAttribute = function (selectorid, attribute, value) {
            var selector = $(selectorid);
            if (selector && selector.length > 0) {
                selector.attr(attribute, value);
            }
        };

        factory.setSelectorClass = function (selectorid, newclass) {
            var selector = $(selectorid);
            if (selector && selector.length > 0 && !selector.hasClass(newclass)) {
                selector.addClass(newclass);
                for (var i=0; i<factory.statusClasses.length; i++) {
                    if (factory.statusClasses[i] !== newclass) {
                        selector.removeClass(factory.statusClasses[i]);
                    }
                }
            }
        };

        factory.getUserStatusClass = function (userid) {
            if (userid.substr(0,3) === 'UN:' || userid.substr(0,3) === 'ST:' || userid === '*') return "";
            var user = $rootScope.intrachat.OnLineUserList[userid];
            if (user) {
                if ((user.ChatCount||0) <= 0) {
                    switch (user.Status) {
                        case 0: return "status_online";
                        case 1: return "status_busy";
                        case 2: return "status_away";
                    }
                } else return "status_onchat";
            }
            return "status_offline";
        };
        
        factory.setUserStatusClass = function (userid, newclass) {
            var basename = 'user_' + CryptoJS.MD5(userid);
            factory.setSelectorClass('#tdp_' + basename, newclass);
            factory.setSelectorClass('#tdu_' + basename, newclass);
            factory.setSelectorClass('#tdb_' + basename, newclass);
        };
        
        factory.getUserPicture = function (userid, upic, doRequest) {
            if (!upic) upic = $rootScope.intrachat.getUserPicture(userid, doRequest);
            return ((upic === undefined || upic.Data === undefined) ? '/img/nopic.png' : 'data:image/png;base64,' + upic.Data);
        };
        
        factory.setUserPicture = function (userid, picture) {
            var pic = factory.getUserPicture(userid, picture);
            
            // atualiza tambem o usuario na lista de usuarios
            AllRecipients.forEach(function (key, index) {
                //debugger;
                if (key.id === userid) {
                    key.picture = pic;
                }
            });
            
            // atualiza tambem o usuario na lista de destinararios (se ele estiver nela)
            SelectedRecipients.forEach(function (key, index) {
                //debugger;
                if (key.id === userid) {
                    key.picture = pic;
                }
            });
            
            // atualiza tambem as mensagens
            AllNewMessages.forEach(function (key, index) {
                //debugger;
                if (key.fromuserid === userid) {
                    key.picture = pic;
                }
            });
            
            factory.setSelectorAttribute('#pic_user_' + CryptoJS.MD5(userid), 'src', pic);
           
            if (userid.toUpperCase() === $rootScope.intrachat.UserID.toUpperCase()) {
                //debugger;
                //factory.setSelectorAttribute('#userpicture', 'src', pic);
                $rootScope.localUserPicture = pic;
                if (!$rootScope.$$phase) $rootScope.$apply();
            }
        };
        
        factory.sendMessage = function (recipients, text, originalid, canreply) {
            var message = $rootScope.intrachat.sendMessage(recipients, text, originalid, canreply);
            factory.justSentMessages[message.PacketID] = text;
        };
        
        factory.archiveMessage = function (messageid) {
            var message = $rootScope.intrachat.NewMessageList[messageid];
            if (message !== undefined) {
                if (messageid > 0) {
                    $rootScope.intrachat.setMessageArchived(messageid);
                }
                
                // guardar a mensagem na lista (global) de mensagens arquivadas
                var user = $rootScope.intrachat.UserList[message.FromUserID];
                if (!user) {
                    user = {
                        UserID: message.FromUserID,
                        Name: (message.FromUserID !== '') ? message.FromUserID : 'Servidor IntraChat',
                        DeptUnit: ''
                    };
                }
                
                AllArchivedMessages.push({
                    messageid: message.MessageID,
                    timestamp: message.TimeStamp,
                    body: message.TextMessage,
                    canReply: (!!message.isReplyAllowed) ? '' : 'disabled',
                    fromuserid: user.UserID,
                    fromusername: user.Name,
                    fromuserdept: /*' (' +*/ user.DeptUnit /*+ ')'*/,
                    picture: factory.getUserPicture(user.UserID),
                    archived: true
                });
            
                delete $rootScope.intrachat.NewMessageList[messageid];
            }
        }
        
        factory.updateMessageCount = function (doAlert) {
            $rootScope.newMessageCount = Object.keys($rootScope.intrachat.NewMessageList).length;
            $rootScope.newMessageClass = ($rootScope.newMessageCount > 0) ? "hasNewMessage" : "noNewMessage";
            if (!$rootScope.$$phase) $rootScope.$apply();
            if (!!doAlert && $rootScope.newMessageCount > 0) {
                var player = $('#player');
                if (player && player[0]) {
                    player[0].load();
                    //player[0].pause();
                    //player[0].currentTime = 0;
                    player[0].play();
                }
            }
        };
        
        factory.clearRecipients = function () {
            SelectedRecipients.splice(0, SelectedRecipients.length); // se nao usar splice, nao limpa o array! nao usar =[] !
            $rootScope.SelectedEntities = [];            
        };
        
        factory.addRecipient = function (entity) {
            // so adionar se ainda nao estiver
            var alreadyIn = false;
            SelectedRecipients.forEach(function (key) {
                if (key.id === entity.id) {
                    alreadyIn = true;
                }
            });
            if (!alreadyIn) SelectedRecipients.push(entity);
            NavigationService.showView('write');
        };
        
        factory.removeRecipient = function (entity) {
            // remover o destinatario da lista
            SelectedRecipients.forEach(function (key, index) {
                if (key.id === entity.id) {
                    SelectedRecipients.splice(index, 1);
                    $('#'+key.uid).hide();
                }
            });
            if (SelectedRecipients.length === 0) {
                NavigationService.showView('users');
            }
        };
        
        factory.getRecipients = function (doClear) {
            var recipients = [];
            SelectedRecipients.forEach(function (entity) {
                recipients.push(entity.id);
            });
            if (!!doClear) {
                factory.clearRecipients();
            }
            return recipients;
        };
        
        factory.buildAllRecipients = function () {
            // limpa qualquer sujeira anterior
            AllRecipients.splice(0, AllRecipients.length);
            
            var unit = $rootScope.intrachat.getUnit($rootScope.intrachat.getUserUnitID($rootScope.intrachat.UserID.toUpperCase()));
            var isSupportUnit = (unit && !!unit.isSupport);

            if (!isSupportUnit) {
                // adiciona TODOS a lista
                AllRecipients.push({ 
                    id: '*',
                    uid: 'all_' + CryptoJS.MD5('*'),
                    name: 'TODOS (os usuários)',
                    dept: '',
                    full: 'TODOS (os usuários)',
                    visible: true,
                    order: 2,
                    picture: '/img/blank.png'
                });

                // adiciona unidades
                Object.keys($rootScope.intrachat.UnitList).forEach(function (key) {
                    var unit = this.UnitList[key];
                    if (unit.UnitID !== undefined && unit.Name !== undefined) {
                        AllRecipients.push({ 
                            id: 'UN:' + unit.UnitID,
                            uid: 'unit_' + CryptoJS.MD5(unit.UnitID),
                            name: 'Unidade: ' + unit.Name,
                            dept: '',
                            full: 'Unidade: ' + unit.Name,
                            visible: true,
                            order: 1,
                            picture: '/img/blank.png'
                        });
                    }
                }, $rootScope.intrachat);

                // adiciona setores
                var depts = {};
                Object.keys($rootScope.intrachat.UserList).forEach(function (key, index) {
                    var dept = this.UserList[key].Dept;
                    if (dept !== undefined) {
                        if (depts[dept] === undefined) {
                            AllRecipients.push({ 
                                id: 'ST:' + dept,
                                uid: 'dept_' + CryptoJS.MD5(dept),
                                name: 'Setor: ' + dept,
                                dept: '',
                                full: 'Setor: ' + dept,
                                visible: true,
                                order: 1,
                                picture: '/img/blank.png'
                            });
                            depts[dept] = index;
                        }
                    }
                }, $rootScope.intrachat);
            }

            // adiciona usuarios
            Object.keys($rootScope.intrachat.UserList).forEach(function (key) {
                var user = this.UserList[key];
                if (!isSupportUnit || user.UserID.localeCompare($rootScope.intrachat.UserID, undefined, {sensitivity: "base"})) {
                    AllRecipients.push({ 
                        id: user.UserID,
                        uid: 'user_' + CryptoJS.MD5(user.UserID),
                        name: user.Name,
                        dept: /*' (' +*/ user.DeptUnit /*+ ')'*/,
                        full: user.Name + ' (' + user.DeptUnit + ')',
                        visible: !user.isInvisible,
                        order: 0,
                        picture: factory.getUserPicture(key)
                    });
                }
            }, $rootScope.intrachat);
            
        };

        factory.buildNewMessages = function () {
            // limpa qualquer sujeira anterior
            AllNewMessages.splice(0, AllNewMessages.length);

            Object.keys($rootScope.intrachat.NewMessageList).forEach(function (key) {
                var message = $rootScope.intrachat.NewMessageList[key];
                
                var user = $rootScope.intrachat.UserList[message.FromUserID];
                if (!user) {
                    user = {
                        UserID: message.FromUserID,
                        Name: (message.FromUserID !== '') ? message.FromUserID : 'Servidor IntraChat',
                        DeptUnit: ''
                    };
                }
                
                AllNewMessages.push({
                    messageid: message.MessageID,
                    timestamp: message.TimeStamp,
                    body: message.TextMessage,
                    canReply: (!!message.isReplyAllowed) ? '' : 'disabled',
                    fromuserid: user.UserID,
                    fromusername: user.Name,
                    fromuserdept: /*' (' +*/ user.DeptUnit /*+ ')'*/,
                    picture: factory.getUserPicture(user.UserID),
                    archived: false
                });
            });

        };

        factory.login = function (serveraddress, username, password) {
            if (serveraddress !== '') {
                // limpa destinararios
                factory.clearRecipients();
                factory.justSentMessages = {};
                AllNewMessages.splice(0, AllNewMessages.length);
                AllArchivedMessages.splice(0, AllArchivedMessages.length);
                AllSentMessages.splice(0, AllSentMessages.length);
                
                // inicializa sessao do cliente, mas nao conecta ainda
                $rootScope.intrachat = new CICClientSession(serveraddress, username, password, false);
        
                // liga eventos do cliente
                $rootScope.intrachat.onConnect = function () {
                    console.log('CONECTADO');
                    FlashService.clear();
                    $rootScope.connecting = false;
                    $rootScope.authenticating = true;
                    $rootScope.loading = false;
                };

                $rootScope.intrachat.onDisconnect = function () {
                    console.log('DESCONECTADO');
                    //FlashService.show('DESCONECTADO');
                    $rootScope.connecting = false;
                    $rootScope.authenticating = false;
                    $rootScope.loading = false;
                    $interval(function () {
                        console.log('indo para /login');
                        $location.path('/login');
                    }, 0, 1);
                    $rootScope.loginButtonStatus = "";
                };

                $rootScope.intrachat.onError = function (error) {
                    console.log('ERRO: ' + error.data);
                    FlashService.show('ERRO: ' + error.data);
                    //alert('ERROR! ' + error.data);
                    $rootScope.connecting = false;
                    $rootScope.authenticating = false;
                    $rootScope.loading = false;
                    $rootScope.loginButtonStatus = "";
                };

                $rootScope.intrachat.onAuthenticationOk = function () {
                    FlashService.clear();
                    console.log('AUTENTICADO: ' 
                        + $rootScope.intrachat.ServerInfo.Name 
                        + ':' + $rootScope.intrachat.ServerInfo.ServerID 
                        + ' (' + $rootScope.intrachat.ServerInfo.VersionInfo + ')'
                        + ' Fingerprint: ' + $rootScope.intrachat.ServerInfo.Fingerprint);
                    $rootScope.connecting = false;
                    $rootScope.authenticating = false;
                    $rootScope.loading = true;
                    // envia NOOP para o servidor, e quando ele voltar 
                    // é porque todos os pedidos anteriores ja retornaram,
                    // entao devemos ir para a janela principal da aplicacao
                    $rootScope.pendingNOOP = $rootScope.intrachat.sendNOOPPacket();
                    ProgressService.show('Carregando listas iniciais...');
                };

                $rootScope.intrachat.onAuthenticationFailed = function (errornumber, errormessage) {
                    console.log('FALHA NA AUTENTICACAO: ' + errormessage);
                    FlashService.show(errormessage);
                    //alert('FALHA NA AUTENTICACAO: ' + errormessage);
                    $rootScope.connecting = false;
                    $rootScope.authenticating = false;
                    $rootScope.loading = false;
                    $rootScope.loginButtonStatus = "";
                };

                $rootScope.intrachat.onAutoRegisterAllowed = function() {
                    console.log('AUTO-REGISTRO HABILITADO');
                    FlashService.show('Usuário ainda não cadastrado');
                    $rootScope.connecting = false;
                    $rootScope.authenticating = false;
                    $rootScope.loading = false;
                    $rootScope.loginButtonStatus = "";
                };

                $rootScope.intrachat.onPacket = function (packet) {
                    switch (packet.Command) {
                        // verifica se é o PacketID que estavamos esperando...
                        case CIC_COMMAND_BACK_AND_FORTH:
                            if (packet.PacketID === $rootScope.pendingNOOP.PacketID) {
                                $rootScope.loading = false;
                                ProgressService.clear();
                                $interval(function () {
                                    console.log('indo para /main');
                                    $location.path('/main');
                                }, 0, 1);
                            }
                            break;
                    }
                };
                
                $rootScope.intrachat.onServerLogo = function (logo) {
                    //factory.setSelectorAttribute('#serverlogo', 'src', ...);
                    $rootScope.localServerLogo = ((logo === undefined || logo.Data === undefined) ? '/logo.png' : 'data:image/png;base64,' + logo.Data);
                    if (!$rootScope.$$phase) $rootScope.$apply();
                };

                /*$rootScope.intrachat.onUnitCount = function (count) {
                    if ($rootScope.loading) {
                        ProgressService.show('Carregando lista de unidades...');
                    }
                };*/
                
                $rootScope.intrachat.onUserConfig = function (config) {
                    // nada por enquanto...
                };

                $rootScope.intrachat.onUserCount = function (count) {
                    if ($rootScope.loading) {
                        ProgressService.show('Carregando lista de usuários...');
                    }
                    if (count < 0) {
                        factory.buildAllRecipients();
                        //factory.setSelectorAttribute('#userpicture', 'src', ...);

                        var user = $rootScope.intrachat.UserList[$rootScope.intrachat.UserID.toUpperCase()];
                        $rootScope.localUserInfo = user.Name + ' (' + user.DeptUnit + ')';
                        $rootScope.localUserPicture = factory.getUserPicture(user.UserID, undefined, true);
                        if (!$rootScope.$$phase) $rootScope.$apply();
                    }
                };

                $rootScope.intrachat.onUser = function (user) {
                    // nada ainda...
                };
                
                $rootScope.intrachat.onUserDeleted = function (user) {
                    var indexes;
                    debugger;
                    
                    // atualiza tambem o usuario na lista de usuarios
                    indexes = [];
                    AllRecipients.forEach(function (key, index) {
                        //debugger;
                        if (key.id === user.UserID) {
                            indexes.push(key.id);
                        }
                    });
                    indexes.reverse().forEach(function (key) {
                        AllRecipients.splice(key, 1);
                    });

                    // atualiza tambem o usuario na lista de destinararios (se ele estiver nela)
                    indexes = [];
                    SelectedRecipients.forEach(function (key, index) {
                        //debugger;
                        if (key.id === user.UserID) {
                            indexes.push(key.id);
                        }
                    });
                    indexes.reverse().forEach(function (key) {
                        SelectedRecipients.splice(key, 1);
                    });
                }

                $rootScope.intrachat.onUserStatus = function(status) {
                    factory.setUserStatusClass(status.UserID, factory.getUserStatusClass(status.UserID));
                };
                
                $rootScope.intrachat.onUserPicture = function(userid, picture) {
                    factory.setUserPicture(userid, picture);
                }
                
                /*$rootScope.intrachat.onFolderCount = function(count) {
                    if ($rootScope.loading) {
                        ProgressService.show('Carregando lista de pastas...');
                    }
                };*/
                
                $rootScope.intrachat.onMessageCount = function (count) {
                    if ($rootScope.loading) {
                        ProgressService.show('Carregando lista de mensagens...');
                    }
                    if (count < 0) {
                        factory.buildNewMessages();
                        factory.updateMessageCount(true);
                    }
                };

                $rootScope.intrachat.onMessage = function (message) {
                    if (!$rootScope.loading) {
                        switch (message.Status) {

                            case CIC_MESSAGE_NEW:
                                factory.buildNewMessages();
                                factory.updateMessageCount(true);
                                break;
                                
                            case CIC_MESSAGE_SENT:
                                // guardar a mensagem na lista (global) de mensagens enviadas
                                var user = $rootScope.intrachat.UserList[message.ToUserID];
                                if (!user) {
                                    user = {
                                        UserID: message.ToUserID,
                                        Name: message.ToUserID,
                                        DeptUnit: ''
                                    };
                                }

                                AllSentMessages.push({
                                    messageid: message.MessageID,
                                    timestamp: message.TimeStamp,
                                    body: factory.justSentMessages[message.PacketID],
                                    canReply: (!!message.isReplyAllowed) ? '' : 'disabled',
                                    touserid: user.UserID,
                                    tousername: user.Name,
                                    touserdept: /*' (' +*/ user.DeptUnit /*+ ')'*/,
                                    picture: factory.getUserPicture(user.UserID)
                                });
                                
                        }
                    }
                };

                $rootScope.intrachat.onFileCount = function (count) {
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

                $rootScope.intrachat.ServerSecure = ($location.protocol().toUpperCase() === 'HTTPS');
                //$rootScope.intrachat.logPackets = true;
                $rootScope.intrachat.connect();
            }
        };
        
        factory.logout = function () {
            $rootScope.intrachat.disconnect();
        };
        
        factory.isConnecting = function () {
            return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.connecting);
        };
        
        factory.isAuthenticating = function () {
            return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.authenticating);
        };
        
        factory.isLoading = function () {
            return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.loading);
        };
        
        factory.isConnected = function () {
            return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.intrachat.isConnected);
        };
        
        factory.isAuthenticated = function () {
            return ($rootScope.intrachat !== undefined && $rootScope.intrachat !== null && $rootScope.intrachat.isConnected && $rootScope.intrachat.isAuthenticated);
        };
        
        factory.doNeedLogin = function () {
            return (   $rootScope.intrachat === undefined 
                    || $rootScope.intrachat === null
                    || $rootScope.connecting
                    || $rootScope.authenticating
                    || $rootScope.loading
                    || !$rootScope.intrachat.isConnected
                    || !$rootScope.intrachat.isAuthenticated);
        };
        
        return factory;
    }
    
    clientService.$inject = ["$rootScope", "$window", "$document", "$location", "$interval", "SessionService", "FlashService", "ProgressService", "NavigationService", "AllRecipients", "SelectedRecipients", "AllNewMessages", "AllArchivedMessages", "AllSentMessages"];
    
    angular.module("webClient").factory('ClientService', clientService);
              
}());
