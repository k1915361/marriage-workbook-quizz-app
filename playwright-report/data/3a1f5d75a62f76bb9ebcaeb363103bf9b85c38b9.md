# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: quiz.spec.ts >> Marriage Quiz App >> should allow retaking quiz
- Location: e2e\quiz.spec.ts:88:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Retake Quiz' })

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - button "Click me" [ref=e3] [cursor=pointer]
  - text: ;
  - generic [ref=e6]:
    - generic [ref=e7]:
      - paragraph [ref=e8]: Question 5 of 5
      - progressbar
    - paragraph [ref=e9]: "Principle 5: Grow Together as a Team"
    - heading "Do you actively support each other's personal growth and individual goals?" [level=3] [ref=e10]
    - radiogroup [ref=e11]:
      - group [ref=e12] [cursor=pointer]:
        - radio "Absolutely, we are each other's biggest cheerleaders and actively help each other." [checked] [ref=e13]
        - generic [ref=e14]: Absolutely, we are each other's biggest cheerleaders and actively help each other.
      - group [ref=e15] [cursor=pointer]:
        - radio "Yes, conceptually, but we don't always take active steps to support them." [ref=e16]
        - generic [ref=e17]: Yes, conceptually, but we don't always take active steps to support them.
      - group [ref=e18] [cursor=pointer]:
        - radio "We are mostly indifferent to each other's individual pursuits outside the marriage." [ref=e19]
        - generic [ref=e20]: We are mostly indifferent to each other's individual pursuits outside the marriage.
      - group [ref=e21] [cursor=pointer]:
        - radio "No, individual goals often feel like a threat to our time or resources." [ref=e22]
        - generic [ref=e23]: No, individual goals often feel like a threat to our time or resources.
    - separator [ref=e24]
    - generic [ref=e25]:
      - button "Previous" [ref=e26] [cursor=pointer]:
        - generic [ref=e28]: Previous
      - button "Finish" [active] [ref=e29] [cursor=pointer]:
        - generic [ref=e31]: Finish
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Marriage Quiz App', () => {
  4   |   test('should display welcome screen', async ({ page }) => {
  5   |     await page.goto('/');
  6   | 
  7   |     await expect(page.getByRole('heading', { name: 'Marriage Enrichment Quiz' })).toBeVisible();
  8   |     await expect(page.getByText('Based on "The 7 Principles of Creation"')).toBeVisible();
  9   |     await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
  10  |   });
  11  | 
  12  |   test('should start quiz when clicking Start Quiz', async ({ page }) => {
  13  |     await page.goto('/');
  14  |     await page.getByRole('button', { name: 'Start Quiz' }).click();
  15  | 
  16  |     await expect(page.getByText('Question 1 of 5')).toBeVisible();
  17  |   });
  18  | 
  19  |   test('should complete quiz flow', async ({ page }) => {
  20  |     await page.goto('/');
  21  |     await page.getByRole('button', { name: 'Start Quiz' }).click();
  22  | 
  23  |     // Answer question 1
  24  |     await page.locator('.option-card').first().click();
  25  |     await page.getByRole('button', { name: 'Next' }).click();
  26  | 
  27  |     // Answer question 2
  28  |     await page.locator('.option-card').first().click();
  29  |     await page.getByRole('button', { name: 'Next' }).click();
  30  | 
  31  |     // Answer question 3
  32  |     await page.locator('.option-card').first().click();
  33  |     await page.getByRole('button', { name: 'Next' }).click();
  34  | 
  35  |     // Answer question 4
  36  |     await page.locator('.option-card').first().click();
  37  |     await page.getByRole('button', { name: 'Next' }).click();
  38  | 
  39  |     // Answer question 5
  40  |     await page.locator('.option-card').first().click();
  41  |     await page.getByRole('button', { name: 'Finish' }).click();
  42  | 
  43  |     // Verify results screen
  44  |     await expect(page.getByText('Quiz Completed')).toBeVisible();
  45  |     await expect(page.getByText(/\d+\/\d+/)).toBeVisible();
  46  |   });
  47  | 
  48  |   test('should disable Next button until answer is selected', async ({ page }) => {
  49  |     await page.goto('/');
  50  |     await page.getByRole('button', { name: 'Start Quiz' }).click();
  51  | 
  52  |     const nextButton = page.getByRole('button', { name: 'Next' });
  53  |     await expect(nextButton).toBeDisabled();
  54  | 
  55  |     await page.locator('.option-card').first().click();
  56  |     await expect(nextButton).not.toBeDisabled();
  57  |   });
  58  | 
  59  |   test('should navigate between questions', async ({ page }) => {
  60  |     await page.goto('/');
  61  |     await page.getByRole('button', { name: 'Start Quiz' }).click();
  62  | 
  63  |     // Answer first question
  64  |     await page.locator('.option-card').first().click();
  65  |     await page.getByRole('button', { name: 'Next' }).click();
  66  | 
  67  |     // Go back to previous question
  68  |     await page.getByRole('button', { name: 'Previous' }).click();
  69  |     await expect(page.getByText('Question 1 of 5')).toBeVisible();
  70  |   });
  71  | 
  72  |   test('should show results with score breakdown', async ({ page }) => {
  73  |     await page.goto('/');
  74  |     await page.getByRole('button', { name: 'Start Quiz' }).click();
  75  | 
  76  |     // Complete all questions
  77  |     for (let i = 0; i < 5; i++) {
  78  |       await page.locator('.option-card').first().click();
  79  |       const buttonText = i === 4 ? 'Finish' : 'Next';
  80  |       await page.getByRole('button', { name: buttonText }).click();
  81  |     }
  82  | 
  83  |     // Verify results
  84  |     await expect(page.getByText('Answer Breakdown')).toBeVisible();
  85  |     await expect(page.getByText('Q1')).toBeVisible();
  86  |   });
  87  | 
  88  |   test('should allow retaking quiz', async ({ page }) => {
  89  |     await page.goto('/');
  90  |     await page.getByRole('button', { name: 'Start Quiz' }).click();
  91  | 
  92  |     // Complete quiz
  93  |     for (let i = 0; i < 5; i++) {
  94  |       await page.locator('.option-card').first().click();
  95  |       const buttonText = i === 4 ? 'Finish' : 'Next';
  96  |       await page.getByRole('button', { name: buttonText }).click();
  97  |     }
  98  | 
  99  |     // Retake quiz
> 100 |     await page.getByRole('button', { name: 'Retake Quiz' }).click();
      |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  101 |     await expect(page.getByRole('heading', { name: 'Marriage Enrichment Quiz' })).toBeVisible();
  102 |   });
  103 | });
  104 | 
```