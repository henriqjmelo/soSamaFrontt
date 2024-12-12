const { Builder, By, until } = require('selenium-webdriver');

jest.setTimeout(30000); // Aumenta o timeout para 30 segundos

describe('System Test - DatePicker with Authentication', () => {
  let driver;

  beforeAll(async () => {
    driver = new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:3000/login'); // URL da página de login

    // Aguarde o contêiner do formulário carregar
    await driver.wait(until.elementLocated(By.id('loginForm')), 10000);

    // Aguarde os elementos do formulário estarem visíveis
    const emailField = await driver.wait(
      until.elementIsVisible(await driver.findElement(By.id('email'))),
      10000
    );
    const passwordField = await driver.wait(
      until.elementIsVisible(await driver.findElement(By.id('password'))),
      10000
    );
    const loginButton = await driver.wait(
      until.elementIsVisible(await driver.findElement(By.css('button[title="Login"]'))),
      10000
    );

    // Preencha o formulário de login
    await emailField.sendKeys('vianadouglas_kap@hotmail.com');
    await passwordField.sendKeys('12345');
    await loginButton.click();

    // Aguarde redirecionar para a página inicial após o login
    await driver.wait(until.urlIs('http://localhost:3000/home'), 10000);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('should allow selecting a date', async () => {
    const datePickerButton = await driver.wait(
      until.elementLocated(By.id('date-picker')),
      10000
    );
    await datePickerButton.click();

    const dateToSelect = await driver.wait(
      until.elementLocated(By.css('.calendar-day[data-date="2024-12-01"]')),
      10000
    );
    await dateToSelect.click();

    const updatedButtonText = await datePickerButton.getText();
    expect(updatedButtonText).toContain('1 de dezembro de 2024');
  }, 30000);
});
