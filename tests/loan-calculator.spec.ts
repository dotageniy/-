import { test, expect } from '@playwright/test';

test.describe('Кредитный калькулятор', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('начальные значения калькулятора и выбранный тип кредита', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Кредитный калькулятор/i })).toBeVisible();

    await expect(page.getByRole('radio', { name: /Ипотека/i })).toBeChecked();

    await expect(page.getByRole('textbox', { name: /Сумма мечты/i })).toHaveValue(/5[\s\u00A0]?000[\s\u00A0]?000/);
    
    await expect(page.getByRole('textbox', { name: /Срок исполнения мечты/i })).toHaveValue('120');

    const aside = page.getByRole('complementary');
    await expect(page.getByText(/Ежемесячный платёж/i)).toBeVisible();
await expect(page.getByText(/90[\s\u00A0]?093/)).toBeVisible();
await expect(page.getByText(/Ставка/i)).toBeVisible();
await expect(page.getByRole('complementary').getByText('18%', { exact: true })).toBeVisible();
await expect(page.getByText(/Количество платежей/i)).toBeVisible();
  });

  test('изменение суммы кредита и обновление расчётных показателей', async ({ page }) => {
    const amountInput = page.getByRole('textbox', { name: /Сумма мечты/i });
    await amountInput.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('6000000');
    
    await expect(amountInput).toHaveValue(/6[\s\u00A0]?000[\s\u00A0]?000/);
    
    const aside2 = page.getByRole('complementary');
    await expect(page.getByText(/108[\s\u00A0]?111/)).toBeVisible({ timeout: 10000 });
  });

  test('изменение срока кредита и обновление расчётных показателей', async ({ page }) => {
    const termInput = page.getByRole('textbox', { name: /Срок исполнения мечты/i });
    await termInput.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('240');
    
    await expect(termInput).toHaveValue('240');
    
    const aside3 = page.getByRole('complementary');
    await expect(page.getByText(/92[\s\u00A0]?599/)).toBeVisible({ timeout: 10000 });
  });

  test('переключение типа кредита и обновление ставки, срока и платежа', async ({ page }) => {
    await page.getByRole('radio', { name: /Автокредит/i }).click();
    
    await expect(page.getByRole('radio', { name: /Автокредит/i })).toBeChecked({ timeout: 10000 });
    const aside4 = page.getByRole('complementary');
    await expect(aside4.getByText(/23[,.]5%/)).toBeVisible({ timeout: 10000 });
    await expect(aside4.getByText(/Автокредит/).first()).toBeVisible({ timeout: 10000 });
    await expect(aside4.getByText(/121[\s\u00A0]?803/)).toBeVisible({ timeout: 10000 });
  });

  test('заполнение ФИО и ежемесячного дохода', async ({ page }) => {
    const fullNameInput = page.getByRole('textbox', { name: /ФИО/i });
    await fullNameInput.fill('Иванов Иван Иванович');
    await expect(fullNameInput).toHaveValue('Иванов Иван Иванович');
    
    const incomeInput = page.getByRole('textbox', { name: /Ежемесячный доход/i });
    await incomeInput.click();
    await page.keyboard.type('300000');
    await expect(incomeInput).toHaveValue(/300[\s\u00A0]?000/);
  });

  test('кнопка заявки заблокирована до заполнения обязательных полей и согласий', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /Оставить волшебную заявку/i });
    await expect(submitButton).toBeDisabled();
  });

  test('кнопка заявки активируется после заполнения обязательных полей и согласий', async ({ page }) => {
    await page.getByRole('textbox', { name: /ФИО/i }).fill('Иванов Иван Иванович');
    
    await page.getByRole('textbox', { name: /Ежемесячный доход/i }).click();
    await page.keyboard.type('300000');
    
    await page.getByRole('checkbox', { name: /гражданином РФ/i }).check();
    await page.getByRole('checkbox', { name: /согласие на обработку/i }).check();
    
    const submitButton = page.getByRole('button', { name: /Оставить волшебную заявку/i });
    await expect(submitButton).toBeEnabled();
  });
});
