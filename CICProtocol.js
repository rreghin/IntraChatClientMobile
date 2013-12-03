/**
*
*  Protocolos do CIC/Comunicador IntraChat
*  https://www.intrachat.com.br/
*
**/

var CIC_COMMAND_AUTHENTICATE   = '001';
var CIC_COMMAND_AUTHENTICATION = '101';
var CIC_COMMAND_KEEPALIVE      = '111';
var CIC_COMMAND_KEEPALIVE_BACK = '008';
var CIC_COMMAND_TEXTMESSAGE    = '010';

var CIC_CLIENT_MAGIC_STRING = '@BOBJDCDLEIDEBNEDDODJDCDODNBJBO\r\n';
var CIC_MESSAGE_MAGIC_STRING = 'OBJBCEGDODEDGDADCECEEDMDDDNBEECEJBOB@\r\n';

var Base64 = {

    /**
    *
    *  Base64 encode / decode
    *  http://www.webtoolkit.info/
    *
    **/
   
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

};

function CICBaseProtocol() {
    // pra poder usar em todos os lugares 
    var self = this; 

    // propriedades privadas
    var _ServerID = '';
    var _ServerName = '';
    var _ServerVersion = '';
    var _ServerAddress = '';
    var _ServerPort = '55000';
    var _MagicString = '\r\n';
    var _UserID = '';
    var _UserPassword = '';
    var _IsAuthenticated = false;
    var _Connection = {}; // new WebSocket(...);

    // metodos privados
    var _onWSOpen = function() {
        console.log('WebSocket CONNECTED');
        self.onConnect();
        _Connection.send(_MagicString);
        // prepara o objeto JSON a ser enviado com o pedido de autenticacao
        var AuthPacket = {
            Command: CIC_COMMAND_AUTHENTICATE,
            UserID: _UserID,
            Password: _UserPassword,
            VersionNumber: '396'
        };
        self.sendPacket(AuthPacket);
    };

    var _onWSClose = function() {
        console.log('WebSocket DISCONNECTED');
        self.onDisconnect();
    };

    var _onWSError = function(error) {
        console.log('WebSocket ERROR: ' + JSON.stringify(error));
        self.onError(error);
    };

    var _onWSMessage = function(event) {
        //console.log('WebSocket MESSAGE: ' + event.data);
        var packet = JSON.parse(event.data);
        // verifica qual foi o comando enviado pelo servidor
        if (!_IsAuthenticated) {
            if (packet.Command === CIC_COMMAND_AUTHENTICATION) {
                _ServerID = packet.ServerID;
                _ServerName = packet.ServerName;
                _ServerVersion = packet.VersionInfo;
                if (packet.Granted === 'True') {
                    console.log('Authenticated to server: ' + self.getServerName() + ':' + self.getServerID() + ' (' + self.getServerVersion() + ')');
                    _IsAuthenticated = true;
                    self.onAuthenticationOk();
                }
                else {
                    packet.ErrorMessage = Base64.decode(packet.ErrorMessage);
                    console.log('Authentication ERROR ' + packet.ErrorNumber + ': ' + packet.ErrorMessage);
                    _IsAuthenticated = false;
                    self.onAuthenticationFailed(packet.ErrorNumber, packet.ErrorMessage);
                }
            }
        }
        else {
            //console.log('Protocol PACKET: ' + JSON.stringify(packet));
            self.onPacket(packet);
        }
    };

    // metodos publicos
    this.getServerID = function() { return _ServerID; };
    this.getServerName = function() { return _ServerName; };
    this.getServerVersion = function() { return _ServerVersion; };
    this.getAuthenticated = function() { return _IsAuthenticated; };

    this.connect = function(ServerAddress, ServerPort, MagicString, UserID, UserPassword) {
        _ServerAddress = ServerAddress;
        _ServerPort = ServerPort;
        _MagicString = MagicString;
        _UserID = UserID;
        _UserPassword = UserPassword;
        // precisa ter estabelecido uma conexao HTTPS com o endereco abaixo
        // para que o usuario tenha a chance de aceitar o certificado
        // auto-assinado do servidor intrachat
        _Connection = new WebSocket('wss://'+_ServerAddress+':'+_ServerPort+'/', ['intrachat']);
        _Connection.onopen = _onWSOpen;
        _Connection.onclose = _onWSClose;
        _Connection.onerror = _onWSError;
        _Connection.onmessage = _onWSMessage;
    };
    
    this.disconnect = function() {
        _Connection.close();
    };

    this.sendPacket = function(packet) {
        _Connection.send(JSON.stringify(packet));
    };
    
    this.onConnect = function() {
        // nao faz nada por padrao
    };
    
    this.onDisconnect = function() {
        // nao faz nada por padrao
    };
    
    this.onError = function(error) {
        //console.log('Protocol ERROR: ' + JSON.stringify(error));
    };
    
    this.onAuthenticationOk = function() {
        //console.log('Authenticated to server: ' + this.getServerName());
    };

    this.onAuthenticationFailed = function(errornumber, errormessage) {
        //console.log('Authentication ERROR ' + errornumber + ': ' + errormessage);
    };

    this.onPacket = function(packet) {
        //console.log('Protocol PACKET: ' + JSON.stringify(packet));
    };

};

function CICMessageProtocol(ServerID, ServerPort, UserID, UserPassword, Targets, TextMessage) {
    //var self = this;
    this.super = new CICBaseProtocol();
    
    var _Targets = Targets;
    var _Message = TextMessage;
    
    // faz a conexao e envia a mensagem
    this.super.connect(ServerID, ServerPort, CIC_MESSAGE_MAGIC_STRING, UserID, UserPassword);
    
    // sobrescreve o metodo que eh executado quando a autenticacao foi bem sucedida
    this.super.onAuthenticationOk = function() {
        // envia a mensagem
        var MsgPacket = {
            Command: CIC_COMMAND_TEXTMESSAGE,
            ToUserID: _Targets,
            TextMessage: Base64.encode(_Message)
        };
        this.sendPacket(MsgPacket);
        //console.log('CICMessage SENT:' + JSON.stringify(MsgPacket));
    };
    
    // sobrescreve o metodo que eh executado toda vez que um pacote (nao de autenticacao) � executado
    this.super.onPacket = function(packet) {
        if (packet.Command === CIC_COMMAND_TEXTMESSAGE) {
            if (packet.MessageID !== '0') {
                console.log('Message to ' + packet.ToUserID + (packet.Group===undefined?'':' ('+packet.Group+')') + ' SENT. ID: ' + packet.MessageID);
            }
            else {
                console.log('Message to ' + packet.ToUserID + ' FAILED: ' + Base64.decode(packet.ErrorMessage));
            }
        }
    };
    
};

function CICClientProtocol(ServerID, ServerPort, UserID, UserPassword) {
    //var self = this;
    this.super = new CICBaseProtocol();
        
    this.super.connect(ServerID, ServerPort, CIC_CLIENT_MAGIC_STRING, UserID, UserPassword);
    
    this.super.onAuthenticationOk = function() {
        //console.log('CICClient AUTHENTICATED');
    };
    
    this.super.onAuthenticationFailed = function(errornumber, errormessage) {
        //console.log('Authentication ERROR ' + errornumber + ': ' + errormessage);
    };

    this.super.onPacket = function(packet) {
        if (packet.Command === CIC_COMMAND_KEEPALIVE) {
            // simplesmente devolve o mesmo pacote 
            packet.Command = CIC_COMMAND_KEEPALIVE_BACK;
            this.sendPacket(packet);
        }
    };
    
};

