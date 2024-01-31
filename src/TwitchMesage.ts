// type IRCMessageType = 'NOTICE' | 'PART' | 'PING' | 'PRIVMSG';

class TwitchMessage {
  public type: string | undefined;
  public channel: string | undefined;
  public content: string | undefined;

  constructor(rawMessage: string) {
    this.parseMesage(rawMessage);
  }

  private parseMesage(rawMessage: string): void {
    rawMessage = rawMessage.substring(rawMessage.indexOf(' ') + 1, rawMessage.length);

    // Get Message Type
    this.type = rawMessage.substring(0, rawMessage.indexOf(' '));
    rawMessage = rawMessage.replace(this.type, '').trim();

    // Get Message Channel
    this.channel = rawMessage.substring(0, rawMessage.indexOf(' '));
    rawMessage = rawMessage.replace(this.channel, '').trim();

    // Get Message Content
    this.content = rawMessage.substring(1, rawMessage.length);
    rawMessage = rawMessage.replace(this.content, '').trim();
  }
}

export default TwitchMessage;
