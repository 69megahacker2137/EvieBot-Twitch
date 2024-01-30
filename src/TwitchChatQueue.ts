class TwitchChatQueue {
  private queue: Array<string> = [];
  private isRunning: boolean = false;

  private evieBot;

  constructor(evieBot: any) {
    this.evieBot = evieBot;
  }

  public addToQueue(message: string) {
    this.queue.push(message);
    this.sendMessage();
  }

  private async sendMessage() {
    if (this.isRunning || this.queue.length === 0) {
      return;
    }

    this.isRunning = true;

    const message = this.queue.shift();

    if (message) {
      await this.evieBot.say(message);
    }

    this.isRunning = false;
    this.sendMessage();
  }
}

export default TwitchChatQueue;
