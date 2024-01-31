import TwitchClient from './TwitchClient';
import EvieBot from './EwaBot';
import TwitchChatQueue from './TwitchChatQueue';
import 'dotenv/config';

// Types
import type { TwitchBotProperties } from './TwitchClient';

const defaultOptions: TwitchBotProperties = {
  channels: process.env.CHANNEL as string,
  identity: {
    username: process.env.BOT_USERNAME as string,
    auth: process.env.BOT_AUTH as string,
  },
};

const BotClient = new TwitchClient(defaultOptions);
const EwaClient = new EvieBot();
const ChatQueue = new TwitchChatQueue(EwaClient);

BotClient.on('message', (message) => {
  switch (message.type) {
    case 'PRIVMSG': {
      const bot_name = `@${BotClient.username}`;

      if (message.content.includes(bot_name)) {
        // Remove @bot_name from string
        const msg = message.content.replace(bot_name, '').trim();
        ChatQueue.addToQueue(msg);
      } else {
        console.log(message);
      }

      break;
    }
    case 'PING': {
      // Keepalive messages, to stay connected to Twitch IRC
      BotClient.sendMessage('PONG', message.content);
      break;
    }
    default: {
      console.log(message.content);
      break;
    }
  }
});
