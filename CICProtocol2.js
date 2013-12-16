/**
*
*  Protocolos do CIC/Comunicador IntraChat
*  https://www.intrachat.com.br/
*
**/

// =============================================================================
var CIC_PROTOCOL_VERSION  = '396';
var CIC_PROTOCOL_REVISION = 'aWS';
var CIC_PROTOCOL_PLATFORM = 'M';
// =============================================================================
var CIC_CLIENT_MAGIC_STRING  = '@BOBJDCDLEIDEBNEDDODJDCDODNBJBO\r\n';
var CIC_MESSAGE_MAGIC_STRING = 'OBJBCEGDODEDGDADCECEEDMDDDNBEECEJBOB@\r\n';
// =============================================================================
var CIC_OPERATION_INSERT   = '0';
var CIC_OPERATION_UPDATE   = '1';
var CIC_OPERATION_DELETE   = '2';
var CIC_OPERATION_SYNC     = '3';
var CIC_OPERATION_LIST     = '4';
var CIC_OPERATION_MODIFY   = '5';
var CIC_OPERATION_LAG      = '6';
var CIC_OPERATION_USERUPD  = '7';
var CIC_OPERATION_MCP      = '9'; // codigo especial para "Meus Contatos Pessoais"
var CIC_OPERATION_SENT     = '100';
var CIC_OPERATION_RECEIVED = '101';
var CIC_OPERATION_ERROR    = '255';
// =============================================================================
var CIC_MESSAGE_NEW        = '0';
var CIC_MESSAGE_ARCHIVED   = '1';
var CIC_MESSAGE_IMPORTANT  = '2';
var CIC_MESSAGE_SENT       = '8';
var CIC_MESSAGE_RECEIVED   = '16';
var CIC_MESSAGE_ORIGINAL   = '32';
var CIC_MESSAGE_FOLDER     = '128';
// =============================================================================
var CIC_ROOM_ALL        = '0';
var CIC_ROOM_LINES      = '1';
var CIC_ROOM_MINUTES    = '2';
var CIC_ROOM_TODAY      = '3';
var CIC_ROOM_TIMESTAMP  = '4';
// =============================================================================
var CIC_COMMAND_AUTHENTICATE    = '1';
var CIC_COMMAND_AUTHENTICATION  = '101';

var CIC_COMMAND_KEEPALIVE       = '111';
var CIC_COMMAND_KEEPALIVE_BACK  = '8';

var CIC_COMMAND_GET_SERVER_INFO = '32';
var CIC_COMMAND_GET_LOGO        = '195';
var CIC_COMMAND_GET_PICTURE     = '196';
var CIC_COMMAND_GET_CONFIG      = '197';
var CIC_COMMAND_GET_MURAL       = '199';

var CIC_COMMAND_SERVER_INFO     = '214';
var CIC_COMMAND_CONFIG          = '185';
var CIC_COMMAND_LOGO            = '186';
var CIC_COMMAND_PICTURE         = '187';
var CIC_COMMAND_MURAL           = '189';

var CIC_COMMAND_LOGO_CHANGED    = '190';
var CIC_COMMAND_PICTURE_CHANGED = '191';
var CIC_COMMAND_CONFIG_CHANGED  = '192';
var CIC_COMMAND_MURAL_CHANGED   = '194';

var CIC_COMMAND_LIST_ALL        = '33';
var CIC_COMMAND_LIST_UNITS      = '34';
var CIC_COMMAND_LIST_USERS      = '35';
var CIC_COMMAND_LIST_MESSAGES   = '36';
var CIC_COMMAND_LIST_ROOMS      = '37';
var CIC_COMMAND_LIST_FILES      = '38';
var CIC_COMMAND_LIST_FOLDERS    = '39';

var CIC_COMMAND_UNIT_COUNT      = '42';
var CIC_COMMAND_USER_COUNT      = '43';
var CIC_COMMAND_MESSAGE_COUNT   = '44';
var CIC_COMMAND_ROOM_COUNT      = '45';
var CIC_COMMAND_FILE_COUNT      = '46';
var CIC_COMMAND_FOLDER_COUNT    = '47';

var CIC_COMMAND_UNIT            = '115';
var CIC_COMMAND_USER            = '103';
var CIC_COMMAND_MESSAGE         = '10';
var CIC_COMMAND_ROOM            = '116';
var CIC_COMMAND_FILE            = '138';
var CIC_COMMAND_FOLDER          = '235';
var CIC_COMMAND_USER_STATUS     = '71';

var CIC_COMMAND_ROOM_NEW        = '50';
var CIC_COMMAND_ROOM_CHANGE     = '51';
var CIC_COMMAND_ROOM_DELETE     = '52';
var CIC_COMMAND_ROOM_INVITE     = '53';
var CIC_COMMAND_ROOM_REVOKE     = '54';
var CIC_COMMAND_ROOM_JOIN       = '55';
var CIC_COMMAND_ROOM_LEAVE      = '56';
var CIC_COMMAND_ROOM_DENIED     = '57';
var CIC_COMMAND_ROOM_GRANTED    = '58';
var CIC_COMMAND_ROOM_DATA       = '59';
var CIC_COMMAND_ROOM_ACCEPT     = '60';
var CIC_COMMAND_ROOM_REJECT     = '61';
var CIC_COMMAND_ROOM_USERLIST   = '62';
var CIC_COMMAND_ROOM_WRITING    = '63';
var CIC_COMMAND_ROOM_SEARCH     = '64';
// =============================================================================

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
        this.ServerInfo = {};
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
    
    CICBaseProtocol.prototype.sendMessage = function(targets, text) {
        this.sendPacket({
            Command: CIC_COMMAND_MESSAGE,
            ToUserID: targets,
            TextMessage: Base64.encode(text)
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
        console.log(event.data);
        var lines = event.data.match(/^.*((\r\n|\n|\r)|$)/gm);
        for(var index in lines) {
            if (lines[index] !== '') {
                var packet;
                try {
                    packet = JSON.parse(lines[index]);
                } catch (error) {
                    console.log(lines[index]);
                }
                // verifica qual foi o comando enviado pelo servidor
                if (!this.IsAuthenticated) {
                    if (packet.Command === CIC_COMMAND_AUTHENTICATION) {
                        this.ServerInfo.ServerID = packet.ServerID;
                        this.ServerInfo.Name = packet.ServerName;
                        this.ServerInfo.VersionInfo = packet.VersionInfo;
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
     *  =========================================================================================================================================================================
     *  EVENTOS QUE PRECISAM SER TRATADOS PELO PROTOCOLO DO CLIENTE
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
    
    CICClientSession.prototype.intDisconnect = function() {
        this.reset();
        return this.parent.prototype.intDisconnect.call(this);
    };

    CICClientSession.prototype.intOnAuthenticationOk = function() {
        // pede configurações do servidor
        this.sendPacket( { Command: CIC_COMMAND_GET_SERVER_INFO } );
        // pede as listas assim que estiver autenticado
        console.log('LastUpdate: ' + localStorage.LastUpdate);
        console.log('LastMessage: ' + localStorage.LastMessage);
        console.log('LastImportant: ' + localStorage.LastImportant);
        this.sendPacket( { Command: CIC_COMMAND_LIST_UNITS, LastUpdate: localStorage.LastUpdate } );
        this.sendPacket( { Command: CIC_COMMAND_LIST_USERS, LastUpdate: localStorage.LastUpdate } );
        this.sendPacket( { Command: CIC_COMMAND_LIST_MESSAGES, List: 'NEW', LastUpdate: localStorage.LastMessage } );
        this.sendPacket( { Command: CIC_COMMAND_LIST_MESSAGES, List: 'IMPORTANT', LastUpdate: localStorage.LastImportant } );
        this.sendPacket( { Command: CIC_COMMAND_LIST_FILES, LastUpdate: '' } );
        this.sendPacket( { Command: CIC_COMMAND_LIST_ROOMS, LastUpdate: localStorage.LastRoomChanged } );
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
                this.ServerInfo.LogoCRC32 = packet.LogoCRC32;
                this.ServerInfo.MuralCRC32 = packet.MuralCRC32;
                this.ServerInfo.doShowMural = packet.doShowMural;
                this.ServerInfo.MuralHeight = packet.MuralHeight;
                this.ServerInfo.MuralWidth = packet.MuralWidth;
                this.ServerInfo.MuralInterval = packet.MuralInterval;
                this.ServerInfo.doClientUpdate = packet.doClientUpdate;
                this.onServerInfo(this.ServerInfo);
                // se o servidor tem uma logo, requisita ela agora
                if (this.ServerInfo.LogoCRC32 !== '0') {
                    this.sendPacket({ Command: CIC_COMMAND_GET_LOGO });
                }
                break;

            case CIC_COMMAND_LOGO:
                this.ServerInfo.LogoCRC32 = packet.CRC32;
                if (packet.CRC32 === '0') {
                    delete this.ServerInfo.LogoData;
                }
                else {
                    this.ServerInfo.LogoData = packet.Base64Data;
                }
                this.onServerLogo(this.ServerInfo.LogoData);
                break;

            case CIC_COMMAND_LOGO_CHANGED:
                // se a logo do servidor foi alterada, pega a nova logo agora
                this.sendPacket({ Command: CIC_COMMAND_GET_LOGO });
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
                if (packet.PacketCount === '-1') {
                    localStorage.UnitList = JSON.stringify(this.UnitList);
                }
                this.onUnitCount(packet.PacketCount);
                break;
                
        }
        return false; // indica que foi processado o pacote
    };
    
    CICClientSession.prototype.intOnUser = function(packet) {
        switch (packet.Command) {

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
                        
                        if (user.UserID === this.UserID) {
                            //user.Password = packet.Password;
                            //user.EmailServer = packet.EmailServer;
                            //user.EmailAccount = packet.EmailAccount;
                            //user.EmailPassword = packet.EmailPassword;
                            user.RoomPermission = packet.RoomPermission;
                            user.FilePermission = packet.FilePermission;
                            user.MessagePermission = packet.MessagePermission;
                            user.VoicePermission = packet.VoicePermission;
                            user.ControlPermission = packet.ControlPermission;
                            user.PrivateChatPermission = packet.PrivateChatPermission;
                            user.ChangePermission = packet.ChangePermission;
                            user.doEmailPopup = packet.doEmailPopup;
                            user.EmailPopupInterval = packet.EmailPopupInterval;
                            user.doSound = packet.doSound;
                            user.doMessagePopup = packet.doMessagePopup;
                            user.doAutoChat = packet.doAutoChat;
                            user.doSpeaker = packet.doSpeaker;
                            user.doAutoBusy = packet.doAutoBusy;
                            user.doAutoAway = packet.doAutoAway;
                            user.doRequirePassword = packet.doRequirePassword;
                            user.AudioCodec = packet.AudioCodec;
                            user.doUserListFilter = packet.doUserListFilter;
                            user.doUserListSort = packet.doUserListSort;
                            user.DefaultUnit = packet.DefaultUnit;
                            user.ShowDateTime = packet.ShowDateTime;
                            user.doShowEmoticons = packet.doShowEmoticons;
                            user.doAutoVNC = packet.doAutoVNC;
                            user.DefaultStatus = packet.DefaultStatus;
                            user.DefaultAvailableMessage = packet.DefaultAvailableMessage;
                            user.DefaultBusyMessage = packet.DefaultBusyMessage;
                            user.DefaultAwayMessage = packet.DefaultAwayMessage;
                            user.DefaultHelloMessage = packet.DefaultHelloMessage;
                        }
                        
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
                var user = this.OnLineUserList[packet.UserID];
                if ((packet.isConnected || 'False') === 'True') {
                    user = user || {};
                    user.UserID = packet.UserID;
                    user.isConnected = packet.isConnected;
                    user.ConnectionCount = packet.ConnectionCount;
                    if (packet.TimeStamp !== undefined) {
                        user.TimeStamp = packet.TimeStamp;
                        user.Status = packet.Status;
                        user.StatusMessage = packet.StatusMessage;
                        user.VersionInfo = packet.VersionInfo;
                        user.Language = packet.Language;
                    }
                    this.OnLineUserList[user.UserID] = user;
                    this.onUserStatus(user);
                    // se o usuario tiver uma foto que ainda nao esta em cache, busca a foto agora
                    this.intRequestUserPicture(user.UserID);
                }
                else {
                    if (user !== undefined) {
                        user.isConnected = 'False';
                        user.ConnectionCount = '0';
                        user.TimeStamp = packet.TimeStamp;
                        user.Status = packet.Status;
                        user.StatusMessage = packet.StatusMessage;
                        user.VersionInfo = '';
                        user.Language = '';
                        delete this.OnLineUserList[user.UserID];
                        this.onUserStatus(user);
                    }
                }
                break;
                
            case CIC_COMMAND_USER_COUNT:
                // se chegou no final da lista, grava lista no storage
                if (packet.PacketCount === '-1') {
                    localStorage.UserList = JSON.stringify(this.UserList);
                }
                this.onUserCount(packet.PacketCount);
                break;
                
            case CIC_COMMAND_PICTURE:
                var user = this.UserList[packet.UserID] || {};
                user.UserID = packet.UserID;
                user.PictureCRC32 = packet.CRC32;
                this.UserList[user.UserID] = user;

                if (user.PictureCRC32 === undefined || user.PictureCRC32 === '0') {
                    delete this.PictureList[user.UserID];
                }
                else {
                    this.PictureList[user.UserID] = packet.Base64Data;
                }
                
                // remove da lista de requisicoes, caso precise fazer uma nova requisicao no futuro (como quando o usuario altera sua foto)
                delete this.PictureRequestList[user.UserID];

                this.onUserPicture(user.UserID, this.PictureList[user.UserID]);
                break;
                
            case CIC_COMMAND_PICTURE_CHANGED:
                // se a logo do servidor foi alterada, pega a nova logo agora
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
                if (packet.PacketCount === '-1') {
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
                if (packet.PacketCount === '-1') {
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
                if (packet.PacketCount === '-1') {
                    localStorage.RoomList = JSON.stringify(this.RoomList);
                }
                this.onRoomCount(packet.PacketCount);
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
    
    CICClientSession.prototype.intRequestUserPicture = function(userid) {
        if (this.PictureRequestList[userid] === undefined) {
            if (this.PictureList[userid] === undefined && this.UserList[userid] !== undefined) {
                if (this.UserList[userid].PictureCRC32 !== undefined && this.UserList[userid].PictureCRC32 !== '0') {
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
    
    CICClientSession.prototype.onUserCount = function(count) {
        // nao faz nada, mas poderia iniciar um gauge
    };
    CICClientSession.prototype.onUser = function(user) {
        // nao faz nada, mas poderia atualizar um gauge
    };
    CICClientSession.prototype.onUserDeleted = function(user) {
        // nao faz nada
    };
    CICClientSession.prototype.onUserOnLine = function(user) {
        // nao faz nada
    };
    CICClientSession.prototype.onUserOffLine = function(user) {
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
    
};

