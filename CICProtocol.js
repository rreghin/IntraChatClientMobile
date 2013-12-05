/**
*
*  Protocolos do CIC/Comunicador IntraChat
*  https://www.intrachat.com.br/
*
**/

var CIC_PROTOCOL_VERSION  = '396';
var CIC_PROTOCOL_REVISION = 'aws';
var CIC_PROTOCOL_PLATFORM = 'M';

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
            
    this.ServerID = '';
    this.ServerName = '';
    this.ServerVersion = '';
    this.ServerAddress = '';
    this.ServerPort = '55000';
    this.MagicString = '\r\n';
    this.UserID = '';
    this.UserPassword = '';
    this.IsAuthenticated = false;
    this.WebSocket; //  = new WebSocket(...);
    this.LastPacketID = 0; // sequencial de pacotes enviados

    // metodos privados
    this._onWSOpen = function() {
        if (this.intOnConnect()) {
            this.onConnect();
            this.WebSocket.send(this.MagicString);
            // prepara o objeto JSON a ser enviado com o pedido de autenticacao
            var AuthPacket = {
                Command: CIC_COMMAND_AUTHENTICATE,
                UserID: this.UserID,
                Password: this.UserPassword,
                VersionNumber: CIC_PROTOCOL_VERSION,
                VersionRevision: CIC_PROTOCOL_REVISION,
                VersionPlatform: CIC_PROTOCOL_PLATFORM,
                Language: 'PT',
                SystemInfo: ''
            };
            this.sendPacket(AuthPacket);
        }
    };

    this._onWSClose = function() {
        if (this.intOnDisconnect()) {
            this.onDisconnect();
        }
    };

    this._onWSError = function(error) {
        if (this.intOnError(error)) {
            this.onError(error);
        }
    };

    this._onWSMessage = function(event) {
        var packet = JSON.parse(event.data);
        // verifica qual foi o comando enviado pelo servidor
        if (!this.IsAuthenticated) {
            if (packet.Command === CIC_COMMAND_AUTHENTICATION) {
                this.ServerID = packet.ServerID;
                this.ServerName = packet.ServerName;
                this.ServerVersion = packet.VersionInfo;
                if (packet.Granted === 'True') {
                    this.IsAuthenticated = true;
                    if (this.intOnAuthenticationOk()) {
                        this.onAuthenticationOk();
                    }
                }
                else {
                    this.IsAuthenticated = false;
                    packet.ErrorMessage = Base64.decode(packet.ErrorMessage);
                    if (this.intOnAuthenticationFailed(packet.ErrorNumber, packet.ErrorMessage)) {
                        this.onAuthenticationFailed(packet.ErrorNumber, packet.ErrorMessage);
                    }
                }
            }
        }
        else {
            if (this.intOnPacket(packet)) {
                this.onPacket(packet);
            }
        }
    };
    
    /**
     * metodos INTERNOS (NAO devem ser sobrescritos)
     */
    
    this.intConnect = function(ServerAddress, ServerPort, MagicString, UserID, UserPassword) {
        this.ServerAddress = ServerAddress;
        this.ServerPort = ServerPort;
        this.MagicString = MagicString;
        this.UserID = UserID;
        this.UserPassword = UserPassword;
        // precisa ter estabelecido uma conexao HTTPS com o endereco abaixo
        // para que o usuario tenha a chance de aceitar o certificado
        // auto-assinado do servidor intrachat
        var self = this;
        this.WebSocket = new WebSocket('wss://'+this.ServerAddress+':'+this.ServerPort+'/', ['intrachat']);
        this.WebSocket.onopen = function() { self._onWSOpen.call(self); };
        this.WebSocket.onclose = function() { self._onWSClose.call(self); };
        this.WebSocket.onerror = function(error) { self._onWSError.call(self, error); };
        this.WebSocket.onmessage = function(event) { self._onWSMessage.call(self, event); };
    };
    
    this.intDisconnect = function() {
        this.WebSocket.close();
    };

    this.intSendPacket = function(packet) {
        if (packet.PacketID === undefined) {
            packet.PacketID = ++this.LastPacketID;
        }
        this.WebSocket.send(JSON.stringify(packet));
    };
    
    /**
     * metodos EXTERNOS (podem ser sobrescritos)
     */
    
    this.connect = function(ServerAddress, ServerPort, MagicString, UserID, UserPassword) {
        this.intConnect(ServerAddress, ServerPort, MagicString, UserID, UserPassword);
    };
    
    this.disconnect = function() {
        this.intDisconnect();
    };

    this.sendPacket = function(packet) {
        this.intSendPacket(packet);
    };
    
    /**
     * eventos INTERNOS (podem ser sobrescritos)
     * devem retornar TRUE se os metodos e eventos EXTERNOS devem ser chamados
     */
    
    this.intOnConnect = function() {
        return true;
    };
    
    this.intOnDisconnect = function() {
        return true;
    };
    
    this.intOnError = function(error) {
        return true;
    };
    
    this.intOnAuthenticationOk = function() {
        return true;
    };

    this.intOnAuthenticationFailed = function(errornumber, errormessage) {
        return true;
    };

    this.intOnPacket = function(packet) {
        return true;
    };

    /**
     * eventos EXTERNOS (podem ser sobrescritos pelo front-end)
     */
    
    this.onConnect = function() {
        //console.log('CONNECTED');
    };
    
    this.onDisconnect = function() {
        //console.log('DISCONNECTED');
    };
    
    this.onError = function(error) {
        //console.log('ERROR: ' + JSON.stringify(error));
    };
    
    this.onAuthenticationOk = function() {
        //console.log('Authenticated to server "' + this.getServerName() + '"');
    };

    this.onAuthenticationFailed = function(errornumber, errormessage) {
        //console.log('Authentication ERROR: (' + errornumber + ') ' + errormessage);
    };

    this.onPacket = function(packet) {
        //console.log('PACKET: ' + JSON.stringify(packet));
    };

};

function CICMessageProtocol(ServerAddress, ServerPort, UserID, UserPassword, Targets, TextMessage) {
    
    /**
     * sobreescreve os eventos basicos do protocolo base
     */
    
    this.intOnAuthenticationOk = function() {
        var MsgPacket = {
            Command: CIC_COMMAND_TEXTMESSAGE,
            ToUserID: Targets,
            TextMessage: Base64.encode(TextMessage)
        };
        this.sendPacket(MsgPacket);
        this.onTextMessageSent(MsgPacket);
        return true;
    };

    this.intOnPacket = function(packet) {
        if (packet.Command === CIC_COMMAND_TEXTMESSAGE) {
            var target = packet.ToUserID + (packet.Group===undefined?'':' ('+packet.Group+')');
            if (packet.MessageID !== '0') {
                this.onTextMessageOk(target, packet.MessageID);
            }
            else {
                this.onTextMessageFailed(target, Base64.decode(packet.ErrorMessage));
            }
        }
        return true;
    };

    /**
     * esses sao os metodos publicos disponiveis para a interface
     */
    
    this.connect = function() {
        this.intConnect(ServerAddress, ServerPort, CIC_MESSAGE_MAGIC_STRING, UserID, UserPassword);
    };
    
    this.onTextMessageSent = function(packet) {
        // nao faz nada por padrao
    };

    this.onTextMessageOk = function(target, messageid) {
        // nao faz nada por padrao
    };

    this.onTextMessageFailed = function(target, errormessage) {
        // nao faz nada por padrao
    };

    // faz a conexao caso tenham sido passados os destinatarios e o texto da mensagem
    this.connect();
    
};
CICMessageProtocol.prototype = new CICBaseProtocol();

function CICClientProtocol(ServerAddress, ServerPort, UserID, UserPassword, doConnect) {
    
    /**
     * esses sao os metodos publicos disponiveis para a interface
     */
    
    this.connect = function() {
        this.intConnect(ServerAddress, ServerPort, CIC_CLIENT_MAGIC_STRING, UserID, UserPassword);
    };
    
    this.intOnPacket = function(packet) {
        if (packet.Command === CIC_COMMAND_KEEPALIVE) {
            // simplesmente devolve o mesmo pacote 
            packet.Command = CIC_COMMAND_KEEPALIVE_BACK;
            this.sendPacket(packet);
        }
        return true;
    };

    // ja faz a conexao com o servidor, caso tenha dito que sim, ou nao tenha sido dito nada
    if ((doConnect === undefined) || (doConnect)) {
        this.connect();
    }
    
};
CICClientProtocol.prototype = new CICBaseProtocol();

