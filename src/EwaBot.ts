import * as puppeteer from 'puppeteer';

const EVIE_BOT_URL = 'https://www.eviebot.com/';

const textField = '.stimulus';
const sayButton = '.sayitbutton';
const agreeButton = '.understood';

class EvieBot {
  private browser: puppeteer.Browser | undefined;
  private page: puppeteer.Page | undefined;

  // Connect to EvieBot by launching a browser
  public async connect(): Promise<void> {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();

    await this.page.goto(EVIE_BOT_URL);

    // Set screen size
    await this.page.setViewport({ width: 1080, height: 1024 });

    // Click agree button
    await this.page.click(agreeButton);
  }

  // Send message to evie bot
  public async say(message: string): Promise<void> {
    return new Promise(async (resolve) => {
      if (this.page) {
        const inputField = await this.page?.$(textField);

        await this.page.type(textField, message);
        await this.page.click(sayButton);

        while (true) {
          if (inputField) {
            let isReadOnly = (await (await inputField.getProperty('readOnly')).jsonValue()) as boolean;

            if (isReadOnly === false) {
              setTimeout(() => {
                resolve();
              }, 6000);

              break;
            }
          }
        }
      }
    });
  }
}

export default EvieBot;
