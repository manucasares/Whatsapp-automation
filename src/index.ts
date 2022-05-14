import { Page, Browser } from 'puppeteer';
import { getChatTabSelector, MENSAJES } from './utils';
import { CLIENTES } from './data';
import {
  CHAT_INPUT_SELECTOR,
  LAUNCH_CONFIG,
  SIDEBAR_SEARCH_INPUT_SELECTOR,
  VIEWPORT,
  WAIT_SELECTOR_OPTIONS,
  WHATSAPP_URL,
} from './constants';

console.clear();

const puppeteer = require('puppeteer');
const chalk = require('chalk');

const start = async () => {
  let browser: Browser | undefined;

  try {
    browser = await puppeteer.launch(LAUNCH_CONFIG);
    if (!browser) return;

    const page: Page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.goto(WHATSAPP_URL);

    for (const cliente of CLIENTES) {
      try {
        console.log(`Inicia cliente con nombre: ${cliente.nombre}`);

        // Sidebar Input
        const sidebarInputSearch = await page.waitForSelector(
          SIDEBAR_SEARCH_INPUT_SELECTOR,
          WAIT_SELECTOR_OPTIONS
        );

        // Setting empty string as input value
        await page.$eval(SIDEBAR_SEARCH_INPUT_SELECTOR, input => (input.textContent = ''));

        if (!sidebarInputSearch) return;
        await sidebarInputSearch.click();
        await sidebarInputSearch.type(cliente.telefono);
        // ======== //

        await page.waitForTimeout(3000);

        // Chat Tab
        const chatTab = await page.waitForSelector(getChatTabSelector(cliente));

        if (!chatTab) return;
        await chatTab.click();
        // ======== //

        // Chat Input
        const chatInputBox = await page.waitForSelector(CHAT_INPUT_SELECTOR, WAIT_SELECTOR_OPTIONS);
        if (!chatInputBox) return;
        await chatInputBox.click();

        const getMensaje = MENSAJES[cliente.mensaje];
        await chatInputBox.type(getMensaje(cliente));
        // await page.keyboard.press('Enter');
        // ======== //
      } catch (error) {
        console.log(chalk.red('==============================================================='));
        console.log(chalk.red(`\nHubo un error con el contacto: ${cliente.nombre}\n\n`, error));
        console.log(chalk.red('==============================================================='));
        continue;
      }
    }
  } catch (error) {
    console.log('err', error);
    browser?.close();
  }
};

start();
