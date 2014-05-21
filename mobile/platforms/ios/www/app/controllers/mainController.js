(function () {'use strict';

    var mainController = function ($rootScope, $scope, $location, $interval, NavigationService, ClientService, AllRecipients, SelectedRecipients, AllNewMessages, AllArchivedMessages, AllSentMessages) {
        console.log('MainController');

        if (ClientService.doNeedLogin()) {
            console.log('voltando para /login');
            $location.path('/login');
            return;
        }
        
        $scope.AllEntities = AllRecipients;
        $scope.SelectedEntities = SelectedRecipients;
        $scope.AllNewMessages = AllNewMessages;
        $scope.AllArchivedMessages = AllArchivedMessages;
        $scope.AllSentMessages = AllSentMessages;
        
        $scope.isVisible = function() {
            return function(user) { return user.visible; }
        };
                
        $scope.showUsers = function () {
            NavigationService.showView('main');
            $interval(function () {
                NavigationService.showView('users');
            }, 10, 1);
        };

        $scope.showNewMessages = function () {
            /*if (Object.keys($rootScope.intrachat.NewMessageList).length > 0)*/ {
                NavigationService.showView('main');
                $interval(function () {
                    NavigationService.showView('news');
                }, 10, 1);
            }
        };
        
        $scope.showArchivedMessages = function () {
            NavigationService.showView('archived');
        };
        
        $scope.showSentMessages = function () {
            NavigationService.showView('sent');
        };
        
        $scope.getUserStatusClass = function(userid) {
            return ClientService.getUserStatusClass(userid);
        };    

        $scope.showReplyMessage = function (message) {
            if (message.canReply === '' && message.messageid > 0) {
                NavigationService.showView('reply', message);
            }
        };

        $scope.archiveMessage = function (messageid) {
            ClientService.archiveMessage(messageid);

            $('#message_'+messageid).hide();

            ClientService.buildNewMessages();
            ClientService.updateMessageCount(false);

            if (Object.keys($rootScope.intrachat.NewMessageList).length === 0) {
                $scope.showUsers();
            } else {
                $scope.showNewMessages();
            }                
        };
        
        $scope.replyMessage = function (message, newtext, replyAllowed, autoArchive) {
            //var message = $rootScope.intrachat.NewMessageList[originalid];
            ClientService.sendMessage(message.fromuserid, newtext, message.messageid, replyAllowed);
            if (!message.archived) {
                if (!!autoArchive) {
                    $scope.archiveMessage(message.messageid);
                }
                $scope.showNewMessages();
            } else {
                $scope.showArchivedMessages();
            }
        };
        
        $scope.sendMessage = function (recipients, newtext, replyAllowed, autoClear) {
            ClientService.sendMessage(recipients, newtext, 0, replyAllowed);
            if (!!autoClear) {
                ClientService.clearRecipients();
            }
            $scope.showUsers();
        };
        
        $scope.addRecipient = function (entity) {
            ClientService.addRecipient(entity);
        }
        
        $scope.removeRecipient = function (entity) {
            ClientService.removeRecipient(entity);
        }
        
        $scope.getRecipients = function (doClear) {
            return ClientService.getRecipients(doClear);
        }

        $scope.logout = function () {
            ClientService.logout();
        };

        function init () {
            NavigationService.showView((Object.keys($rootScope.intrachat.NewMessageList).length > 0) ? 'news' : 'users');
        }
        init();

    };
              
    mainController.$inject = ["$rootScope", "$scope", "$location", "$interval", "NavigationService", "ClientService", "AllRecipients", "SelectedRecipients", "AllNewMessages", "AllArchivedMessages", "AllSentMessages"];
              
    angular.module("webClient").controller('MainController', mainController);
              
}());
