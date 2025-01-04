import { BrowserManager } from '../core/BrowserManager';
import { ProfitabilityCalculator } from '../services/ProfitabilityCalculator';
import { ScreenshotService } from '../services/ScreenshotService';
import { FileProvider } from '../providers/FileProvider';

export class Container {
  static getBrowserManager(): BrowserManager {
    return new BrowserManager();
  }

  static getProfitabilityCalculator(page: any): ProfitabilityCalculator {
    return new ProfitabilityCalculator(page);
  }

  static getScreenshotService(page: any): ScreenshotService {
    const fileProvider = new FileProvider();
    return new ScreenshotService(page, fileProvider);
  }
}