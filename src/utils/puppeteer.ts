import { Page } from 'puppeteer';

export async function clearInputField(page: Page, selector: string): Promise<void> {
  await page.focus(selector);
  await page.keyboard.press('End');
  await page.keyboard.down('Shift');
  for (let i = 0; i < 100; i++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.up('Shift');
}
