import TwitchClient from './TwitchClient';
import EwaBot from './EwaBot';
import TwitchChatQueue from './TwitchChatQueue';
import 'dotenv/config';

// Types
import type { TwitchBotProperties } from './TwitchClient';

const defaultOptions: TwitchBotProperties = {
    channels: "bot60siona",
    identity: {
        username: process.env.BOT_USERNAME as string,
        auth: process.env.BOT_AUTH as string,
    }
}

const BotClient = new TwitchClient(defaultOptions);
const EwaClient = new EwaBot();
const ChatQueue = new TwitchChatQueue(EwaClient);

BotClient.on("message", async (message) => {
    ChatQueue.addToQueue(message);
})

BotClient.connect();
EwaClient.connect();

setInterval(async () => {
    try {
        await ChatQueue.processQueue();
    } catch (err) {
        console.error(err); 
    }
}, 1000);

