import { Browser, chromium, Page } from 'playwright';

export class BrowserManager {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async launch() {
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
    return this.page;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error('Page is not initialized.');
    }
    return this.page;
  }
}