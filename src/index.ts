import { Container } from './ioc/container';
import { Issuer } from './services/ProfitabilityCalculator';

async function run() {
  const browserManager = Container.getBrowserManager();
  try {
    const page = await browserManager.launch();

    const profitabilityCalc = Container.getProfitabilityCalculator(page);
    await profitabilityCalc.start();
    const items : Issuer[] = await profitabilityCalc.getAllIssuers();
    for (let i = 2; i < 3; i++) {
      console.log(`${i + 1}. ${items[i].name}`);
      const item = items[i];
      await profitabilityCalc.selectIssuer(item);
      const bondCodes = await profitabilityCalc.getBondCodes();
      item.addBondCodes(bondCodes);
      for (let j = 0; j < bondCodes.length; j++) {
        console.log(`  - ${bondCodes[j].name}`);
        profitabilityCalc.selectBondCode(bondCodes[j]);
      }
      console.log(item);
      if(bondCodes.length > 0) {
        break;
      }
    }
    

    const screenshotService = Container.getScreenshotService(page);
    await screenshotService.takeScreenshot();
  } catch (error) {
    console.error('Wystąpił błąd:', error);
  } finally {
    await browserManager.close();
  }
}

run();