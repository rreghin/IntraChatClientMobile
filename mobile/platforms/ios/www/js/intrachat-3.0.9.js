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
    var CIC_CLIENT_MAGIC_STRING  = '@BOBJDCDLEIDEBNEDDODJDCDODNBJBO'       + '\r\n';
    var CIC_MESSAGE_MAGIC_STRING = 'OBJBCEGDODEDGDADCECEEDMDDDNBEECEJBOB@' + '\r\n';
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
    var CIC_COMMAND_NONCE           =   0;
    var CIC_COMMAND_AUTHENTICATE    =   1;
    var CIC_COMMAND_AUTO_REGISTER   =   3;
    var CIC_COMMAND_AUTHENTICATION  = 101;

    var CIC_COMMAND_GET_SERVER_INFO =   4;
    var CIC_COMMAND_GET_USER_INFO   =   5;

    var CIC_COMMAND_SERVER_INFO     = 214;
    var CIC_COMMAND_USER_INFO       = 218;

    var CIC_COMMAND_KEEPALIVE       = 111;
    var CIC_COMMAND_KEEPALIVE_BACK  =   8;

    var CIC_COMMAND_CONFIG          = 185;
    var CIC_COMMAND_LOGO            = 186;
    var CIC_COMMAND_PICTURE         = 187;
    var CIC_COMMAND_MURAL           = 189;

    var CIC_COMMAND_LOGO_CHANGED    = 190;
    var CIC_COMMAND_PICTURE_CHANGED = 191;
    var CIC_COMMAND_CONFIG_CHANGED  = 192;
    var CIC_COMMAND_MURAL_CHANGED   = 194;

    var CIC_COMMAND_GET_LOGO        = 195;
    var CIC_COMMAND_GET_PICTURE     = 196;
    var CIC_COMMAND_GET_CONFIG      = 197;
    var CIC_COMMAND_GET_MURAL       = 199;

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

    var CIC_COMMAND_BACK_AND_FORTH  = 255;
    // =============================================================================
}

function CICBaseProtocol() {
        
    /**
     *  CONSTRUTOR DO OBJETO
     */

    // se 'logPackets' for true, entao todos os pacotes enviados e recebidos sao mostrados no log do console
    this.logPackets = true;
        
}{
    /**
     *  METODOS PARA FUNÇÕES BÁSICAS DO PROTOCOLO
     */
    
    CICBaseProtocol.prototype.init = function(ServerAddress, UserID, UserPassword, MagicString) {
        this.reset();
        this.ServerAddress = ServerAddress;
        this.ServerSecure = false;
        this.MagicString = MagicString;
        this.UserID = UserID;
        this.UserPassword = UserPassword;
    };
    
    CICBaseProtocol.prototype.reset = function() {
        this.ServerInfo = {};
        this.ServerAddress = '';
        this.MagicString = '\r\n';
        this.UserID = '';
        this.UserPassword = '';
        this.isConnected = false;
        this.isAuthenticated = false;
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

        var partes = this.ServerAddress.split(':');
        var endereco = partes[0] || 'localhost';
        var porta = partes[1] || 55000;
            
        console.log((this.ServerSecure?'wss':'ws')+'://'+endereco+':'+porta+'/');
        this.WebSocket = new WebSocket((this.ServerSecure?'wss':'ws')+'://'+endereco+':'+porta+'/', ['intrachat']);
        
        this.WebSocket.onopen = function() { self._onWSOpen.call(self); };
        this.WebSocket.onclose = function() { self._onWSClose.call(self); };
        this.WebSocket.onerror = function(error) { self._onWSError.call(self, error); };
        this.WebSocket.onmessage = function(event) { self._onWSMessage.call(self, event); };
    };
    
    CICBaseProtocol.prototype.disconnect = function() {
        this.WebSocket.close();
    };
    
    CICBaseProtocol.prototype.authenticate = function(realm, nonce, HA1) {
        if (!HA1) HA1 = ''+CryptoJS.MD5(this.UserID + ':' + realm + ':' + this.UserPassword);
        var HR1 = ''+CryptoJS.MD5(HA1 + ':' + nonce);
        this.sendPacket({
            Command: CIC_COMMAND_AUTHENTICATE,
            UserID: this.UserID,
            //Password: this.UserPassword,
            Authorization: HR1,
            VersionNumber: CIC_PROTOCOL_VERSION,
            VersionRevision: CIC_PROTOCOL_REVISION,
            VersionPlatform: CIC_PROTOCOL_PLATFORM,
            Language: 'PT',
            SystemInfo: '' //navigator.userAgent // NAO pode ter virgulas ou aspas duplas dentro dessa string!!!
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
        this.WebSocket.send(JSON.stringify(packet)+'\n');
        if (this.logPackets) {
            console.log('SENT -> ' + JSON.stringify(packet));
        }
        return packet;
    };
    
    CICBaseProtocol.prototype.sendNOOPPacket = function() {
        return this.sendPacket({ Command: CIC_COMMAND_BACK_AND_FORTH });
    };

    CICBaseProtocol.prototype.setStatus = function(status, message, isDefaultStatus, isDefaultMessage) {
        return this.sendPacket({ 
            Command: CIC_COMMAND_USER_STATUS,
            Status: status||CIC_USER_STATUS_AVAILABLE,
            StatusMessage: message||'',
            isDefaultStatus: isDefaultStatus||false,
            isDefaultStatusMessage: isDefaultMessage||false
        });
    };    
    
    CICBaseProtocol.prototype.sendMessage = function(targets, text, originalid, replyAllowed) {
        return this.sendPacket({
            Command: CIC_COMMAND_MESSAGE,
            ToUserID: targets,
            OriginalMessageID: originalid,
            isReplyAllowed: replyAllowed,
            TextMessage: Base64.encode(text)
        });
    };
        
    CICBaseProtocol.prototype.setMessageStatus = function(messageid, status) {
        return this.sendPacket({
            Command: CIC_COMMAND_MESSAGE_STATUS,
            Operation: status,
            MessageID: messageid
        });
    };
        
    CICBaseProtocol.prototype.setMessageFolder = function(messageid, folderid) {
        return this.sendPacket({
            Command: CIC_COMMAND_MESSAGE_FOLDER,
            MessageID: messageid,
            FolderID: folderid
        });
    };
        
    CICBaseProtocol.prototype.setMessageNew = function(messageid) {
        return this.setMessageStatus(messageid, CIC_MESSAGE_NEW);
    };
    
    CICBaseProtocol.prototype.setMessageArchived = function(messageid) {
        return this.setMessageStatus(messageid, CIC_MESSAGE_ARCHIVED);
    };
    
    CICBaseProtocol.prototype.setMessageImportant = function(messageid) {
        return this.setMessageStatus(messageid, CIC_MESSAGE_IMPORTANT);
    };
    
    CICBaseProtocol.prototype.setFileFolder = function(streamid, folderid) {
        return this.sendPacket({
            Command: CIC_COMMAND_FILE_FOLDER,
            StreamID: streamid,
            FolderID: folderid
        });
    };
        
    CICBaseProtocol.prototype.createMessageFolder = function(foldername) {
        return this.sendPacket({
            Command: CIC_COMMAND_FOLDER,
            Operation: CIC_OPERATION_INSERT,
            Name: foldername,
            Kind: 'M'
        });
    };
        
    CICBaseProtocol.prototype.createFileFolder = function(foldername) {
        return this.sendPacket({
            Command: CIC_COMMAND_FOLDER,
            Operation: CIC_OPERATION_INSERT,
            Name: foldername,
            Kind: 'F'
        });
    };
        
    CICBaseProtocol.prototype.renameFolder = function(folderid, newname) {
        return this.sendPacket({
            Command: CIC_COMMAND_FOLDER,
            Operation: CIC_OPERATION_UPDATE,
            FolderID: folderid,
            Name: newname
        });
    };
        
    CICBaseProtocol.prototype.deleteFolder = function(folderid) {
        return this.sendPacket({
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
            this.isConnected = true;
            this.onConnect();
            this.WebSocket.send(this.MagicString);
        }
    };
    
    CICBaseProtocol.prototype._onWSClose = function() {
        if (this.intOnDisconnect()) {
            this.reset();
            this.onDisconnect();
        }
    };
    
    CICBaseProtocol.prototype._onWSError = function(error) {
        this.reset();
        if (error.data !== undefined) {
            if (this.intOnError(error)) {
                this.onError(error);
            }
        }
    };
    
    CICBaseProtocol.prototype._onWSMessage = function(event) {
        if (this.logPackets) {
            console.log('RECEIVED <- ' + event.data);
        }
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
                if (!this.isAuthenticated) {
                    if (packet.Command === CIC_COMMAND_NONCE) {
                        // prepara o objeto JSON a ser enviado com o pedido de autenticacao
                        if (!this.doAutoRegister) {
                            this.authenticate(packet.realm, packet.nonce);
                        }
                        else {
                            this.register();
                        }
                    } else if (packet.Command === CIC_COMMAND_AUTHENTICATION) {
                        this.ServerInfo = this.ServerInfo || {};
                        this.ServerInfo.ServerID = packet.ServerID;
                        this.ServerInfo.Name = packet.ServerName;
                        this.ServerInfo.VersionInfo = packet.VersionInfo;
                        this.ServerInfo.Fingerprint = packet.ServerFingerprint;
                        if (packet.Granted) {
                            this.isAuthenticated = true;
                            if (this.intOnAuthenticationOk()) {
                                this.onAuthenticationOk();
                            }
                        }
                        else {
                            this.isAuthenticated = false;
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

function CICMessageProtocol(ServerAddress, UserID, UserPassword, Targets, TextMessage) {
        
    /**
     *  CONSTRUTOR DO OBJETO
     */

    this.init(ServerAddress, UserID, UserPassword, CIC_MESSAGE_MAGIC_STRING);

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

function CICClientProtocol(ServerAddress, UserID, UserPassword, doConnect) {
    
    /**
     *  CONSTRUTOR DO OBJETO
     */

    this.init(ServerAddress, UserID, UserPassword, CIC_CLIENT_MAGIC_STRING);

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
            if (this.intOnKeepAlive(packet)) {
                this.onKeepAlive(packet);
                // simplesmente devolve o mesmo pacote 
                packet.Command = CIC_COMMAND_KEEPALIVE_BACK;
                this.sendPacket(packet);
                return false; // indica que o pacote foi processado e que um objeto filho nao precisa processa-lo
            }
        }
        // NAO usar a chamada pela heranca aqui, senao entra em loop, pois de acordo com o escopo, this é a Sessao (abaixo)
        return true; //this.parent.prototype.intOnPacket.call(this, packet);
    };
    
    CICClientProtocol.prototype.intOnKeepAlive = function(packet) {
        return true;
    };

    CICClientProtocol.prototype.onKeepAlive = function(packet) {
        // nao faz nada por padrao
    };

}

function CICClientSession(ServerAddress, UserID, UserPassword, doConnect, doAutoRegister, UserName, UserDept, UserEmail, UserPhone, UserBirthDate, UserBase64Picture) {
    
    /**
     *  CONSTRUTOR DO OBJETO
     */

    this.init(ServerAddress, UserID, UserPassword, CIC_CLIENT_MAGIC_STRING);
    
    // se foram passados os parametros para o AutoCadastro, tenta fazer o autocadastro durante a autenticacao
    if (doAutoRegister||false) {
        this.doAutoRegister = true;
        this.UserName = UserName;
        this.UserDept = UserDept;
        this.UserEmail = UserEmail;
        this.UserPhone = UserPhone;
        this.UserBirthDate = UserBirthDate; // '1900-08-05';
        this.UserBase64Picture = UserBase64Picture;
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

        this.UnitList = {};
        this.UserList = {};
        this.FavoriteList = {};
        
        // manter listas de IDs das unidades e usuarios
        this.UnitIDs = [];
        this.UserIDs = [];
        
        // manter listas de objetos das unidades e usuarios
        this.Units = []; 
        this.Users = []; 
        
        this.OnLineUserList = {};
        this.PictureList = {}; // fotos dos usuarios (pra que elas nao fiquem guardadas no UserList, tomando espaco)
        this.PictureRequestList = {}; // guarda uma lista de imagens que foram pedidas as servidor, para que nao faça um monte de requisicoes repetidas
        
        this.RoomList = {};
        
        this.FileFolderList = {};    //(localStorage.FileFolderList===undefined) ? {} : JSON.parse(localStorage.FileFolderList);
        this.FileList = {};          //(localStorage.FileList===undefined) ? {} : JSON.parse(localStorage.FileList);
        
        this.NewMessageList = {};       //(localStorage.NewMessageList===undefined) ? {} : JSON.parse(localStorage.NewMessageList);
        this.OriginalMessageList = {};  //(localStorage.OriginalMessageList===undefined) ? {} : JSON.parse(localStorage.OriginalMessageList);

        this.ImportantMessageFolderList = {}; //(localStorage.ImportantMessageFolderList===undefined) ? {} : JSON.parse(localStorage.ImportantMessageFolderList);
        this.ImportantMessageList = {};       //(localStorage.ImportantMessageList===undefined) ? {} : JSON.parse(localStorage.ImportantMessageList);
    };
    
    CICClientSession.prototype.loadStorage = function () {
        this.UnitList = (localStorage.UnitList===undefined) ? {} : JSON.parse(localStorage.UnitList);
        this.UserList = (localStorage.UserList===undefined) ? {} : JSON.parse(localStorage.UserList);
        
        // manter listas de IDs das unidades e usuarios
        this.UnitIDs = []; Object.keys(this.UnitList).forEach(function (key) { if (key !== '___MCP___') this.UnitIDs.push(key); }, this);
        this.UserIDs = Object.keys(this.UserList);
        
        // manter listas de objectos das unidades e usuarios
        this.Units = []; this.UnitIDs.forEach(function (key) { if (key !== '___MCP___') this.Units.push(this.UnitList[key]); }, this);
        this.Users = []; this.UserIDs.forEach(function (key) { this.Users.push(this.UserList[key]); }, this);
        
        this.RoomList = (localStorage.RoomList===undefined) ? {} : JSON.parse(localStorage.RoomList);

        //this.PictureList = {}; 
        this.UserIDs.forEach(function (key) {
            var hash = "PIC:" + CryptoJS.MD5(this.ServerInfo.Fingerprint + ":" + key);
            if (localStorage[hash]) {
                this.PictureList[key] = localStorage[hash];
            }
        }, this);

        //console.log('UNITS->'+JSON.stringify(this.UnitList));
        //console.log('USERS->'+JSON.stringify(this.UserList));
    };
    
    /**
     *  =========================================================================================================================================================================
     *  HELPERS
     *  =========================================================================================================================================================================
     */
    
    CICClientSession.prototype.persistUnits = function() {
        localStorage.UnitList = JSON.stringify(this.UnitList);    
    };
    
    CICClientSession.prototype.persistUsers = function() {
        localStorage.UserList = JSON.stringify(this.UserList);    
    };
    
    CICClientSession.prototype.persistRooms = function() {
        localStorage.RoomList = JSON.stringify(this.RoomList);
    };
    
    CICClientSession.prototype.persistPicture = function(userid, crc32, data) {
        var hash = "PIC:" + CryptoJS.MD5(this.ServerInfo.Fingerprint + ":" + userid);
        if (crc32 === undefined || crc32 === 0) {
            delete localStorage[hash];
        } else {
            localStorage[hash] = data;
        }
    };
    
    CICClientSession.prototype.getServerLogo = function() {
        if (this.ServerInfo !== undefined) {
            return { CRC32: this.ServerInfo.LogoCRC32, Data: this.ServerInfo.LogoData };
        }
    };
    
    CICClientSession.prototype.getUnit = function(unitid) {
        return this.UnitList[unitid];
    };    
    
    CICClientSession.prototype.getUnitName = function(unitid) {
        var unit = this.UnitList[unitid];
        if (unit !== undefined) {
            return unit.Name;
        }
    };
    
    CICClientSession.prototype.getUserUnitID = function(userid) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            return user.UnitID;
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
    
    CICClientSession.prototype.getUserName = function(user) {
        //var user = this.UserList[userid];
        if (user !== undefined) {
            if (user.Alias !== undefined && user.Alias !== '') {
                return user.Alias;
            }
            else {
                return user.RealName;
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
    
    CICClientSession.prototype.getUserPicture = function(userid, doRequest) {
        var user = this.UserList[userid];
        if (user !== undefined) {
            if (user.PictureCRC32 !== undefined && user.PictureCRC32 !== 0) {
                return { CRC32: user.PictureCRC32, Data: this.PictureList[userid] };
            }
        } else if (!!doRequest) {
            this.intRequestUserPicture(userid, true);
        }
    };
    
    CICClientSession.prototype.intUpdatePictureDatabase = function(user, packet) {
        // persiste foto do usuario
        this.persistPicture(user.UserID, user.PictureCRC32, packet.Base64Data);
        // persiste todos os usuarios (pois mudou o CRC32 da foto desse usuario)
        this.persistUsers();
        // remove da lista de requisicoes, caso precise fazer uma nova requisicao no futuro (como quando o usuario altera sua foto)
        delete this.PictureRequestList[user.UserID];
        // executa evento para remocao da foto da UI
        this.onUserPicture(user.UserID, this.getUserPicture(user.UserID));
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
        // se deu certo a autenticacao e for o mesmo usuario no mesmo servidor (anterior), entao carrega dados gravados da ultima sessao
        var lastServer = localStorage.LastServerFingerprint || '';
        var lastUser = localStorage.LastUserID || '';
        if ((lastServer.toLowerCase() !== (this.ServerInfo.Fingerprint.toLowerCase()||'')) || (lastUser.toUpperCase() !== (this.UserID.toUpperCase()||''))) {
            localStorage.LastServerFingerprint = this.ServerInfo.Fingerprint;
            localStorage.LastUserID = this.UserID;
            delete localStorage.UnitList;
            delete localStorage.UserList;
            delete localStorage.RoomList;
            delete localStorage.LastUpdate;
            delete localStorage.LastMessage;
            delete localStorage.LastImportant;
            delete localStorage.LastRoomChanged;
        } else {
            this.loadStorage();
        }
        // pede configurações do servidor
        this.sendPacket( { Command: CIC_COMMAND_GET_SERVER_INFO } );
        // pede configurações do usuario
        this.sendPacket( { Command: CIC_COMMAND_GET_USER_INFO } );
        // pede as listas assim que estiver autenticado
        console.log('LastUpdate: ' + localStorage.LastUpdate);
        console.log('LastMessage: ' + localStorage.LastMessage);
        //console.log('LastImportant: ' + localStorage.LastImportant);
        //console.log('LastRoomChanged: ' + localStorage.LastRoomChanged);
        this.sendPacket( { Command: CIC_COMMAND_LIST_UNITS, LastUpdate: localStorage.LastUpdate } );
        this.sendPacket( { Command: CIC_COMMAND_LIST_USERS, LastUpdate: localStorage.LastUpdate } );
        this.sendPacket( { Command: CIC_COMMAND_LIST_MESSAGES, List: 'NEW', LastUpdate: localStorage.LastMessage } );
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
                        
                        var unitIndex = this.UnitIDs.indexOf(unit.UnitID);
                        if ((unitIndex < 0) && (unit.UnitID !== '___MCP___')) {
                            this.UnitIDs.push(unit.UnitID);
                            this.Units.push(unit);
                        }
                        
                        if (packet.Operation === CIC_OPERATION_UPDATE) {
                            // se a unidade foi alterada, refaz DeptUnit dos usuarios dessa unidade
                            this.Users.forEach(function (user) {
                                // seta setor e unidade
                                if (user.UnitID === packet.UnitID) {
                                    user.DeptUnit = ((user.Dept==="" || user.Dept===".") ? "" : user.Dept + " - ") + this.getUnitName(user.UnitID);
                                }
                            }, this);
                            
                            // persiste todas as unidades
                            this.persistUnits();

                            // persiste todos os usuarios
                            this.persistUsers();
                        }
                        
                        //console.log('unit.LastChange= "'+unit.LastChange+'"  ->  localStorage.LastUpdate= "'+localStorage.LastUpdate+'"');
                        if ((unit.LastChange !== undefined) && ((localStorage.LastUpdate === undefined) || (unit.LastChange.localeCompare(localStorage.LastUpdate) > 0))) {
                            localStorage.LastUpdate = unit.LastChange;
                            console.log('NEW (UNIT) LastUpdate: ' + localStorage.LastUpdate);
                        }
                        
                        this.onUnit(unit, packet.Operation);
                        break;
                        
                    case CIC_OPERATION_DELETE:
                        var unit = this.UnitList[packet.UnitID];
                        if (unit !== undefined) {
                            delete this.UnitList[unit.UnitID];
                        
                            var unitIndex = this.UnitIDs.indexOf(unit.UnitID);
                            if (unitIndex >= 0) {
                                this.UnitIDs.splice(unitIndex, 1);
                            }
                            unitIndex = this.Units.indexOf(unit);
                            if (unitIndex >= 0) {
                                this.Units.splice(unitIndex, 1);
                            }
                            
                            // persiste todas as unidades
                            this.persistUnits();

                            this.onUnitDeleted(unit);
                        }
                        break;
                        
                }
                break;
                
            case CIC_COMMAND_UNIT_COUNT:
                // se chegou no final da lista, grava lista no storage
                if (packet.PacketCount === -1) {
                    this.persistUnits();
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
                        user.RealName = packet.Name; // guarda o nome escondido, para que a propriedade correta (Name) seja setada posteriormente
                        user.UnitID = packet.UnitID;
                        user.Dept = packet.Dept || '';
                        user.Email = packet.Email || '';
                        user.Phone = packet.Phone || '';
                        user.Level = packet.Level || 0;
                        user.BirthDate = packet.BirthDate || '';
                        user.isInvisible = !!packet.isInvisible;
                        
                        var pictureChanged = (user.PictureCRC32 !== undefined && user.PictureCRC32 !== packet.PictureCRC32);
                        user.PictureCRC32 = packet.PictureCRC32 || 0;
                        
                        user.LastChange = packet.LastChange;
                        this.UserList[user.UserID] = user;
                        
                        // Roger 13/05/2014: verificar se o usuarios tem um alias/apelido
                        var fuser = this.FavoriteList[user.UserID];
                        if (fuser) {
                            user.Alias = fuser.Alias;
                        }
                        
                        // seta nome corretamente, levando em conta o apelido
                        user.Name = this.getUserName(user);
                        
                        // seta setor e unidade
                        user.DeptUnit = ((user.Dept==="" || user.Dept===".") ? "" : user.Dept + " - ") + this.getUnitName(user.UnitID);
                        
                        // seta email e telefone
                        user.PhoneEmail = ((user.Phone==="" || user.Phone===".") ? "" : user.Phone) + 
                                          ((user.Phone==="" || user.Phone===".") ? "" : ((user.Email==="" || user.Email===".") ? "" : " - ")) +
                                          ((user.Email==="" || user.Email===".") ? "" : user.Email);
                        
                        var userIndex = this.UserIDs.indexOf(user.UserID);
                        if (userIndex < 0) {
                            this.UserIDs.push(user.UserID);
                            this.Users.push(user);
                        }
                        
                        if (packet.Operation === CIC_OPERATION_UPDATE) {
                            // persiste todos os usuarios
                            this.persistUsers();
                        }
                        
                        //console.log('user.LastChange= "'+user.LastChange+'"  ->  localStorage.LastUpdate= "'+localStorage.LastUpdate+'"');
                        if ((user.LastChange !== undefined) && ((localStorage.LastUpdate === undefined) || (user.LastChange.localeCompare(localStorage.LastUpdate) > 0))) {
                            localStorage.LastUpdate = user.LastChange;
                            console.log('NEW (USER) LastUpdate: ' + localStorage.LastUpdate);
                        }
                        this.onUser(user, packet.Operation);
                        
                        // se o usuario tiver uma foto que ainda nao esta em cache, busca a foto agora
                        if (pictureChanged || user.PictureCRC32 !== undefined && user.PictureCRC32 !== 0) {
                            this.intRequestUserPicture(user.UserID, pictureChanged);
                        }
                        break;
                        
                    case CIC_OPERATION_MCP:
                        // Roger 13/05/2014: colocar numa lista separada, so pros favoritos
                        var fuser = this.FavoriteList[packet.UserID] || {};
                        fuser.UserID = packet.UserID;
                        fuser.Alias = packet.Alias;
                        fuser.isFavorite = packet.isFavorite;
                        fuser.doFavoriteNotification = packet.doFavoriteNotification;
                        this.FavoriteList[fuser.UserID] = fuser;
                        // atualiza lista de usuarios, caso ela ja tenha chegado
                        var user = this.UserList[fuser.UserID];
                        if (user) {
                            user.Alias = fuser.Alias;
                            // seta nome corretamente, levando em conta o apelido
                            user.Name = this.getUserName(user);
                            this.onUser(user, packet.Operation);
                        }
                        break;
                        
                    case CIC_OPERATION_DELETE:
                        var user = this.UserList[packet.UserID];
                        if (user !== undefined) {
                            delete this.UserList[user.UserID];
                        
                            var userIndex = this.UserIDs.indexOf(user.UserID);
                            if (userIndex >= 0) {
                                this.UserIDs.splice(userIndex, 1);
                            }
                            userIndex = this.Users.indexOf(user);
                            if (userIndex >= 0) {
                                this.Users.splice(userIndex, 1);
                            }
                            
                            // remove foto do cache
                            this.persistPicture(user.UserID, 0, null);

                            // persiste todos os usuarios
                            this.persistUsers();
                            
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
                    if (this.UserList !== undefined && this.UserList[user.UserID] !== undefined) {
                        if (this.UserList[user.UserID].PictureCRC32 !== undefined && this.UserList[user.UserID].PictureCRC32 !== 0) {
                            this.intRequestUserPicture(user.UserID);
                        }
                    }
                }
                else {
                    delete this.OnLineUserList[user.UserID];
                    this.onUserStatus(status);
                }
                break;
                
            case CIC_COMMAND_USER_COUNT:
                // se chegou no final da lista, grava lista no storage
                if (packet.PacketCount === -1) {
                    this.persistUsers();
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
                
                // atualiza banco de fotos
                this.intUpdatePictureDatabase(user, packet);

                break;
                
            case CIC_COMMAND_PICTURE_CHANGED:
                // se a foto do usuario foi alterada, remove a atual e busca novamente a foto no servidor
                var user = this.UserList[packet.UserID];
                if (user !== undefined) {
                    if (user.PictureCRC32 !== packet.CRC32 || packet.CRC32 === 0) {
                        delete this.PictureList[user.UserID];
                    }
                    if (packet.CRC32 === 0) {
                        user.PictureCRC32 = packet.CRC32;
                        // atualiza banco de fotos
                        this.intUpdatePictureDatabase(user, packet);
                    } else {
                        this.intRequestUserPicture(packet.UserID, true);
                    }
                }
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
                            folder = this.ImportantMessageFolderList[packet.FolderID] || {};
                            folder.FolderID = packet.FolderID;
                            folder.UserID = packet.UserID;
                            folder.Name = packet.Name;
                            folder.Kind = packet.Kind;
                            this.ImportantMessageFolderList[folder.FolderID] = folder;
                        }
                        this.onFolder(folder, packet.Operation);
                        break;
                    
                    case CIC_OPERATION_DELETE:
                        var folder = this.FileFolderList[packet.FolderID];
                        if (user !== undefined) {
                            delete this.FileFolderList[packet.FolderID];
                            this.onFolderDeleted(folder);
                        }
                        else {
                            folder = this.ImportantMessageFolderList[packet.FolderID];
                            if (user !== undefined) {
                                delete this.ImportantMessageFolderList[packet.FolderID];
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
				//console.log(packet);
                switch (packet.Operation) {
                    
                    case CIC_MESSAGE_NEW:
                    case CIC_MESSAGE_SENT:
                    case CIC_MESSAGE_IMPORTANT:
                    case CIC_MESSAGE_ORIGINAL:
                        var message;
                        
                        if (packet.Operation === CIC_MESSAGE_NEW) {
                            message = this.NewMessageList[packet.MessageID] || {};
                            this.NewMessageList[packet.MessageID] = message;
                        }
                        else if (packet.Operation === CIC_MESSAGE_SENT) {
                            message = {};
                        }
                        else if (packet.Operation === CIC_MESSAGE_IMPORTANT) {
                            message = this.ImportantMessageList[packet.MessageID] || {};
                            this.ImportantMessageList[packet.MessageID] = message;
                        }
                        else if (packet.Operation === CIC_MESSAGE_ORIGINAL) {
                            message = this.OriginalMessageList[packet.MessageID] || {};
                            this.OriginalMessageList[packet.MessageID] = message;
                        }
                        
                        if (packet.ErrorNumber || packet.ErrorMessage) {
                            message.MessageID = -(packet.PacketID);
                            message.FromUserID = '';
                            message.ToUserID = '';
                            message.TextMessage = Base64.decode(packet.ErrorMessage||'');
                            message.TimeStamp = packet.TimeStamp;
                            message.isReplyAllowed = false;
                            message.Status = packet.Operation;  // <-- PRESTE ATENCAO AQUI!! setar o Status aqui pra que o onMessage saiba que tipo de mensagem que �
                            message.PacketID = packet.PacketID;
                            delete this.NewMessageList[packet.MessageID];
                            this.NewMessageList[message.MessageID] = message; // adiciona a lista de mensagens rapidas novas
                        } else {
                            message.MessageID = packet.MessageID;
                            message.FromUserID = packet.FromUserID;
                            message.ToUserID = packet.ToUserID;
                            message.TextMessage = Base64.decode(packet.TextMessage||'');
                            message.TimeStamp = packet.TimeStamp;
                            message.OriginalMessageID = packet.OriginalMessageID;
                            message.isReplyAllowed = packet.isReplyAllowed;
                            message.Status = packet.Operation;  // <-- PRESTE ATENCAO AQUI!! setar o Status aqui pra que o onMessage saiba que tipo de mensagem que �
                            message.FolderID = packet.FolderID;
                            message.PacketID = packet.PacketID;
                        }
						//console.log(message.TextMessage);
                        
                        /*if (packet.Operation === CIC_MESSAGE_NEW) {
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
                        }*/
                        
                        this.onMessage(message, packet.Operation);

                        // se o usuario tiver uma foto que ainda nao esta em cache, busca a foto agora
                        if (this.UserList[message.FromUserID] !== undefined && this.UserList[message.FromUserID].PictureCRC32 !== undefined && this.UserList[message.FromUserID].PictureCRC32 !== 0) {
                            this.intRequestUserPicture(message.FromUserID);
                        }
                        
                        break;
                        
                    case CIC_MESSAGE_ARCHIVED:
                        var message = this.NewMessageList[packet.MessageID];
                        if (message !== undefined) {
                            delete this.NewMessageList[message.MessageID];
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
                        this.onFile(file, packet.Operation);
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
                        this.onRoom(room, packet.Operation);
                        
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
                    this.persistRooms();
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
    
    CICClientSession.prototype.intRequestUserPicture = function(userid, force) {
        if (this.PictureRequestList[userid] === undefined) {
            if ((!!force) || (this.PictureList[userid] === undefined && this.UserList[userid] !== undefined)) {
                if ((!!force) || (this.UserList[userid].PictureCRC32 !== undefined && this.UserList[userid].PictureCRC32 !== 0)) {
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
    CICClientSession.prototype.onUnit = function(unit, operation) {
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
    CICClientSession.prototype.onUser = function(user, operation) {
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
    CICClientSession.prototype.onFolder = function(folder, operation) {
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
    CICClientSession.prototype.onMessage = function(message, operation) {
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
    CICClientSession.prototype.onFile = function(file, operation) {
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
    CICClientSession.prototype.onRoom = function(room, operation) {
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

/**

TODO:   

3.0.5 (28/01/2014)
    - Roger: adicionado sendNOOPPacket, para sinalizar quando todas as listas que foram pedidas ja chegaram
    - Roger: implementado meio de imprimir no console todos os pacotes enviados e recebidos "CICBaseProtocol.logPackets = true"
    
3.0.6 (15/04/2014)
    - Roger: manter lista de IDs das unidades e usuarios em listas separadas
    - Roger: manter lista de objetos das unidade e usuarios em listas separadas
    - Roger: reset() agora limpa toda a sessao, e as listas da sessao anterior so sao carregadas apos autenticacao 
    - Roger: manter somente a ultima lista de usuarios/unidades/salas, de acordo com o ultimo usuario e ultimo servidor
    
3.0.7 (21/04/2014)
    - Roger: manter propriedades DeptUnit e EmailPhone, ao inves de usar funcoes, pois funcoes nao estao funcionando bem com o AngularJS
    
3.0.8 (30/04/2014)
    - Roger: não enviar senha em texto limpo, mas sim um MD5 no calculado pelo metodo DIGEST de autenticação
    
3.0.9 (07/05/2014)
    - Roger: não requisitar todas as fotos dos usuários no primeiro login (carrega muito)
    - Roger: logo da empresa é atualizada automaticamente
    
**/
