# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: loan-calculator.spec.ts >> Кредитный калькулятор >> изменение срока кредита и обновление расчётных показателей
- Location: tests\loan-calculator.spec.ts:38:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/92[\s\u00A0]?599/)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/92[\s\u00A0]?599/) with timeout 10000ms
  - waiting for getByText(/92[\s\u00A0]?599/)

```

```yaml
- main:
  - text: ✨ Волшебный кредитный зал ✨
  - heading "Кредитный калькулятор Мечтай. Планируй. Исполняй желания с волшебством" [level=1]
  - paragraph: Нежный, уютный и немного сказочный расчёт, чтобы твоя мечта стала совсем близко
  - img
  - paragraph: Волшебная анкета
  - heading "Расскажите о своей мечте" [level=2]
  - text: Исполним желание ФИО волшебного героя
  - textbox "ФИО волшебного героя":
    - /placeholder: Иванов Иван Иванович
  - text: Сумма мечты Волшебный объём
  - textbox "Сумма мечты": 5 000 000
  - slider "Сумма кредита слайдером": "5000000"
  - paragraph: От 300 000 ₽ до 30 000 000 ₽
  - text: Срок исполнения мечты В месяцах
  - textbox "Срок исполнения мечты": "240"
  - text: мес
  - slider "Срок кредита слайдером": "240"
  - paragraph: От 12 до 360 мес • 20 лет
  - heading "Выбери тип волшебного кредита" [level=2]
  - text: Нежные условия
  - radiogroup "Тип кредита":
    - radio "Ипотека 18%" [checked]
    - radio "Автокредит 23,5%"
    - radio "Потребительский 22,2%"
    - radio "Деньги до зарплаты 50%"
  - text: Ежемесячный доход, ₽
  - textbox "Ежемесячный доход, ₽":
    - /placeholder: 100 000
  - paragraph: Волшебные согласия
  - checkbox "Я являюсь гражданином РФ"
  - text: Я являюсь гражданином РФ
  - checkbox "Я даю согласие на обработку персональных данных в соответствии с политикой конфиденциальности (152-ФЗ)"
  - text: Я даю согласие на обработку персональных данных в соответствии с
  - link "политикой конфиденциальности":
    - /url: /privacy-policy.pdf
  - text: (152-ФЗ)
  - complementary:
    - heading "Волшебный прогноз" [level=2]
    - paragraph: Расчёт по продукту «Ипотека»
    - paragraph: Ежемесячный платёж
    - paragraph: 77 166 ₽
    - paragraph: Платёж наполнен волшебством, расчёт точен
    - term: Количество платежей
    - definition: "240"
    - term: Ставка
    - definition: 18%
    - term: Требуемая зарплата
    - definition: от 154 400 ₽
    - term: Общая сумма выплат
    - definition: 18 519 739 ₽
    - term: Переплата
    - definition: 13 519 739 ₽
    - button "✨ Оставить волшебную заявку ✨" [disabled]
    - paragraph: "Собери все звёздочки: заполни поля и подтверди согласия"
  - paragraph: Сделано с волшебством и добрыми намерениями ✨
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Кредитный калькулятор', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |   });
  7  | 
  8  |   test('начальные значения калькулятора и выбранный тип кредита', async ({ page }) => {
  9  |     await expect(page.getByRole('heading', { name: /Кредитный калькулятор/i })).toBeVisible();
  10 | 
  11 |     await expect(page.getByRole('radio', { name: /Ипотека/i })).toBeChecked();
  12 | 
  13 |     await expect(page.getByRole('textbox', { name: /Сумма мечты/i })).toHaveValue(/5[\s\u00A0]?000[\s\u00A0]?000/);
  14 |     
  15 |     await expect(page.getByRole('textbox', { name: /Срок исполнения мечты/i })).toHaveValue('120');
  16 | 
  17 |     const aside = page.getByRole('complementary');
  18 |     await expect(page.getByText(/Ежемесячный платёж/i)).toBeVisible();
  19 | await expect(page.getByText(/90[\s\u00A0]?093/)).toBeVisible();
  20 | await expect(page.getByText(/Ставка/i)).toBeVisible();
  21 | await expect(page.getByRole('complementary').getByText('18%', { exact: true })).toBeVisible();
  22 | await expect(page.getByText(/Количество платежей/i)).toBeVisible();
  23 |   });
  24 | 
  25 |   test('изменение суммы кредита и обновление расчётных показателей', async ({ page }) => {
  26 |     const amountInput = page.getByRole('textbox', { name: /Сумма мечты/i });
  27 |     await amountInput.click();
  28 |     await page.keyboard.press('Control+a');
  29 |     await page.keyboard.press('Backspace');
  30 |     await page.keyboard.type('6000000');
  31 |     
  32 |     await expect(amountInput).toHaveValue(/6[\s\u00A0]?000[\s\u00A0]?000/);
  33 |     
  34 |     const aside2 = page.getByRole('complementary');
  35 |     await expect(page.getByText(/108[\s\u00A0]?111/)).toBeVisible({ timeout: 10000 });
  36 |   });
  37 | 
  38 |   test('изменение срока кредита и обновление расчётных показателей', async ({ page }) => {
  39 |     const termInput = page.getByRole('textbox', { name: /Срок исполнения мечты/i });
  40 |     await termInput.click();
  41 |     await page.keyboard.press('Control+a');
  42 |     await page.keyboard.press('Backspace');
  43 |     await page.keyboard.type('240');
  44 |     
  45 |     await expect(termInput).toHaveValue('240');
  46 |     
  47 |     const aside3 = page.getByRole('complementary');
> 48 |     await expect(page.getByText(/92[\s\u00A0]?599/)).toBeVisible({ timeout: 10000 });
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  49 |   });
  50 | 
  51 |   test('переключение типа кредита и обновление ставки, срока и платежа', async ({ page }) => {
  52 |     await page.getByRole('radio', { name: /Автокредит/i }).click();
  53 |     
  54 |     await expect(page.getByRole('radio', { name: /Автокредит/i })).toBeChecked({ timeout: 10000 });
  55 |     const aside4 = page.getByRole('complementary');
  56 |     await expect(aside4.getByText(/23[,.]5%/)).toBeVisible({ timeout: 10000 });
  57 |     await expect(aside4.getByText(/Автокредит/).first()).toBeVisible({ timeout: 10000 });
  58 |     await expect(aside4.getByText(/121[\s\u00A0]?803/)).toBeVisible({ timeout: 10000 });
  59 |   });
  60 | 
  61 |   test('заполнение ФИО и ежемесячного дохода', async ({ page }) => {
  62 |     const fullNameInput = page.getByRole('textbox', { name: /ФИО/i });
  63 |     await fullNameInput.fill('Иванов Иван Иванович');
  64 |     await expect(fullNameInput).toHaveValue('Иванов Иван Иванович');
  65 |     
  66 |     const incomeInput = page.getByRole('textbox', { name: /Ежемесячный доход/i });
  67 |     await incomeInput.click();
  68 |     await page.keyboard.type('300000');
  69 |     await expect(incomeInput).toHaveValue(/300[\s\u00A0]?000/);
  70 |   });
  71 | 
  72 |   test('кнопка заявки заблокирована до заполнения обязательных полей и согласий', async ({ page }) => {
  73 |     const submitButton = page.getByRole('button', { name: /Оставить волшебную заявку/i });
  74 |     await expect(submitButton).toBeDisabled();
  75 |   });
  76 | 
  77 |   test('кнопка заявки активируется после заполнения обязательных полей и согласий', async ({ page }) => {
  78 |     await page.getByRole('textbox', { name: /ФИО/i }).fill('Иванов Иван Иванович');
  79 |     
  80 |     await page.getByRole('textbox', { name: /Ежемесячный доход/i }).click();
  81 |     await page.keyboard.type('300000');
  82 |     
  83 |     await page.getByRole('checkbox', { name: /гражданином РФ/i }).check();
  84 |     await page.getByRole('checkbox', { name: /согласие на обработку/i }).check();
  85 |     
  86 |     const submitButton = page.getByRole('button', { name: /Оставить волшебную заявку/i });
  87 |     await expect(submitButton).toBeEnabled();
  88 |   });
  89 | });
  90 | 
```