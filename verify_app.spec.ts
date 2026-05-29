import { test, expect } from '@playwright/test';

test('verify interactive features', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // 1. Initial state (Dark Mode)
  await page.screenshot({ path: 'initial_state.png', fullPage: true });

  // 2. Test Tasbih Counter
  const tasbihBtn = page.locator('#tasbih-btn');
  const tasbihValue = page.locator('#tasbih-value');

  await expect(tasbihValue).toHaveText('0');
  await tasbihBtn.click();
  await tasbihBtn.click();
  await tasbihBtn.click();
  await expect(tasbihValue).toHaveText('3');
  await page.screenshot({ path: 'tasbih_clicked.png' });

  // 3. Test Theme Toggle
  const themeToggle = page.locator('#theme-toggle');
  await themeToggle.click();
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'light');
  await page.screenshot({ path: 'light_mode.png', fullPage: true });

  // 4. Verify Prayer Times (wait for API)
  // Since we use Riyadh/Saudi Arabia, it should eventually load something other than "جاري التحميل..."
  await page.waitForFunction(() => {
    const el = document.getElementById('next-prayer-name');
    return el && el.textContent !== 'جاري التحميل...';
  }, { timeout: 10000 });

  const prayerName = await page.locator('#next-prayer-name').textContent();
  console.log('Detected next prayer:', prayerName);
  await page.screenshot({ path: 'prayer_times_loaded.png' });
});
