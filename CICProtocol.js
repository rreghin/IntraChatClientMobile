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

function CICBaseProtocol() {

    var _Protocol = this; // pra poder usar em todos os lugares 

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
    _onWSOpen = function() {
        console.log('WebSocket CONNECTED');
        _Connection.send(_MagicString);
        // prepara o objeto JSON a ser enviado com o pedido de autenticacao
        var AuthPacket = {
            Command: CIC_COMMAND_AUTHENTICATE,
            UserID: _UserID,
            Password: _UserPassword,
            VersionNumber: '396'
        };
        _Protocol.sendPacket(AuthPacket);
    };

    _onWSClose = function() {
        console.log('WebSocket DISCONNECTED');
    };

    _onWSError = function(error) {
        console.log('WebSocket ERROR: ' + error);
    };

    _onWSMessage = function(event) {
        console.log('WebSocket MESSAGE: ' + event.data);
        var packet = JSON.parse(event.data);
        // verifica qual foi o comando enviado pelo servidor
        if (!_IsAuthenticated) {
            if (packet.Command === CIC_COMMAND_AUTHENTICATION) {
                _ServerID = packet.ServerID;
                _ServerName = packet.ServerName;
                _ServerVersion = packet.ServerVersion;
                if (packet.Granted === 'True') {
                    console.log('Authenticated to server: ' + _Protocol.getServerName());
                    _IsAuthenticated = true;
                    _Protocol.onAuthentication();
                }
                else {
                    console.log('Authentication ERROR ' + packet.ErrorNumber + ': ' + packet.ErrorMessage);
                    _IsAuthenticated = false;
                    _Protocol.onAuthenticationFailed(packet.ErrorNumber, packet.ErrorMessage);
                }
            }
        }
        else {
            console.log('Protocol PACKET: ' + JSON.stringify(packet));
            _Protocol.onPacket(packet);
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
    
    this.onAuthentication = function() {
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
    // herança no JavaScript
    this.prototype = new CICBaseProtocol();
    
    var _Targets = Targets;
    var _Message = TextMessage;
    var _Count = Targets.length;
    
    // faz a conexao e envia a mensagem
    this.prototype.connect(ServerID, ServerPort, CIC_MESSAGE_MAGIC_STRING, UserID, UserPassword);
    
    // sobrescreve o metodo que eh executado quando a autenticacao foi bem sucedida
    this.prototype.onAuthentication = function() {
        // envia a mensagem
        var MsgPacket = {
            Command: CIC_COMMAND_TEXTMESSAGE,
            ToUserID: _Targets,
            TextMessage: Base64.encode(_Message)
        };
        this.sendPacket(MsgPacket);
        console.log('CICMessage SENT:' + JSON.stringify(MsgPacket));
    };
    
    // sobrescreve o metodo que eh executado toda vez que um pacote (nao de autenticacao) é executado
    this.prototype.onPacket = function(packet) {
        if (packet.Command === CIC_COMMAND_TEXTMESSAGE) {
            if (packet.MessageID !== '0') {
                console.log('Message to ' + packet.ToUserID + ' SENT. ID: ' + packet.MessageID);
            }
            else {
                console.log('Message to ' + packet.ToUserID + ' FAILED: ' + Base64.decode(packet.ErrorMessage));
            }
        }
        // desconecta assim que terminar de receber todas as respostas
        // o servidor faz isso, mas pode demorar mais se esperar pelo fechamento do servidor
        if (--_Count <= 0) {
            this.disconnect();
        }
    };
    
};
