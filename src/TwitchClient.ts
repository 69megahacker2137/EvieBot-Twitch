// import WebSocket from 'websocket';
import WebSocket, { WebSocketServer } from 'ws';
import { EventEmitter } from 'stream';

type IdentityType = {
  username: string;
  auth: string;
};

export type TwitchBotProperties = {
  channels: string;
  identity: IdentityType;
};

type TwitchIRCMessage = 'PASS' | 'NICK' | 'JOIN' | 'PRIVMSG' | 'PONG';

import TwitchMessage from './TwitchMesage';

const TWITCH_WEBSOCKET_IRC_SERVER = 'ws://irc-ws.chat.twitch.tv:80';
const HELLO_MESSAGE = 'CZĘŚĆ JESTEM EVIE BOT HIHIIHIHI a dlaczego nagi chłopak je banany ? 🍌🍌';

class TwitchClient extends EventEmitter {
  public username: string;

  private channel: string;
  private identity: IdentityType;

  private ws: WebSocket;

  constructor(props: TwitchBotProperties) {
    super();
    this.channel = props.channels;
    this.identity = props.identity;
    this.username = props.identity.username;
    this.ws = new WebSocket(TWITCH_WEBSOCKET_IRC_SERVER, {});

    this.connect();
  }

  connect(): void {
    this.ws.on('open', () => {
      // Auth
      this.sendMessage('PASS', `oauth:${process.env.BOT_AUTH}`);
      this.sendMessage('NICK', `${this.identity.username}`);
      this.sendMessage('JOIN', `#${this.channel}`);

      // Hello message
      this.sendMessage('PRIVMSG', `:${HELLO_MESSAGE}`);
    });

    this.ws.on('message', (message) => {
      this.handleMessage(message.toString());
    });
  }

  private async handleMessage(rawMessage: string): Promise<void> {
    const message = new TwitchMessage(rawMessage);

    this.emit('message', message as TwitchMessage);
  }

  public sendMessage(type: TwitchIRCMessage, message: string) {
    switch (type) {
      case 'PRIVMSG': {
        this.ws.send(`${type} #${this.channel} :${message}`);
        break;
      }
      case 'PONG': {
        this.ws.send(`${type} :${message}`);
      }
      default: {
        this.ws.send(`${type} ${message}`);
      }
    }
  }
}

export default TwitchClient;
