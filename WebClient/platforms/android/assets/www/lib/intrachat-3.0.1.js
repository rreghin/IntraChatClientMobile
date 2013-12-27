'use strict';

/**
*
*  Protocolos do CIC/Comunicador IntraChat
*  https://www.intrachat.com.br/
*
**/

// CONSTANTES PRE-DEFINIDAS
{
    // =============================================================================
    var CIC_PROTOCOL_VERSION  = '396';
    var CIC_PROTOCOL_REVISION = 'aWS';
    var CIC_PROTOCOL_PLATFORM = 'M';
    // =============================================================================
    var CIC_CLIENT_MAGIC_STRING  = '@BOBJDCDLEIDEBNEDDODJDCDODNBJBO\r\n';
    var CIC_MESSAGE_MAGIC_STRING = 'OBJBCEGDODEDGDADCECEEDMDDDNBEECEJBOB@\r\n';
    // =============================================================================
    var CIC_OPERATION_INSERT   =   0;
    var CIC_OPERATION_UPDATE   =   1;
    var CIC_OPERATION_DELETE   =   2;
    var CIC_OPERATION_SYNC     =   3;
    var CIC_OPERATION_LIST     =   4;
    var CIC_OPERATION_MODIFY   =   5;
    var CIC_OPERATION_LAG      =   6;
    var CIC_OPERATION_USERUPD  =   7;
    var CIC_OPERATION_MCP      =   9; // codigo especial para "Meus Contatos Pessoais"
    var CIC_OPERATION_SENT     = 100;
    var CIC_OPERATION_RECEIVED = 101;
    var CIC_OPERATION_ERROR    = 255;
    // =============================================================================
    var CIC_USER_STATUS_OFF       = -1;
    var CIC_USER_STATUS_AVAILABLE =  0;
    var CIC_USER_STATUS_BUSY      =  1;
    var CIC_USER_STATUS_AWAY      =  2;
    var CIC_USER_STATUS_HELLO     = 10;
    // =============================================================================
    var CIC_MESSAGE_NEW        =   0;
    var CIC_MESSAGE_ARCHIVED   =   1;
    var CIC_MESSAGE_IMPORTANT  =   2;
    var CIC_MESSAGE_SENT       =   8;
    var CIC_MESSAGE_RECEIVED   =  16;
    var CIC_MESSAGE_ORIGINAL   =  32;
    var CIC_MESSAGE_FOLDER     = 128;
    // =============================================================================
    var CIC_ROOM_ALL        = 0;
    var CIC_ROOM_LINES      = 1;
    var CIC_ROOM_MINUTES    = 2;
    var CIC_ROOM_TODAY      = 3;
    var CIC_ROOM_TIMESTAMP  = 4;
    // =============================================================================
    var CIC_COMMAND_AUTHENTICATE    =   1;
    var CIC_COMMAND_AUTO_REGISTER   =   3;
    var CIC_COMMAND_AUTHENTICATION  = 101;

    var CIC_COMMAND_GET_SERVER_INFO =   4;
    var CIC_COMMAND_GET_USER_INFO   =   5;

    var CIC_COMMAND_SERVER_INFO     = 214;
    var CIC_COMMAND_USER_INFO       = 218;

    var CIC_COMMAND_KEEPALIVE       = 111;
    var CIC_COMMAND_KEEPALIVE_BACK  =   8;

    var CIC_COMMAND_GET_LOGO        = 195;
    var CIC_COMMAND_GET_PICTURE     = 196;
    var CIC_COMMAND_GET_CONFIG      = 197;
    var CIC_COMMAND_GET_MURAL       = 199;

    var CIC_COMMAND_CONFIG          = 185;
    var CIC_COMMAND_LOGO            = 186;
    var CIC_COMMAND_PICTURE         = 187;
    var CIC_COMMAND_MURAL           = 189;

    var CIC_COMMAND_LOGO_CHANGED    = 190;
    var CIC_COMMAND_PICTURE_CHANGED = 191;
    var CIC_COMMAND_CONFIG_CHANGED  = 192;
    var CIC_COMMAND_MURAL_CHANGED   = 194;

    var CIC_COMMAND_LIST_ALL        =  33;
    var CIC_COMMAND_LIST_UNITS      =  34;
    var CIC_COMMAND_LIST_USERS      =  35;
    var CIC_COMMAND_LIST_MESSAGES   =  36;
    var CIC_COMMAND_LIST_ROOMS      =  37;
    var CIC_COMMAND_LIST_FILES      =  38;
    var CIC_COMMAND_LIST_FOLDERS    =  39;

    var CIC_COMMAND_UNIT            = 115;
    var CIC_COMMAND_UNIT_COUNT      =  42;

    var CIC_COMMAND_USER            = 103;
    var CIC_COMMAND_USER_COUNT      =  43;
    var CIC_COMMAND_USER_STATUS     =  71;

    var CIC_COMMAND_FOLDER          = 235;
    var CIC_COMMAND_FOLDER_COUNT    =  47;

    var CIC_COMMAND_MESSAGE         =  10;
    var CIC_COMMAND_MESSAGE_COUNT   =  44;
    var CIC_COMMAND_MESSAGE_STATUS  =  11;
    var CIC_COMMAND_MESSAGE_FOLDER  = 237;

    var CIC_COMMAND_ROOM            = 116;
    var CIC_COMMAND_ROOM_COUNT      =  45;
    var CIC_COMMAND_ROOM_NEW        =  50;
    var CIC_COMMAND_ROOM_CHANGE     =  51;
    var CIC_COMMAND_ROOM_DELETE     =  52;
    var CIC_COMMAND_ROOM_INVITE     =  53;
    var CIC_COMMAND_ROOM_REVOKE     =  54;
    var CIC_COMMAND_ROOM_JOIN       =  55;
    var CIC_COMMAND_ROOM_LEAVE      =  56;
    var CIC_COMMAND_ROOM_DENIED     =  57;
    var CIC_COMMAND_ROOM_GRANTED    =  58;
    var CIC_COMMAND_ROOM_DATA       =  59;
    var CIC_COMMAND_ROOM_ACCEPT     =  60;
    var CIC_COMMAND_ROOM_REJECT     =  61;
    var CIC_COMMAND_ROOM_USERLIST   =  62;
    var CIC_COMMAND_ROOM_WRITING    =  63;
    var CIC_COMMAND_ROOM_SEARCH     =  64;

    var CIC_COMMAND_FILE            = 138;
    var CIC_COMMAND_FILE_COUNT      =  46;
    // =============================================================================
}

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
        this.ServerSecure = true;
        this.MagicString = MagicString;
        this.UserID = UserID;
        this.UserPassword = UserPassword;
    };
    
    CICBaseProtocol.prototype.reset = function() {
        this.ServerInfo = {};
        this.ServerAddress = '';
        this.ServerPort = '55000';
        this.MagicString = '\r\n';
        this.UserID = '';
        this.UserPassword = '';
        this.IsAuthenticated = false;
        this.LastPacketID = 0; // sequencial de pacotes enviados
        this.WebSocket; // = new WebSocket(...);
        this.doAutoRegister = false;
        delete this.ServerInfo;
        delete this.UserName;
        delete this.UserDept;
        delete this.UserEmail;
        delete this.UserPhone;
        delete this.UserBirthDate;
        delete this.UserBase64Picture;
    };
    
    CICBaseProtocol.prototype.connect = function() {
        // precisa ter estabelecido uma conexao HTTPS com o endereco abaixo
        // para que o usuario tenha a chance de aceitar o certificado
        // auto-assinado do servidor intrachat
        var self = this;
        this.WebSocket = new WebSocket((this.ServerSecure?'wss':'ws')+'://'+this.ServerAddress+':'+this.ServerPort+'/', ['intrachat']);
        this.WebSocket.onopen = function() { self._onWSOpen.call(self); };
        this.WebSocket.onclose = function() { self._onWSClose.call(self); };
        this.WebSocket.onerror = function(error) { self._onWSError.call(self, error); };
        this.WebSocket.onmessage = function(event) { self._onWSMessage.call(self, event); };
    };
    
    CICBaseProtocol.prototype.disconnect = function() {
        this.WebSocket.close();
    };
    
    CICBaseProtocol.prototype.authenticate = function() {
        this.sendPacket({
            Command: CIC_COMMAND_AUTHENTICATE,
            UserID: this.UserID,
            Password: this.UserPassword,
            VersionNumber: CIC_PROTOCOL_VERSION,
            VersionRevision: CIC_PROTOCOL_REVISION,
            VersionPlatform: CIC_PROTOCOL_PLATFORM,
            Language: 'PT',
            SystemInfo: ''
        });
    };

    CICBaseProtocol.prototype.register = function() {
        this.sendPacket({
            Command: CIC_COMMAND_AUTO_REGISTER,
            UserID: this.UserID,
            Password: this.UserPassword,
            Name: this.UserName||this.UserID,
            Dept: this.UserDept,
            Email: this.UserEmail,
            Phone: this.UserPhone,
            BirthDate: this.UserBirthDate,   // no formato "1900-MM-DD"
            Base64Picture: this.UserBase64Picture,  // foto PNG codificada em Base64
            VersionNumber: CIC_PROTOCOL_VERSION,
            VersionRevision: CIC_PROTOCOL_REVISION,
            VersionPlatform: CIC_PROTOCOL_PLATFORM,
            Language: 'PT',
            SystemInfo: ''
        });
    };

    CICBaseProtocol.prototype.sendPacket = function(packet) {
        if (packet.PacketID === undefined) {
            packet.PacketID = ++this.LastPacketID;
        }
        this.WebSocket.send(JSON.stringify(packet));
        //console.log('SENT -> ' + JSON.stringify(packet));
    };
    
    CICBaseProtocol.prototype.setStatus = function(status, message, isDefaultStatus, isDefaultMessage) {
        this.sendPacket({ 
            Command: CIC_COMMAND_USER_STATUS,
            Status: status||CIC_USER_STATUS_AVAILABLE,
            StatusMessage: message||'',
            isDefaultStatus: isDefaultStatus||false,
            isDefaultStatusMessage: isDefaultMessage||false
        });
    };    
    
    CICBaseProtocol.prototype.sendMessage = function(targets, text) {
        this.sendPacket({
            Command: CIC_COMMAND_MESSAGE,
            ToUserID: targets,
            TextMessage: Base64.encode(text)
        });
    };
        
    CICBaseProtocol.prototype.setMessageStatus = function(messageid, status) {
        this.sendPacket({
            Command: CIC_COMMAND_MESSAGE_STATUS,
            Operation: status,
            MessageID: messageid
        });
    };
        
    CICBaseProtocol.prototype.setMessageFolder = function(messageid, folderid) {
        this.sendPacket({
            Command: CIC_COMMAND_MESSAGE_FOLDER,
            MessageID: messageid,
            FolderID: folderid
        });
    };
        
    CICBaseProtocol.prototype.setFileFolder = function(streamid, folderid) {
        this.sendPacket({
            Command: CIC_COMMAND_FILE_FOLDER,
            StreamID: streamid,
            FolderID: folderid
        });
    };
        
    CICBaseProtocol.prototype.createMessageFolder = function(foldername) {
        this.sendPacket({
            Command: CIC_COMMAND_FOLDER,
            Operation: CIC_OPERATION_INSERT,
            Name: foldername,
            Kind: 'M'
        });
    };
        
    CICBaseProtocol.prototype.createFileFolder = function(foldername) {
        this.sendPacket({
            Command: CIC_COMMAND_FOLDER,
            Operation: CIC_OPERATION_INSERT,
            Name: foldername,
            Kind: 'F'
        });
    };
        
    CICBaseProtocol.prototype.renameFolder = function(folderid, newname) {
        this.sendPacket({
            Command: CIC_COMMAND_FOLDER,
            Operation: CIC_OPERATION_UPDATE,
            FolderID: folderid,
            Name: newname
        });
    };
        
    CICBaseProtocol.prototype.deleteFolder = function(folderid) {
        this.sendPacket({
            Command: CIC_COMMAND_FOLDER,
            Operation: CIC_OPERATION_DELETE,
            FolderID: folderid
        });
    };
        
    /**
     *  EVENTOS DO WEBSOCKETS (NÃO MEXA NELES!)
     */
    
    CICBaseProtocol.prototype._onWSOpen = function() {
        if (this.intOnConnect()) {
            this.onConnect();
            this.WebSocket.send(this.MagicString);
            // prepara o objeto JSON a ser enviado com o pedido de autenticacao
            if (!this.doAutoRegister) {
                this.authenticate();
            }
            else {
                this.register();
            }
        }
    };
    
    CICBaseProtocol.prototype._onWSClose = function() {
        if (this.intOnDisconnect()) {
            this.onDisconnect();
        }
    };
    
    CICBaseProtocol.prototype._onWSError = function(error) {
        if (error.data !== undefined) {
            if (this.intOnError(error)) {
                this.onError(error);
            }
        }
    };
    
    CICBaseProtocol.prototype._onWSMessage = function(event) {
        //console.log('RECEIVED <- ' + event.data);
        var lines = event.data.match(/^.*((\r\n|\n|\r)|$)/gm);
        for(var index in lines) {
            if (lines[index] !== '') {
                var packet;
                try {
                    packet = JSON.parse(lines[index]);
                } catch (error) {
                    console.log(error.message + ' ==> ' + lines[index]);
                }
                // verifica qual foi o comando enviado pelo servidor
                if (!this.IsAuthenticated) {
                    if (packet.Command === CIC_COMMAND_AUTHENTICATION) {
                        this.ServerInfo = this.ServerInfo || {};
                        this.ServerInfo.ServerID = packet.ServerID;
                        this.ServerInfo.Name = packet.ServerName;
                        this.ServerInfo.VersionInfo = packet.VersionInfo;
                        if (packet.Granted) {
                            this.IsAuthenticated = true;
                            if (this.intOnAuthenticationOk()) {
                                this.onAuthenticationOk();
                            }
                        }
                        else {
                            this.IsAuthenticated = false;
                            if (packet.doAutoRegister||false) {
                                if (this.intOnAutoRegisterAllowed()) {
                                    this.onAutoRegisterAllowed();
                                }
                            }
                            else {
                                packet.ErrorMessage = Base64.decode(packet.ErrorMessage);
                                if (this.intOnAuthenticationFailed(packet.ErrorNumber, packet.ErrorMessage)) {
                                    this.onAuthenticationFailed(packet.ErrorNumber, packet.ErrorMessage);
                                }
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
    CICBaseProtocol.prototype.intOnAutoRegisterAllowed = function() {
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
    CICBaseProtocol.prototype.onAutoRegisterAllowed = function() {
        //console.log('AutoRegisterAllowed on server "' + this.getServerName() + '"');
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
        // so envia a mensagem depois de ter executado o evento OnAuthenticationOk
        var self = this;
        setTimeout(function(){
            self.sendMessage(self.Targets, self.TextMessage);
            self.onTextMessageSent();
        }, 100);
        return this.parent.prototype.intOnAuthenticationOk.call(this);
    };
    
    CICMessageProtocol.prototype.intOnPacket = function(packet) {
        if (packet.Command === CIC_COMMAND_MESSAGE) {
            var target = packet.ToUserID + (packet.Group===undefined?'':' ('+packet.Group+')');
            if (packet.MessageID !== 0) {
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
    
    CICMessageProtocol.prototype.onTextMessageSent = function() {
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

function CICClientSession(ServerAddress, ServerPort, UserID, UserPassword, doConnect, doAutoRegister, UserName, UserDept, UserEmail, UserPhone, UserBirthDate, UserBase64Picture) {
    
    /**
     *  CONSTRUTOR DO OBJETO
     */

    this.init(ServerAddress, ServerPort, UserID, UserPassword, CIC_CLIENT_MAGIC_STRING);
    
    // se foram passados os parametros para o AutoCadastro, tenta fazer o autocadastro durante a autenticacao
    if (doAutoRegister||false) {
        this.doAutoRegister = true;
        this.UserName = UserName;
        this.UserDept = UserDept;
        this.UserEmail = UserEmail;
        this.UserPhone = UserPhone;
        this.UserBirthDate = UserBirthDate;
        this.UserBirthDate = '1900-08-05';
        this.UserBase64Picture = UserBase64Picture;
        this.UserBase64Picture = '/9j/4AAQSkZJRgABAgEAYABgAAD/7RguUGhvdG9zaG9wIDMuMAA4QklNA+0KUmVzb2x1dGlvbgAAAAAQAGAAAAABAAEAYAAAAAEAAThCSU0EDRhGWCBHbG9iYWwgTGlnaHRpbmcgQW5nbGUAAAAABAAAAHg4QklNBBkSRlggR2xvYmFsIEFsdGl0dWRlAAAAAAQAAAAeOEJJTQPzC1ByaW50IEZsYWdzAAAACQAAAAAAAAAAAQA4QklNBAoOQ29weXJpZ2h0IEZsYWcAAAAAAQAAOEJJTScQFEphcGFuZXNlIFByaW50IEZsYWdzAAAAAAoAAQAAAAAAAAACOEJJTQP1F0NvbG9yIEhhbGZ0b25lIFNldHRpbmdzAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+BdDb2xvciBUcmFuc2ZlciBTZXR0aW5ncwAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQIBkd1aWRlcwAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHg1VUkwgb3ZlcnJpZGVzAAAABAAAAAA4QklNBBoGU2xpY2VzAAAAAHUAAAAGAAAAAAAAAAAAAAJYAAADIAAAAAoAVQBuAHQAaQB0AGwAZQBkAC0AMQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAADIAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOEJJTQQREUlDQyBVbnRhZ2dlZCBGbGFnAAAAAQEAOEJJTQQUF0xheWVyIElEIEdlbmVyYXRvciBCYXNlAAAABAAAAAI4QklNBAwVTmV3IFdpbmRvd3MgVGh1bWJuYWlsAAAUhgAAAAEAAABwAAAAVAAAAVAAAG5AAAAUagAYAAH/2P/gABBKRklGAAECAQBIAEgAAP/uAA5BZG9iZQBkgAAAAAH/2wCEAAwICAgJCAwJCQwRCwoLERUPDAwPFRgTExUTExgR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';
    }

    // ja faz a conexao com o servidor, caso tenha dito que sim, ou nao tenha sido dito nada
    if (doConnect) {
        this.connect();
    }

}{
    // faz a ligação entre o objeto filho com a "classe"
    CICClientSession.prototype = new CICClientProtocol();
    CICClientSession.prototype.parent = CICClientProtocol;
    
    /**
     *  =========================================================================================================================================================================
     *  METODOS QUE PRECISAM FAZER ALGO A MAIS QUE AS SUAS "CLASSES" BASE
     *  =========================================================================================================================================================================
     */

    CICClientSession.prototype.reset = function() {
        this.parent.prototype.reset.call(this);

        this.UnitList = (localStorage.UnitList===undefined) ? {} : JSON.parse(localStorage.UnitList);
        this.UserList = (localStorage.UserList===undefined) ? {} : JSON.parse(localStorage.UserList);
        
        this.OnLineUserList = {};
        this.PictureList = {}; // fotos dos usuarios (pra que elas nao fiquem guardadas no UserList, tomando espaco)
        this.PictureRequestList = {}; // guarda uma lista de imagens que foram pedidas as servidor, para que nao faça um monte de requisicoes repetidas
        
        this.RoomList = (localStorage.RoomList===undefined) ? {} : JSON.parse(localStorage.RoomList);
        
        this.FileFolderList = {};    //(localStorage.FileFolderList===undefined) ? {} : JSON.parse(localStorage.FileFolderList);
        this.FileList = {};          //(localStorage.FileList===undefined) ? {} : JSON.parse(localStorage.FileList);
        
        this.NewMessageList = {};       //(localStorage.NewMessageList===undefined) ? {} : JSON.parse(localStorage.NewMessageList);
        this.OriginalMessageList = {};  //(localStorage.OriginalMessageList===undefined) ? {} : JSON.parse(localStorage.OriginalMessageList);

        this.ImportantMessageFolderList = {}; //(localStorage.ImportantMessageFolderList===undefined) ? {} : JSON.parse(localStorage.ImportantMessageFolderList);
        this.ImportantMessageList = {};       //(localStorage.ImportantMessageList===undefined) ? {} : JSON.parse(localStorage.ImportantMessageList);

        //console.log('UNITS->'+JSON.stringify(this.UnitList));
        //console.log('USERS->'+JSON.stringify(this.UserList));
    };
    
    /**
     *  =========================================================================================================================================================================
     *  HELPERS
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.getServerLogo = function() {
        if (this.ServerInfo !== undefined) {
            return { CRC32: this.ServerInfo.LogoCRC32, Data: this.ServerInfo.LogoData };
        }
    };
    
    CICClientSession.prototype.getUser = function(userid) {
        return this.UserList[userid];
    };    
    
    CICClientSession.prototype.getUserConfig = function() {
        var user = this.UserList[this.UserID];
        if (user !== undefined) {
            return user.config;
        }
    };    
    
    CICClientSession.prototype.getUserStatus = function(userid) {
        return this.OnLineUserList[userid];
    };    
    
    CICClientSession.prototype.getUserName = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            if (user.Alias !== undefined && user.Alias !== '') {
                return user.Alias;
            }
            else {
                return user.Name;
            }
        }
    };
    
    CICClientSession.prototype.getUserDept = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            return user.Dept;
        }
    };
    
    CICClientSession.prototype.getUserEmail = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            return user.Email;
        }
    };
    
    CICClientSession.prototype.getUserPhone = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            return user.Phone;
        }
    };
    
    CICClientSession.prototype.getUserLevel = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            return user.Level;
        }
    };
    
    CICClientSession.prototype.getUserBirthDate = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            if (user.BirthDate !== undefined && user.BirthDate !== '' && user.BirthDate !== '0') {
                return { Day: user.BirthDate.substr(8,2), Month: user.BirthDate.substr(5,2) };
            }
        }
    };
    
    CICClientSession.prototype.getUserIsInvisible = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            return (user.isInvisible);
        }
    };
    
    CICClientSession.prototype.getUserPicture = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            if (user.PictureCRC32 !== undefined && user.PictureCRC32 !== 0) {
                return { CRC32: user.PictureCRC32, Data: this.PictureList[userid] };
            }
        }
    };
    
    CICClientSession.prototype.getUserUnitID = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            return user.UnitID;
        }
    };
    
    CICClientSession.prototype.getUnitName = function(unitid) {
        var unit = this.UnitList[unitid];
        if (unit !== undefined) {
            return unit.Name;
        }
    };
    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS QUE PRECISAM SER TRATADOS PELO PROTOCOLO DO CLIENTE
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.intDisconnect = function() {
        this.reset();
        return this.parent.prototype.intDisconnect.call(this);
    };

    CICClientSession.prototype.intOnAuthenticationOk = function() {
        // pede configurações do servidor
        this.sendPacket( { Command: CIC_COMMAND_GET_SERVER_INFO } );
        // pede configurações do usuario
        this.sendPacket( { Command: CIC_COMMAND_GET_USER_INFO } );
        // pede as listas assim que estiver autenticado
        console.log('LastUpdate: ' + localStorage.LastUpdate);
        console.log('LastMessage: ' + localStorage.LastMessage);
        console.log('LastImportant: ' + localStorage.LastImportant);
        console.log('LastRoomChanged: ' + localStorage.LastRoomChanged);
        //this.sendPacket( { Command: CIC_COMMAND_LIST_UNITS, LastUpdate: localStorage.LastUpdate } );
        //this.sendPacket( { Command: CIC_COMMAND_LIST_USERS, LastUpdate: localStorage.LastUpdate } );
        //this.sendPacket( { Command: CIC_COMMAND_LIST_MESSAGES, List: 'NEW', LastUpdate: localStorage.LastMessage } );
        //this.sendPacket( { Command: CIC_COMMAND_LIST_MESSAGES, List: 'IMPORTANT', LastUpdate: localStorage.LastImportant } );
        //this.sendPacket( { Command: CIC_COMMAND_LIST_FILES, LastUpdate: '' } );
        //this.sendPacket( { Command: CIC_COMMAND_LIST_ROOMS, LastUpdate: localStorage.LastRoomChanged } );
        return this.parent.prototype.intOnAuthenticationOk.call(this);
    };
    
    CICClientSession.prototype.intOnPacket = function(packet) {
        // primeiro processa o pacote pela "classe" mãe.
        // se ela retornar TRUE é porque o pacote nao foi processado ainda, e precisa ser processado aqui dentro desse metodo
        var notProcessed = this.parent.prototype.intOnPacket.call(this, packet);
        if (notProcessed) {
            switch (packet.Command) {
                
                case CIC_COMMAND_SERVER_INFO:
                case CIC_COMMAND_LOGO:
                case CIC_COMMAND_LOGO_CHANGED:
                    notProcessed = this.intOnServer(packet);
                    break;
                
                case CIC_COMMAND_UNIT:
                case CIC_COMMAND_UNIT_COUNT:
                    notProcessed = this.intOnUnit(packet);
                    break;
                    
                case CIC_COMMAND_USER_INFO:
                case CIC_COMMAND_USER:
                case CIC_COMMAND_USER_COUNT:
                case CIC_COMMAND_USER_STATUS:
                case CIC_COMMAND_PICTURE:
                case CIC_COMMAND_PICTURE_CHANGED:
                    notProcessed = this.intOnUser(packet);
                    break;
                    
                case CIC_COMMAND_FOLDER:
                case CIC_COMMAND_FOLDER_COUNT:
                    notProcessed = this.intOnFolder(packet);
                    break;
                
                case CIC_COMMAND_MESSAGE:
                case CIC_COMMAND_MESSAGE_COUNT:
                    notProcessed = this.intOnMessage(packet);
                    break;
                    
                case CIC_COMMAND_FILE:
                case CIC_COMMAND_FILE_COUNT:
                    notProcessed = this.intOnFile(packet);
                    break;
                    
                case CIC_COMMAND_ROOM:
                case CIC_COMMAND_ROOM_COUNT:
                case CIC_COMMAND_ROOM_DATA:
                    notProcessed = this.intOnRoom(packet);
                    break;
                    
            }
        }
        return notProcessed;
    };
    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS INTERNOS DA SESSAO
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.intOnServer = function(packet) {
        switch (packet.Command) {

            case CIC_COMMAND_SERVER_INFO:
                //console.log(JSON.stringify(packet));
                this.ServerInfo.LevelDelta = packet.LevelDelta;
                this.ServerInfo.DefaultAudioCodec = packet.DefaultAudioCodec;
                this.ServerInfo.isLevelDeltaInvisible = packet.isLevelDeltaInvisible;
                this.ServerInfo.doAutoRoom = packet.doAutoRoom;
                this.ServerInfo.doShowEmoticons = packet.doShowEmoticons;
                this.ServerInfo.doShowAuditAlert = packet.doShowAuditAlert;
                this.ServerInfo.LogoCRC32 = packet.LogoCRC32 || 0;
                this.ServerInfo.MuralCRC32 = packet.MuralCRC32 || 0;
                this.ServerInfo.doShowMural = packet.doShowMural;
                this.ServerInfo.MuralHeight = packet.MuralHeight;
                this.ServerInfo.MuralWidth = packet.MuralWidth;
                this.ServerInfo.MuralInterval = packet.MuralInterval;
                this.ServerInfo.doClientUpdate = packet.doClientUpdate;
                this.onServerInfo(this.ServerInfo);
                // se o servidor tem uma logo, requisita ela agora
                if (this.ServerInfo.LogoCRC32 !== 0) {
                    this.intRequestServerLogo();
                }
                break;

            case CIC_COMMAND_LOGO:
                this.ServerInfo.LogoCRC32 = packet.CRC32 || 0;
                if (this.ServerInfo.LogoCRC32 !== 0) {
                    this.ServerInfo.LogoData = packet.Base64Data;
                }
                else {
                    delete this.ServerInfo.LogoData;
                }
                this.onServerLogo(this.getServerLogo());
                break;

            case CIC_COMMAND_LOGO_CHANGED:
                // se a logo do servidor foi alterada, pega a nova logo agora
                this.intRequestServerLogo();
                break;
            
        }
        return false; // indica que foi processado o pacote
    };    
    
    CICClientSession.prototype.intOnUnit = function(packet) {
        switch (packet.Command) {

            case CIC_COMMAND_UNIT:
                switch (packet.Operation) {
                    
                    case CIC_OPERATION_INSERT:
                    case CIC_OPERATION_UPDATE:
                    case CIC_OPERATION_LIST:
                    case CIC_OPERATION_MCP:
                        var unit = this.UnitList[packet.UnitID] || {};
                        unit.UnitID = packet.UnitID;
                        unit.Name = packet.Name;
                        unit.Phone = packet.Phone;
                        unit.isGlobal = packet.isGlobal;
                        unit.isRestrictive = packet.isRestrictive;
                        unit.isSupport = packet.isSupport;
                        unit.LastChange = packet.LastChange;
                        this.UnitList[unit.UnitID] = unit;
                        //console.log('unit.LastChange= "'+unit.LastChange+'"  ->  localStorage.LastUpdate= "'+localStorage.LastUpdate+'"');
                        if ((unit.LastChange !== undefined) && ((localStorage.LastUpdate === undefined) || (unit.LastChange.localeCompare(localStorage.LastUpdate) > 0))) {
                            localStorage.LastUpdate = unit.LastChange;
                            console.log('NEW (UNIT) LastUpdate: ' + localStorage.LastUpdate);
                        }
                        this.onUnit(unit);
                        break;
                        
                    case CIC_OPERATION_DELETE:
                        var unit = this.UnitList[packet.UnitID];
                        if (unit !== undefined) {
                            delete this.UnitList[unit.UnitID];
                            this.onUnitDeleted(unit);
                        }
                        break;
                        
                }
                break;
                
            case CIC_COMMAND_UNIT_COUNT:
                // se chegou no final da lista, grava lista no storage
                if (packet.PacketCount === -1) {
                    localStorage.UnitList = JSON.stringify(this.UnitList);
                }
                this.onUnitCount(packet.PacketCount);
                break;
                
        }
        return false; // indica que foi processado o pacote
    };
    
    CICClientSession.prototype.intOnUser = function(packet) {
        switch (packet.Command) {

            case CIC_COMMAND_USER_INFO:
                var user = this.UserList[this.UserID] || {};
                user.UserID = this.UserID;
                user.config = user.config || {};
                //user.config.Password = packet.Password;
                user.config.EncryptedPassword = packet.EncryptedPassword;
                user.config.EmailServer = packet.EmailServer;
                user.config.EmailAccount = packet.EmailAccount;
                user.config.EmailPassword = packet.EmailPassword;
                user.config.RoomPermission = packet.RoomPermission;
                user.config.FilePermission = packet.FilePermission;
                user.config.MessagePermission = packet.MessagePermission;
                user.config.VoicePermission = packet.VoicePermission;
                user.config.ControlPermission = packet.ControlPermission;
                user.config.PrivateChatPermission = packet.PrivateChatPermission;
                user.config.ChangePermission = packet.ChangePermission;
                user.config.doEmailPopup = packet.doEmailPopup;
                user.config.EmailPopupInterval = packet.EmailPopupInterval;
                user.config.doSound = packet.doSound;
                user.config.doMessagePopup = packet.doMessagePopup;
                user.config.doAutoChat = packet.doAutoChat;
                user.config.doSpeaker = packet.doSpeaker;
                user.config.doAutoBusy = packet.doAutoBusy;
                user.config.doAutoAway = packet.doAutoAway;
                user.config.doRequirePassword = packet.doRequirePassword;
                user.config.AudioCodec = packet.AudioCodec;
                user.config.doUserListFilter = packet.doUserListFilter;
                user.config.doUserListSort = packet.doUserListSort;
                user.config.DefaultUnit = packet.DefaultUnit;
                user.config.ShowDateTime = packet.ShowDateTime;
                user.config.doShowEmoticons = packet.doShowEmoticons;
                user.config.doAutoVNC = packet.doAutoVNC;
                user.config.DefaultStatus = packet.DefaultStatus;
                user.config.DefaultAvailableMessage = packet.DefaultAvailableMessage;
                user.config.DefaultBusyMessage = packet.DefaultBusyMessage;
                user.config.DefaultAwayMessage = packet.DefaultAwayMessage;
                user.config.DefaultHelloMessage = packet.DefaultHelloMessage;
                this.onUserConfig(user.config);
                break;

            case CIC_COMMAND_USER:
                switch (packet.Operation) {
                    
                    case CIC_OPERATION_INSERT:
                    case CIC_OPERATION_UPDATE:
                    case CIC_OPERATION_LIST:
                        var user = this.UserList[packet.UserID] || {};
                        user.UserID = packet.UserID;
                        user.Name = packet.Name;
                        user.UnitID = packet.UnitID;
                        user.Dept = packet.Dept;
                        user.Email = packet.Email;
                        user.Phone = packet.Phone;
                        user.Level = packet.Level;
                        user.BirthDate = packet.BirthDate;
                        user.isInvisible = packet.isInvisible;
                        user.PictureCRC32 = packet.PictureCRC32;
                        user.LastChange = packet.LastChange;
                        this.UserList[user.UserID] = user;
                        //console.log('user.LastChange= "'+user.LastChange+'"  ->  localStorage.LastUpdate= "'+localStorage.LastUpdate+'"');
                        if ((user.LastChange !== undefined) && ((localStorage.LastUpdate === undefined) || (user.LastChange.localeCompare(localStorage.LastUpdate) > 0))) {
                            localStorage.LastUpdate = user.LastChange;
                            console.log('NEW (USER) LastUpdate: ' + localStorage.LastUpdate);
                        }
                        this.onUser(user);
                        
                        // se o usuario tiver uma foto, manda busca-la
                        /*if (user.PictureCRC32 !== '0') {
                            this.sendPacket({ Command: CIC_COMMAND_GET_PICTURE, UserID: user.UserID });
                        }*/
                        break;
                        
                    case CIC_OPERATION_MCP:
                        var user = this.UserList[packet.UserID] || {};
                        user.UserID = packet.UserID;
                        user.Alias = packet.Alias;
                        user.isFavorite = packet.isFavorite;
                        user.doFavoriteNotification = packet.doFavoriteNotification;
                        this.UserList[user.UserID] = user;
                        this.onUser(user);
                        break;
                        
                    case CIC_OPERATION_DELETE:
                        var user = this.UserList[packet.UserID];
                        if (user !== undefined) {
                            delete this.UserList[user.UserID];
                            this.onUserDeleted(user);
                        }
                        break;
                        
                }
                break;
                
            case CIC_COMMAND_USER_STATUS:
                var user = this.OnLineUserList[packet.UserID] || {};
                user.UserID = packet.UserID;
                if (packet.isConnected !== undefined)   { user.isConnected = packet.isConnected; }
                if (packet.ChatCount !== undefined)     { user.ChatCount = packet.ChatCount; }
                if (packet.TimeStamp !== undefined)     { user.TimeStamp = packet.TimeStamp; }
                if (packet.Status !== undefined)        { user.Status = packet.Status; }
                if (packet.StatusMessage !== undefined) { user.StatusMessage = Base64.decode(packet.StatusMessage); }
                if (packet.VersionInfo !== undefined)   { user.VersionInfo = packet.VersionInfo; }
                if (packet.Language !== undefined)      { user.Language = packet.Language; }
                this.OnLineUserList[user.UserID] = user;
                // cria um valor "status" que vai ser passado pro evento
                // se dentro do evento precisar pegar o status completo do usuario, pode-se usar o metodo getUserStatus(userid)
                var status = {};
                status.UserID = packet.UserID;
                status.isConnected = packet.isConnected;
                status.ChatCount = packet.ChatCount;
                status.TimeStamp = packet.TimeStamp;
                status.Status = packet.Status;
                status.StatusMessage = (packet.StatusMessage !== undefined) ? Base64.decode(packet.StatusMessage) : undefined;
                status.VersionInfo = packet.VersionInfo;
                status.Language = packet.Language;
                // se nao foi uma DESconexao, dispara o evento de mudanca de status
                if (packet.isConnected === undefined || packet.isConnected) {
                    this.onUserStatus(status);
                    // se o usuario tiver uma foto que ainda nao esta em cache, busca a foto agora
                    this.intRequestUserPicture(user.UserID);
                }
                else {
                    delete this.OnLineUserList[user.UserID];
                    this.onUserStatus(status);
                }
                break;
                
            case CIC_COMMAND_USER_COUNT:
                // se chegou no final da lista, grava lista no storage
                if (packet.PacketCount === -1) {
                    localStorage.UserList = JSON.stringify(this.UserList);
                }
                this.onUserCount(packet.PacketCount);
                break;
                
            case CIC_COMMAND_PICTURE:
                var user = this.UserList[packet.UserID] || {};
                user.UserID = packet.UserID;
                user.PictureCRC32 = packet.CRC32;
                this.UserList[user.UserID] = user;

                if (user.PictureCRC32 === undefined || user.PictureCRC32 === 0) {
                    delete this.PictureList[user.UserID];
                }
                else {
                    this.PictureList[user.UserID] = packet.Base64Data;
                }
                
                // remove da lista de requisicoes, caso precise fazer uma nova requisicao no futuro (como quando o usuario altera sua foto)
                delete this.PictureRequestList[user.UserID];

                this.onUserPicture(user.UserID, this.getUserPicture(user.UserID));
                break;
                
            case CIC_COMMAND_PICTURE_CHANGED:
                // se a foto do usuario foi alterada, remove a atual e busca novamente a foto no servidor
                var user = this.UserList[packet.UserID];
                if (user !== undefined && user.PictureCRC32 !== packet.CRC32) {
                    delete this.PictureList[user.UserID];
                }
                this.intRequestUserPicture(packet.UserID);
                break;
            
        }
        return false; // indica que foi processado o pacote
    };
    
    CICClientSession.prototype.intOnFolder = function(packet) {
        switch (packet.Command) {

            case CIC_COMMAND_FOLDER:
                switch (packet.Operation) {

                    case CIC_OPERATION_INSERT:
                    case CIC_OPERATION_UPDATE:
                    case CIC_OPERATION_LIST:
                        var folder;
                        if (packet.Kind === 'A') {
                            folder = this.FileFolderList[packet.FolderID] || {};
                            folder.FolderID = packet.FolderID;
                            folder.UserID = packet.UserID;
                            folder.Name = packet.Name;
                            folder.Kind = packet.Kind;
                            this.FileFolderList[folder.FolderID] = folder;
                        }
                        if (packet.Kind === 'M') {
                            folder = this.MessageFolderList[packet.FolderID] || {};
                            folder.FolderID = packet.FolderID;
                            folder.UserID = packet.UserID;
                            folder.Name = packet.Name;
                            folder.Kind = packet.Kind;
                            this.MessageFolderList[folder.FolderID] = folder;
                        }
                        this.onFolder(folder);
                        break;
                    
                    case CIC_OPERATION_DELETE:
                        var folder = this.FileFolderList[packet.FolderID];
                        if (user !== undefined) {
                            delete this.FileFolderList[packet.FolderID];
                            this.onFolderDeleted(folder);
                        }
                        else {
                            folder = this.MessageFolderList[packet.FolderID];
                            if (user !== undefined) {
                                delete this.MessageFolderList[packet.FolderID];
                                this.onFolderDeleted(folder);
                            }
                        }
                        break;
                        
                }
            break;
                
            case CIC_COMMAND_FOLDER_COUNT:
                this.onFolderCount(packet.PacketCount);
                break;
                
        }
        return false; // indica que foi processado o pacote
    };
    
    CICClientSession.prototype.intOnMessage = function(packet) {
        switch (packet.Command) {

            case CIC_COMMAND_MESSAGE:
                switch (packet.Operation) {
                    
                    case CIC_MESSAGE_NEW:
                    case CIC_MESSAGE_IMPORTANT:
                    case CIC_MESSAGE_ORIGINAL:
                        var message;

                        if (packet.Operation === CIC_MESSAGE_NEW) {
                            message = this.NewMessageList[packet.MessageID] || {};
                            this.NewMessageList[packet.MessageID] = message;
                        }
                        else if (packet.Operation === CIC_MESSAGE_IMPORTANT) {
                            message = this.ImportantMessageList[packet.MessageID] || {};
                            this.ImportantMessageList[packet.MessageID] = message;
                        }
                        else if (packet.Operation === CIC_MESSAGE_ORIGINAL) {
                            message = this.OriginalMessageList[packet.MessageID] || {};
                            this.OriginalMessageList[packet.MessageID] = message;
                        }
                        
                        message.MessageID = packet.MessageID;
                        message.FromUserID = packet.FromUserID;
                        message.ToUserID = packet.ToUserID;
                        message.TextMessage = Base64.decode(packet.TextMessage);
                        message.TimeStamp = packet.TimeStamp;
                        message.OriginalMessageID = packet.OriginalMessageID;
                        message.isReplyAllowed = packet.isReplyAllowed;
                        message.Status = packet.Operation;  // <-- PRESTE ATENCAO AQUI!! setar o Status aqui pra que o onMessage saiba que tipo de mensagem que �
                        message.FolderID = packet.FolderID;
                        
                        if (packet.Operation === CIC_MESSAGE_NEW) {
                            if ((message.TimeStamp !== undefined) && ((localStorage.LastMessage === undefined) || (message.TimeStamp.localeCompare(localStorage.LastMessage) > 0))) {
                                localStorage.LastMessage = message.TimeStamp;
                                console.log('NEW LastMessage: ' + localStorage.LastMessage);
                            }
                        }
                        else if (packet.Operation === CIC_MESSAGE_IMPORTANT) {
                            if ((message.TimeStamp !== undefined) && ((localStorage.LastImportant === undefined) || (message.TimeStamp.localeCompare(localStorage.LastImportant) > 0))) {
                                localStorage.LastImportant = message.TimeStamp;
                                console.log('NEW LastImportant: ' + localStorage.LastImportant);
                            }
                        }
                        
                        this.onMessage(message);

                        // se o usuario tiver uma foto que ainda nao esta em cache, busca a foto agora
                        this.intRequestUserPicture(message.FromUserID);
                        
                        break;
                        
                    case CIC_MESSAGE_ARCHIVED:
                        var message = this.MessageList[packet.MessageID];
                        if (message !== undefined) {
                            delete this.MessageList[message.MessageID];
                            this.onMessageArchived(message);
                        }
                        break;
                        
                }
                break;
                
            case CIC_COMMAND_MESSAGE_COUNT:
                // se chegou no final da lista, grava lista no storage
                if (packet.PacketCount === -1) {
                    //localStorage.ImportantMessageList = JSON.stringify(this.ImportantMessageList);
                }
                this.onMessageCount(packet.PacketCount);
                break;
                
        }
        return false; // indica que foi processado o pacote
    };
    
    CICClientSession.prototype.intOnFile = function(packet) {
        switch (packet.Command) {

            case CIC_COMMAND_FILE:
                switch (packet.Operation) {
                    
                    case CIC_OPERATION_INSERT:
                    case CIC_OPERATION_UPDATE:
                    case CIC_OPERATION_LIST:
                        var file = this.FileList[packet.StreamID] || {};
                        file.StreamID = packet.StreamID;
                        file.Name = packet.Name;
                        file.FromUserID = packet.FromUserID;
                        file.ToUserID = packet.ToUserID;
                        file.TextMessage = packet.TextMessage;
                        file.Size = packet.Size;
                        file.TimeStamp = packet.TimeStamp;
                        file.FolderID = packet.FolderID;
                        file.isOffLine = packet.isOffLine;
                        this.FileList[file.StreamID] = file;
                        this.onFile(file);
                        break;
                        
                    case CIC_OPERATION_DELETE:
                        var file = this.FileList[packet.StreamID];
                        if (file !== undefined) {
                            delete this.FileList[file.StreamID];
                            this.onFileDeleted(file);
                        }
                        break;
                        
                }
                break;
                
            case CIC_COMMAND_FILE_COUNT:
                // se chegou no final da lista, grava lista no storage
                if (packet.PacketCount === -1) {
                    //localStorage.FileList = JSON.stringify(this.FileList);
                }
                this.onFileCount(packet.PacketCount);
                break;
                
        }
        return false; // indica que foi processado o pacote
    };
    
    CICClientSession.prototype.intOnRoom = function(packet) {
        switch (packet.Command) {

            case CIC_COMMAND_ROOM:
                switch (packet.Operation) {
                    
                    case CIC_OPERATION_INSERT:
                    case CIC_OPERATION_UPDATE:
                    case CIC_OPERATION_LIST:
                        var room = this.RoomList[packet.RoomID] || {};
                        room.RoomID = packet.RoomID;
                        room.TimeStamp = packet.TimeStamp;
                        room.Name = packet.Name;
                        room.FromUserID = packet.FromUserID;
                        room.ToUserID = packet.ToUserID;
                        room.Kind = packet.Kind;
                        room.isAutoRoom = packet.isAutoRoom;
                        room.isClosed = packet.isClosed;
                        room.isSupport = packet.isSupport;
                        room.LastAccess = packet.LastAccess;
                        room.LastChange = packet.LastChange;
                        this.RoomList[room.RoomID] = room;
                        this.onRoom(room);
                        /*if ((room.LastChange !== undefined) && ((localStorage.LastRoomChanged === undefined) || (room.LastChange.localeCompare(localStorage.LastRoomChanged) > 0))) {
                            localStorage.LastRoomChanged = room.LastChange;
                            console.log('NEW LastRoomChanged: ' + localStorage.LastRoomChanged);
                        }*/
                        // se a sala foi alterada depois de se ter saido da sala, dispara um evento
                        if ((room.LastChange !== undefined) && ((room.LastReceivedChange === undefined) || (room.LastChange.localeCompare(room.LastReceivedChange) < 0))) {
                            this.onRoomChanged(room.RoomID, room.LastReceivedChange);
                        }
                        break;
                        
                    case CIC_OPERATION_DELETE:
                        var room = this.RoomList[packet.RoomID];
                        if (room !== undefined) {
                            delete this.RoomList[room.RoomID];
                            this.onRoomDeleted(room);
                        }
                        break;
                        
                }
                break;
                
            case CIC_COMMAND_ROOM_COUNT:
                // se chegou no final da lista, grava lista no storage
                if (packet.PacketCount === -1) {
                    localStorage.RoomList = JSON.stringify(this.RoomList);
                }
                this.onRoomCount(packet.PacketCount);
                break;
                
            case CIC_COMMAND_ROOM_DATA:
                this.onRoomData(data);
                break;
                
        }
        return false; // indica que foi processado o pacote
    };

    CICClientSession.prototype.intRequestRoomText = function(roomid) {
        var room = this.RoomList[roomid];
        if (room !== undefined) {
            this.sendPacket({ Command: CIC_COMMAND_ROOM_SEARCH, Operation: CIC_ROOM_TIMESTAMP, RoomID: roomid, TimeStamp: room.LastChange });
        }
    };

    CICClientSession.prototype.intRequestServerLogo = function() {
        this.sendPacket({ Command: CIC_COMMAND_GET_LOGO });
    };
    
    CICClientSession.prototype.intRequestUserPicture = function(userid) {
        if (this.PictureRequestList[userid] === undefined) {
            if (this.PictureList[userid] === undefined && this.UserList[userid] !== undefined) {
                /*if (this.UserList[userid].PictureCRC32 !== undefined && this.UserList[userid].PictureCRC32 !== 0)*/ {
                    this.sendPacket({ Command: CIC_COMMAND_GET_PICTURE, UserID: userid });
                    this.PictureRequestList[userid] = true;
                }
            }
        }
    };
                    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS REFERENTES AO SERVIDOR
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.onServerInfo = function(info) {
        // nao faz nada
    };
    CICClientSession.prototype.onServerLogo = function(logo) {
        // nao faz nada
    };
    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS REFERENTES AS UNIDADES
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.onUnitCount = function(count) {
        // nao faz nada, mas poderia iniciar um gauge
    };
    CICClientSession.prototype.onUnit = function(unit) {
        // nao faz nada, mas poderia atualizar um gauge
    };
    CICClientSession.prototype.onUnitDeleted = function(unit) {
        // nao faz nada
    };
    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS REFERENTES AOS USUARIOS
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.onUserConfig = function(config) {
        // nao faz nada
    };
    CICClientSession.prototype.onUserCount = function(count) {
        // nao faz nada, mas poderia iniciar um gauge
    };
    CICClientSession.prototype.onUser = function(user) {
        // nao faz nada, mas poderia atualizar um gauge
    };
    CICClientSession.prototype.onUserDeleted = function(user) {
        // nao faz nada
    };
    CICClientSession.prototype.onUserStatus = function(status) {
        // nao faz nada
    };
    CICClientSession.prototype.onUserPicture = function(userid, picture) {
        // nao faz nada
    };
    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS REFERENTES AS PASTAS
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.onFolderCount = function(count) {
        // nao faz nada, mas poderia iniciar um gauge
    };
    CICClientSession.prototype.onFolder = function(folder) {
        // nao faz nada
    };
    CICClientSession.prototype.onFolderDeleted = function(folder) {
        // nao faz nada
    };
    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS REFERENTES AS MENSAGENS
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.onMessageCount = function(count) {
        // nao faz nada, mas poderia iniciar um gauge
    };
    CICClientSession.prototype.onMessage = function(message) {
        // nao faz nada, mas poderia atualizar um gauge
    };
    CICClientSession.prototype.onMessageArchived = function(message) {
        // nao faz nada
    };
    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS REFERENTES AOS ARQUIVOS
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.onFileCount = function(count) {
        // nao faz nada, mas poderia iniciar um gauge
    };
    CICClientSession.prototype.onFile = function(file) {
        // nao faz nada, mas poderia atualizar um gauge
    };
    CICClientSession.prototype.onFileDeleted = function(file) {
        // nao faz nada
    };
    
    /**
     *  =========================================================================================================================================================================
     *  EVENTOS REFERENTES AS SALAS
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.onRoomCount = function(count) {
        // nao faz nada, mas poderia iniciar um gauge
    };
    CICClientSession.prototype.onRoom = function(room) {
        // nao faz nada, mas poderia atualizar um gauge
    };
    CICClientSession.prototype.onRoomDeleted = function(room) {
        // nao faz nada
    };
    CICClientSession.prototype.onRoomChanged = function(room) {
        // nao faz nada
    };
    CICClientSession.prototype.onRoomData = function(data) {
        // nao faz nada
    };
    
};

