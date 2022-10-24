import fs from 'fs';

import puppeteer, { Page, Browser } from 'puppeteer';

import dotenv from 'dotenv';
dotenv.config();

import {
  generateReport,
  getChatTabSelector,
  getClients,
  getClientsFromExcel,
  getExcelFileName,
  getUniqueClients,
  logErrorMessage,
  logWarning,
  MENSAJES,
  setClientesGenre,
  startClientsPrompt,
  trimRowsKeys,
} from './utils';
import {
  CHAT_INPUT_SELECTOR,
  CONTACT_BASE_NAME,
  EXCEL_EXTENSION,
  LAUNCH_CONFIG,
  MESSAGES_CONTAINER_SELECTOR,
  MESSAGES_SPINNER_SELECTOR,
  SIDEBAR_SEARCH_INPUT_SELECTOR,
  VIEWPORT,
  WAIT_SELECTOR_OPTIONS,
  WHATSAPP_URL,
} from './constants';
import { ICliente, IWhatsappFlowReport } from 'types';

async function start() {
  console.clear();

  logWarning('====================================================');
  logWarning(`USANDO NOMBRE BASE DE CONTACTO: ${CONTACT_BASE_NAME}`);
  logWarning('====================================================\n\n');

  const clientes = await startExcelFlow();
  if (!clientes) return;
  await startWhatsappFlow(clientes);
}

async function startExcelFlow() {
  const excelFileName = getExcelFileName();

  if (!excelFileName)
    return logErrorMessage(
      `No se ha encontrado un archivo con Excel de nombre: "${excelFileName}" y extension: ${EXCEL_EXTENSION}`
    );

  try {
    const excelData: any[] = await getClientsFromExcel(excelFileName);
    const clientes = getClients(trimRowsKeys(excelData));
    // const uniqueClientes = getUniqueClients(clientes);

    // Inquirer
    const selectedClients = await startClientsPrompt(clientes);
    // const selectedClients = await startClientsPrompt(uniqueClientes);
    const clientesWithGenre = await setClientesGenre(selectedClients);

    return clientesWithGenre;
  } catch (error: any) {
    logErrorMessage(error);
  }
}

async function startWhatsappFlow(clientes: ICliente[]) {
  let browser: Browser | undefined;
  const report: IWhatsappFlowReport = {
    messageAlreadySent: [],
    notSendMessages: [],
  };

  try {
    browser = await puppeteer.launch(LAUNCH_CONFIG);
    if (!browser) return;

    const page: Page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.goto(WHATSAPP_URL);

    for (const cliente of clientes) {
      try {
        console.log(
          `\n\nInicia: #${cliente.numero_identificador} ${cliente.nombre} ${cliente.apellido}`
        );
        //
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
        const chatTab = await page.waitForSelector(getChatTabSelector(cliente), { timeout: 2000 });

        if (!chatTab) return;
        await chatTab.click();

        await page.waitForTimeout(1000);

        // Checking if chat has messages, if it has, we don't send any message
        await page.waitForSelector(MESSAGES_CONTAINER_SELECTOR);

        const hasMessageFromUs = await page.evaluate((selector: string) => {
          const messages = [...document.querySelectorAll(`${selector} > div`)];

          const hasMessageFromUs = messages.some(message => {
            const dataIdAttr = message.getAttribute('data-id');
            if (!dataIdAttr) return false;
            return dataIdAttr.startsWith('true');
          });

          return Promise.resolve(hasMessageFromUs);
        }, MESSAGES_CONTAINER_SELECTOR);

        if (hasMessageFromUs) {
          report.messageAlreadySent.push(cliente);
          logWarning(
            `\nNo se ha enviado mensaje al cliente con nombre ${cliente.nombre} ${cliente.apellido}, y numero ${cliente.telefono}, porque ya hay mensajes dentro de este chat.\n`
          );
          continue;
        }

        // Chat Input
        const chatInputBox = await page.waitForSelector(CHAT_INPUT_SELECTOR, WAIT_SELECTOR_OPTIONS);

        if (!chatInputBox) return;
        await chatInputBox.click();

        const getMensaje = MENSAJES[cliente.empresa];
        await chatInputBox.type(getMensaje(cliente));
        // await page.keyboard.press('Enter');
        await page.waitForTimeout(1000);
        // ======== //
      } catch (error) {
        report.notSendMessages.push(cliente);
        logErrorMessage(
          `\nHubo un error con el contacto: ${cliente.nombre}, con número de teléfono: ${cliente.telefono}\n\n${error}`,
          { includeFrame: true }
        );
        continue;
      }
    }

    const [fileName, reportText] = generateReport(report);

    fs.writeFileSync(`./${fileName}.txt`, reportText);

    browser?.close();
  } catch (error) {
    console.log('err', error);
    browser?.close();
  }
}

start();
