import WebSocket from 'websocket';
import { EventEmitter } from 'stream';

type IdentityType = {
  username: string;
  auth: string;
};

export type TwitchBotProperties = {
  channels: string;
  identity: IdentityType;
};

const TWITCH_WEBSOCKET_IRC_SERVER = 'ws://irc-ws.chat.twitch.tv:80';
const HELLO_MESSAGE = 'CZĘŚĆ JESTEM EVIE BOT HIHIIHIHI a dlaczego nagi chłopak je banany ?';

class TwitchClient extends EventEmitter {
  private channel: string;
  private identity: IdentityType;

  constructor(props: TwitchBotProperties) {
    super();
    this.channel = props.channels;
    this.identity = props.identity;
  }

  public async connect(): Promise<void> {
    const ws = new WebSocket.client();

    ws.on('connectFailed', (error) => {
      console.log('Connect Error: ' + error.toString());
    });

    ws.on('connect', (connection) => {
      console.log('WebSocket Client Connected to Twitch IRC');

      // Send CAP (optional), PASS, and NICK messages
      // Additional tags from IRC server, for this bot you need only PRIVMSG - it's reading all messages
      // connection.sendUTF('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
      connection.sendUTF(`PASS oauth:${this.identity.auth}`);
      connection.sendUTF(`NICK ${this.identity.username}`);
      connection.sendUTF(`JOIN #${this.channel}`);
      connection.sendUTF(`PRIVMSG #${this.channel} :${HELLO_MESSAGE}`);

      connection.on('message', (message) => {
        if (message.type === 'utf8') {
          this.handleMessage(message.utf8Data);
        }
      });
    });

    ws.connect(TWITCH_WEBSOCKET_IRC_SERVER);
  }

  private async handleMessage(rawMessage: string): Promise<void> {
    let message: string = rawMessage;

    if (message.includes('PRIVMSG')) {
      message = rawMessage.substring(rawMessage.search('PRIVMSG'));
      message = message.substring(message.search(':') + 1);
      message = message.replace(/\r\n/g, '');

      this.emit('message', message);
    } else {
      console.log(message);
    }
  }
}

export default TwitchClient;
