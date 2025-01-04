import { Page } from 'playwright';
import { FileProvider } from '../providers/FileProvider';

export class ScreenshotService {
  private page: Page;
  private fileProvider: FileProvider;

  constructor(page: Page, fileProvider: FileProvider) {
    this.page = page;
    this.fileProvider = fileProvider;
  }

  async takeScreenshot() {
    const screenshotPath = this.fileProvider.getScreenshotPath();
    await this.page.screenshot(
    {
      path: screenshotPath,
      fullPage: true
    });
    console.log(`Zrzut ekranu zapisany jako: ${screenshotPath}`);
  }
}