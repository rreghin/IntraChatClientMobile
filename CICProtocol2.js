/**
*
*  Protocolos do CIC/Comunicador IntraChat
*  https://www.intrachat.com.br/
*
**/

var CIC_PROTOCOL_VERSION  = '396';
var CIC_PROTOCOL_REVISION = 'aWS';
var CIC_PROTOCOL_PLATFORM = 'M';

var CIC_COMMAND_AUTHENTICATE   = '001';
var CIC_COMMAND_AUTHENTICATION = '101';
var CIC_COMMAND_KEEPALIVE      = '111';
var CIC_COMMAND_KEEPALIVE_BACK = '008';
var CIC_COMMAND_LIST_ALL       = '033';
var CIC_COMMAND_LIST_UNITS     = '034';
var CIC_COMMAND_LIST_USERS     = '035';
var CIC_COMMAND_LIST_MESSAGES  = '036';
var CIC_COMMAND_LIST_ROOMS     = '037';
var CIC_COMMAND_LIST_FILES     = '038';
var CIC_COMMAND_UNIT_COUNT     = '039';
var CIC_COMMAND_USER_COUNT     = '040';
var CIC_COMMAND_MESSAGE_COUNT  = '041';
var CIC_COMMAND_ROOM_COUNT     = '042';
var CIC_COMMAND_FILE_COUNT     = '043';
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
        
    /**
     *  CONSTRUTOR DO OBJETO
     */
        
}{
    /**
     *  METODOS PARA FUNÇÕES B�?SICAS DO PROTOCOLO
     */
    
    CICBaseProtocol.prototype.init = function(ServerAddress, ServerPort, UserID, UserPassword, MagicString) {
        this.reset();
        this.ServerAddress = ServerAddress;
        this.ServerPort = ServerPort;
        this.MagicString = MagicString;
        this.UserID = UserID;
        this.UserPassword = UserPassword;
    };
    
    CICBaseProtocol.prototype.reset = function() {
        this.ServerID = '';
        this.ServerName = '';
        this.ServerVersion = '';
        this.ServerAddress = '';
        this.ServerPort = '55000';
        this.MagicString = '\r\n';
        this.UserID = '';
        this.UserPassword = '';
        this.IsAuthenticated = false;
        this.LastPacketID = 0; // sequencial de pacotes enviados
        this.WebSocket; // = new WebSocket(...);
    };
    
    CICBaseProtocol.prototype.connect = function() {
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
    
    CICBaseProtocol.prototype.disconnect = function() {
        this.WebSocket.close();
    };
    
    CICBaseProtocol.prototype.sendPacket = function(packet) {
        if (packet.PacketID === undefined) {
            packet.PacketID = ++this.LastPacketID;
        }
        this.WebSocket.send(JSON.stringify(packet));
    };
    
    /**
     *  EVENTOS DO WEBSOCKETS (NÃO MEXA NELES!)
     */
    
    CICBaseProtocol.prototype._onWSOpen = function() {
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
    
    CICBaseProtocol.prototype._onWSClose = function() {
        if (this.intOnDisconnect()) {
            this.onDisconnect();
        }
    };
    
    CICBaseProtocol.prototype._onWSError = function(error) {
        if (this.intOnError(error)) {
            this.onError(error);
        }
    };
    
    CICBaseProtocol.prototype._onWSMessage = function(event) {
        //console.log(event.data);
        var lines = event.data.match(/^.*((\r\n|\n|\r)|$)/gm);
        for(var index in lines) {
            if (lines[index] !== '') {
                var packet = JSON.parse(lines[index]);
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
            }
        }
    };
    
    /**
     *  EVENTOS INTERNOS (podem ser sobrescritos, mas NÃO pelo front-end)
     *  devem retornar TRUE se os metodos e eventos EXTERNOS devem ser chamados
     */
    
    CICBaseProtocol.prototype.intOnConnect = function() {
        return true;
    };
    CICBaseProtocol.prototype.intOnDisconnect = function() {
        return true;
    };
    CICBaseProtocol.prototype.intOnError = function(error) {
        return true;
    };
    CICBaseProtocol.prototype.intOnAuthenticationOk = function() {
        return true;
    };
    CICBaseProtocol.prototype.intOnAuthenticationFailed = function(errornumber, errormessage) {
        return true;
    };
    CICBaseProtocol.prototype.intOnPacket = function(packet) {
        return true;
    };
    
    /**
     *  EVENTOS EXTERNOS (podem ser sobrescritos pelo front-end)
     */
    
    CICBaseProtocol.prototype.onConnect = function() {
        //console.log('CONNECTED');
    };
    CICBaseProtocol.prototype.onDisconnect = function() {
        //console.log('DISCONNECTED');
    };
    CICBaseProtocol.prototype.onError = function(error) {
        //console.log('ERROR: ' + JSON.stringify(error));
    };
    CICBaseProtocol.prototype.onAuthenticationOk = function() {
        //console.log('Authenticated to server "' + this.getServerName() + '"');
    };
    CICBaseProtocol.prototype.onAuthenticationFailed = function(errornumber, errormessage) {
        //console.log('Authentication ERROR: (' + errornumber + ') ' + errormessage);
    };
    CICBaseProtocol.prototype.onPacket = function(packet) {
        //console.log('PACKET: ' + JSON.stringify(packet));
    };
    
}

function CICMessageProtocol(ServerAddress, ServerPort, UserID, UserPassword, Targets, TextMessage) {
        
    /**
     *  CONSTRUTOR DO OBJETO
     */

    this.init(ServerAddress, ServerPort, UserID, UserPassword, CIC_MESSAGE_MAGIC_STRING);

    this.Targets = Targets;
    this.TextMessage = TextMessage;

    // faz a conexao assim que criar o objeto
    this.connect();

}{
    // faz a ligação entre o objeto filho com a "classe"
    CICMessageProtocol.prototype = new CICBaseProtocol();
    CICMessageProtocol.prototype.parent = CICBaseProtocol;
    
    /**
     *  EVENTOS QUE PRECISAM SER TRATADOS PELO PROTOCOLO DE ENVIO DE MENSAGENS
     */
    
    CICMessageProtocol.prototype.intOnAuthenticationOk = function() {
        var MsgPacket = {
            Command: CIC_COMMAND_TEXTMESSAGE,
            ToUserID: this.Targets,
            TextMessage: Base64.encode(this.TextMessage)
        };
        this.sendPacket(MsgPacket);
        this.onTextMessageSent(MsgPacket);
        return this.parent.prototype.intOnAuthenticationOk.call(this);
    };
    
    CICMessageProtocol.prototype.intOnPacket = function(packet) {
        if (packet.Command === CIC_COMMAND_TEXTMESSAGE) {
            var target = packet.ToUserID + (packet.Group===undefined?'':' ('+packet.Group+')');
            if (packet.MessageID !== '0') {
                this.onTextMessageOk(target, packet.MessageID);
            }
            else {
                this.onTextMessageFailed(target, Base64.decode(packet.ErrorMessage));
            }
            return false; // nao propaga o evento, fazendo com que o OnPacket nao seja executado, pois o pacote ja foi tratado
        }
        return this.parent.prototype.intOnPacket.call(this, packet);
    };
    
    /**
     *  EVENTOS ADICIONAIS DO PROTOCOLO QUE PODEM SER SOBRESCRITOS PELO FRONT-END
     */
    
    CICMessageProtocol.prototype.onTextMessageSent = function(packet) {
        // nao faz nada por padrao
    };
    CICMessageProtocol.prototype.onTextMessageOk = function(target, messageid) {
        // nao faz nada por padrao
    };
    CICMessageProtocol.prototype.onTextMessageFailed = function(target, errormessage) {
        // nao faz nada por padrao
    };
    
}    

function CICClientProtocol(ServerAddress, ServerPort, UserID, UserPassword, doConnect) {
    
    /**
     *  CONSTRUTOR DO OBJETO
     */

    this.init(ServerAddress, ServerPort, UserID, UserPassword, CIC_CLIENT_MAGIC_STRING);

    // ja faz a conexao com o servidor, caso tenha dito que sim, ou nao tenha sido dito nada
    if (doConnect) {
        this.connect();
    }

}{ 
    // faz a ligação entre o objeto filho com a "classe"
    CICClientProtocol.prototype = new CICBaseProtocol();
    CICClientProtocol.prototype.parent = CICBaseProtocol;
    
    /**
     *  EVENTOS QUE PRECISAM SER TRATADOS PELO PROTOCOLO DO CLIENTE
     */
    
    CICClientProtocol.prototype.intOnPacket = function(packet) {
        if (packet.Command === CIC_COMMAND_KEEPALIVE) {
            // simplesmente devolve o mesmo pacote 
            packet.Command = CIC_COMMAND_KEEPALIVE_BACK;
            this.sendPacket(packet);
            return false; // indica que o pacote foi processado e que um objeto filho nao precisa processa-lo
        }
        // NAO usar a chamada pela heranca aqui, senao entra em loop, pois de acordo com o escopo, this é a Sessao (abaixo)
        return true; //this.parent.prototype.intOnPacket.call(this, packet);
    };
    
}

function CICClientSession(ServerAddress, ServerPort, UserID, UserPassword, doConnect) {
    
    /**
     *  CONSTRUTOR DO OBJETO
     */

    this.init(ServerAddress, ServerPort, UserID, UserPassword, CIC_CLIENT_MAGIC_STRING);

    // ja faz a conexao com o servidor, caso tenha dito que sim, ou nao tenha sido dito nada
    if (doConnect) {
        this.connect();
    }

}{
    // faz a ligação entre o objeto filho com a "classe"
    CICClientSession.prototype = new CICClientProtocol();
    CICClientSession.prototype.parent = CICClientProtocol;
    
    /**
     *  EVENTOS QUE PRECISAM SER TRATADOS PELO PROTOCOLO DO CLIENTE
     */

    CICClientSession.prototype.reset = function() {
        this.parent.prototype.reset.call(this);
        this.UnitList = {};
        this.UserList = {};
        this.RoomList = {};
        this.FileList = {};
        this.MessageList = {};
    };
    
    CICClientSession.prototype.intDisconnect = function() {
        this.reset();
        return this.parent.prototype.intDisconnect.call(this);
    };

    CICClientSession.prototype.intOnAuthenticationOk = function() {
        // pede as listas assim que estiver autenticado
        var Packet = {
            Command: CIC_COMMAND_LIST_ALL,
            LastChange: ''
        };
        this.sendPacket(Packet);
        return this.parent.prototype.intOnAuthenticationOk.call(this);
    };
    
    CICClientSession.prototype.intOnPacket = function(packet) {
        // primeiro processa o pacote pela "classe" mãe.
        // se ela retornar TRUE é porque o pacote nao foi processado ainda, e precisa ser processado aqui dentro desse metodo
        var result = this.parent.prototype.intOnPacket.call(this, packet);
        if (result) {
            
        }
        return result;
    };
    
};

