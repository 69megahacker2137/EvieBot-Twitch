import WebSocket from 'websocket';
import { EventEmitter } from 'stream';
import EwaBot from './EwaBot';

type IdentityType = {
    username: string;
    auth: string;
}

export type TwitchBotProperties = {
    channels: string;
    identity: IdentityType;
}

const TWITCH_WEBSOCKET_CHAT_SERVER = "ws://irc-ws.chat.twitch.tv:80";

class TwitchClient extends EventEmitter {
    private channels: string;
    private identity: IdentityType;

    private wsClient: WebSocket.client | undefined;
    private connection: WebSocket.connection | undefined;

    constructor(props: TwitchBotProperties) {
        super();
        this.channels = props.channels;
        this.identity = props.identity;
        this.wsClient = undefined;
        this.connection = undefined;
    }

    public async connect(): Promise<void> {
        this.wsClient = new WebSocket.client;

        this.wsClient.on('connectFailed', (error) => {
            console.log('Connect Error: ' + error.toString());
        });

        this.wsClient.on('connect', (connection) => {
            console.log('WebSocket Client Connected to Twitch IRC');
            
            this.connection = connection;

            // Send CAP (optional), PASS, and NICK messages
            // connection.sendUTF('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
            connection.sendUTF(`PASS oauth:${this.identity.auth}`);
            connection.sendUTF(`NICK ${this.identity.username}`);
            connection.sendUTF(`JOIN #${this.channels}`);
            connection.sendUTF(`PRIVMSG #${this.channels} :!! Policja na czacie !!`);

            connection.on('message', (message) => {
                if (message.type === 'utf8') {
                    this.handleMessage(message.utf8Data);
                }
            });
        });

        this.wsClient.connect(TWITCH_WEBSOCKET_CHAT_SERVER);
    }

    private async handleMessage(rawMessage: string): Promise<void> {
        let message: string = rawMessage;
        
        if(message.includes("PRIVMSG")) {
            message = rawMessage.substring(rawMessage.search("PRIVMSG"));
            message = message.substring(message.search(':') + 1);
            message = message.replace(/\r\n/g, "");

            this.emit('message', message);
        }
    }
}

export default TwitchClient;

