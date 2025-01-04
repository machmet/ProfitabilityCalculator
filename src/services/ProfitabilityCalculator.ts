import { Page } from 'playwright';

export class BondCode {
  constructor(public name: string, public value: string) {}
}
export class Issuer {
  bondCodes: BondCode[] = [];
  
  constructor(public name: string, public value: string) {}

  addBondCodes(bondCodes: BondCode[]) {
    this.bondCodes.push(...bondCodes);
  }
}

export class ProfitabilityCalculator {
  
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async start() {
    await this.page.goto('https://obligacje.pl/pl/narzedzia/kalkulator-rentownosci');

    await this.waitForButtonAgree();
  }

  async waitForButtonAgree() {
    // Czekaj na przycisk "Zgadzam się" przez maksymalnie 5 sekund
    const acceptButtonPromise = this.page.waitForSelector('button:has-text("Zgadzam się")', {
      timeout: 5000,
    });
  
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000));
  
    try {
      await Promise.race([acceptButtonPromise, timeoutPromise]);
      const acceptButton = await this.page.$('button:has-text("Zgadzam się")');
      if (acceptButton) {
        await acceptButton.click();
      }
    } catch (error) {
      console.log('Przycisk "Zgadzam się" nie pojawił się w ciągu 5 sekund. Przechodzę dalej.');
    }
  }

  async getAllIssuers() {
    // Poczekaj, aż lista rozwijana będzie dostępna
    await this.page.waitForSelector('#kal_emitent');

    // Pobierz wszystkie opcje z listy rozwijanej
    const options = await this.page.$$eval('#kal_emitent option', (options) =>
      options.map((option) => ({
        name: option.textContent?.trim() || '',
        value: option.getAttribute('value') || '',
      }))
    );

    // Filtruj opcje, aby pominąć pierwszą (domyślną) opcję "wybierz"
    const issuers = options
      .filter((option) => option.value !== '') // Pomijaj opcje bez wartości
      .map((option) => new Issuer(option.name, option.value));

    return issuers;
  }

  async selectIssuer(issuer: Issuer) {
    await this.page.selectOption('#kal_emitent', issuer.value);
  }

  async getBondCodes() {
    await this.page.waitForSelector('#kal_kod_obligacji');
    // wait 1 second
    await this.page.waitForTimeout(1000);
    const options = await this.page.$$eval('#kal_kod_obligacji option', (options) =>
      options.map((option) => ({
        name: option.textContent?.trim() || '',
        value: option.getAttribute('value') || '',
      }))
    );
    // Filtruj opcje, aby pominąć pierwszą (domyślną) opcję "wybierz"
    const bondCodes = options
      .filter((option) => option.value !== '') // Pomijaj opcje bez wartości
      .map((option) => new BondCode(option.name, option.value));

    return bondCodes;
  }

  async selectBondCode(bondCode: BondCode) {
    await this.page.selectOption('#kal_kod_obligacji', bondCode.value);
  }
}