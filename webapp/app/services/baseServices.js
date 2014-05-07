(function () {'use strict';

    // ================================================================================================================
    var navigationService = function ($rootScope) {
        var factory = {};
        
        factory.views = {};
        
        factory.addView = function (view) {
            factory.views[view.id] = view;
        };
        
        factory.showView = function (viewid, param) {
            $rootScope.include = factory.views[viewid];
            $rootScope.include.param = param;
        };
        
        function init () {
            factory.addView({ id: 'main',     title: 'IntraChat',  url: '/app/views/empty.html' });
            factory.addView({ id: 'users',    title: 'Usuários',   url: '/app/views/users.html' });
            factory.addView({ id: 'news',     title: 'Novas',      url: '/app/views/newMessages.html' });
            factory.addView({ id: 'archived', title: 'Arquivadas', url: '/app/views/archivedMessages.html' });
            factory.addView({ id: 'sent',     title: 'Enviadas',   url: '/app/views/sentMessages.html' });
            factory.addView({ id: 'reply',    title: 'Responder',  url: '/app/views/replyMessage.html' });
            factory.addView({ id: 'write',    title: 'Escrever',   url: '/app/views/writeMessage.html' });
        };        
        init();
        
        return factory;
    };
    navigationService.$inject = ["$rootScope"];
    angular.module("webClient").factory('NavigationService', navigationService);

    // ================================================================================================================
    var sessionService = function () {
        var factory = {};
        
        factory.get = function (key) {
            return sessionStorage.getItem(key);
        };
        
        factory.set = function (key, value) {
            return sessionStorage.setItem(key, value);
        };
        
        factory.del = function (key) {
            return sessionStorage.removeItem(key);
        };
        
        return factory;
    };
    angular.module("webClient").factory('SessionService', sessionService);

    // ================================================================================================================
    var storageService = function () {
        var factory = {};
        
        factory.get = function (key) {
            return localStorage.getItem(key);
        };
        
        factory.set = function (key, value) {
            return localStorage.setItem(key, value);
        };
        
        factory.del = function (key) {
            return localStorage.removeItem(key);
        };
        
        return factory;
    };
    angular.module("webClient").factory('StorageService', storageService);

    // ================================================================================================================
    var flashService = function ($rootScope) {
        var factory = {};
        
        factory.show = function (message) {
            $rootScope.flash = message;
            $rootScope.$apply();
        };
        
        factory.clear = function () {
            $rootScope.flash = '';
        };
        
        return factory;
    };
    flashService.$inject = ["$rootScope"];
    angular.module("webClient").factory('FlashService', flashService);

    // ================================================================================================================
    var progressService =  function ($rootScope) {
        var factory = {};
        
        factory.show = function (message) {
            $rootScope.progress = message;
            $rootScope.$apply();
        };
        
        factory.clear = function () {
            $rootScope.progress = '';
        };
        
        return factory;
    };
    progressService.$inject = ["$rootScope"];
    angular.module("webClient").factory('ProgressService', progressService);

    // ================================================================================================================

    angular.module("webClient").value('AllRecipients', []);
    angular.module("webClient").value('SelectedRecipients', []);
    angular.module("webClient").value('AllNewMessages', []);
    angular.module("webClient").value('AllArchivedMessages', []);
    angular.module("webClient").value('AllSentMessages', []);

}());
