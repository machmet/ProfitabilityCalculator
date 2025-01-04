import * as fs from 'fs';
import * as path from 'path';

export class FileProvider {
  private dataDir: string;

  constructor(dataDir: string = path.join(__dirname, '../../data')) {
    this.dataDir = dataDir;
    this.ensureDataDirExists();
  }

  private ensureDataDirExists() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }
  }

  getScreenshotPath(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(this.dataDir, `screenshot-${timestamp}.png`);
  }
}