
class TwitchChatQueue {
    private queue: Array<string> = [];

    private ewaBot: any;

    constructor( ewaBot: any ) {
        this.ewaBot = ewaBot;
    }

    public addToQueue(message: string) {
        this.queue.push(message);
    }

    public async processQueue(): Promise<void> {
        return new Promise(async (resolve) => {
            while(this.queue.length > 0) {
                const message = this.queue.shift();

                if(message) {
                    await this.ewaBot.say(message);
                    resolve();
                }
            }
        });
    }
}

export default TwitchChatQueue;