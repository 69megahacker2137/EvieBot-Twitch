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
  ChatQueue.addToQueue(message);
});

BotClient.connect();
EwaClient.connect();
