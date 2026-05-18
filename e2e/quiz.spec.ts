import { test, expect } from '@playwright/test';

test.describe('Marriage Quiz App', () => {
  test('should display welcome screen', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Marriage Enrichment Quiz' })).toBeVisible();
    await expect(page.getByText('Based on "The 7 Principles of Creation"')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
  });

  test('should start quiz when clicking Start Quiz', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start Quiz' }).click();

    await expect(page.getByText('Question 1 of 5')).toBeVisible();
  });

  test('should complete quiz flow', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start Quiz' }).click();

    // Answer question 1
    await page.locator('.option-card').first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Answer question 2
    await page.locator('.option-card').first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Answer question 3
    await page.locator('.option-card').first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Answer question 4
    await page.locator('.option-card').first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Answer question 5
    await page.locator('.option-card').first().click();
    await page.getByRole('button', { name: 'Finish' }).click();

    // Verify results screen
    await expect(page.getByText('Quiz Completed')).toBeVisible();
    await expect(page.getByText(/\d+\/\d+/)).toBeVisible();
  });

  test('should disable Next button until answer is selected', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start Quiz' }).click();

    const nextButton = page.getByRole('button', { name: 'Next' });
    await expect(nextButton).toBeDisabled();

    await page.locator('.option-card').first().click();
    await expect(nextButton).not.toBeDisabled();
  });

  test('should navigate between questions', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start Quiz' }).click();

    // Answer first question
    await page.locator('.option-card').first().click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Go back to previous question
    await page.getByRole('button', { name: 'Previous' }).click();
    await expect(page.getByText('Question 1 of 5')).toBeVisible();
  });

  test('should show results with score breakdown', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start Quiz' }).click();

    // Complete all questions
    for (let i = 0; i < 5; i++) {
      await page.locator('.option-card').first().click();
      const buttonText = i === 4 ? 'Finish' : 'Next';
      await page.getByRole('button', { name: buttonText }).click();
    }

    // Verify results
    await expect(page.getByText('Answer Breakdown')).toBeVisible();
    await expect(page.getByText('Q1')).toBeVisible();
  });

  test('should allow retaking quiz', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start Quiz' }).click();

    // Complete quiz
    for (let i = 0; i < 5; i++) {
      await page.locator('.option-card').first().click();
      const buttonText = i === 4 ? 'Finish' : 'Next';
      await page.getByRole('button', { name: buttonText }).click();
    }

    // Retake quiz
    await page.getByRole('button', { name: 'Retake Quiz' }).click();
    await expect(page.getByRole('heading', { name: 'Marriage Enrichment Quiz' })).toBeVisible();
  });
});
