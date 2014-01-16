'use strict';

var isPhoneGap = false;
var isPhoneGapReady = false;

var app = {
    checkReadyState: function () {
        if (isPhoneGapReady) {
            app.ready();
        }
    },
    checkWebSockets: function() {
        if( !('WebSocket' in window) || (typeof(WebSocket) !== 'function') ) {
            alert("Error! Your browser does NOT support HTML5 Web Sockets.");
            return false;
        }
        return true;
    },
    ready: function () {
        if (app.checkWebSockets()) {

            alert("Tudo bem!");

        }
    }
};

$.getScript("cordova.js")
    .done(function () {
        isPhoneGap = true;
        document.addEventListener("deviceready", function () {
            console.log("phonegap ready - device/app mode");
            isPhoneGapReady = true;
            app.checkReadyState();
        }, false);
    })
    .fail(function () {
        console.log("Cordova load failed - browser only");
        isPhoneGapReady = true;
        app.checkReadyState();
    });
