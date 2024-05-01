import fs from 'fs';

import puppeteer, { Page, Browser } from 'puppeteer';

import dotenv from 'dotenv';
dotenv.config();

import {
  clearInputField,
  generateReport,
  getChatTabSelector,
  getClients,
  getClientsFromExcel,
  getExcelFileName,
  getUniqueClients,
  logErrorMessage,
  logWarning,
  MENSAJES,
  promptContactBaseName,
  promptUseSpecificGenre,
  setClientesGenre,
  startClientsPrompt,
  trimRowsKeys,
} from './utils';
import {
  CHAT_INPUT_SELECTOR,
  LAUNCH_CONFIG,
  SIDEBAR_SEARCH_INPUT_SELECTOR,
  VIEWPORT,
  WAIT_SELECTOR_OPTIONS,
  WHATSAPP_URL,
} from './constants';
import { ICliente, IWhatsappFlowReport } from 'types';

async function start() {
  console.clear();

  const clientes = await startExcelFlow();
  if (!clientes) return;
  await startWhatsappFlow(clientes);
}

async function startExcelFlow() {
  const excelFileName = getExcelFileName();

  if (!excelFileName)
    return logErrorMessage(
      `No se ha encontrado un archivo con Excel de nombre: "${excelFileName}"`
    );

  try {
    const excelData: any[] = await getClientsFromExcel(excelFileName);
    const clientes = getClients(trimRowsKeys(excelData));
    // const uniqueClientes = getUniqueClients(clientes);

    // Inquirer
    const selectedClients = await startClientsPrompt(clientes);
    const useSpecificGenre = await promptUseSpecificGenre();
    // const selectedClients = await startClientsPrompt(uniqueClientes);

    let clientesWithGenre: ICliente[] | undefined;
    if (useSpecificGenre) {
      clientesWithGenre = await setClientesGenre(selectedClients);
    }

    return useSpecificGenre ? clientesWithGenre : selectedClients;
  } catch (error: any) {
    logErrorMessage(error);
  }
}

async function startWhatsappFlow(clientes: ICliente[]) {
  // Prompt for contact base name
  const contactBaseName: string = await promptContactBaseName();

  logWarning('====================================================');
  logWarning(`USANDO NOMBRE BASE DE CONTACTO: ${contactBaseName}`);
  logWarning('====================================================\n\n');

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

        // Sidebar Input
        const sidebarInputSearch = await page.waitForSelector(
          SIDEBAR_SEARCH_INPUT_SELECTOR,
          WAIT_SELECTOR_OPTIONS
        );

        // Clearing search input
        await clearInputField(page, SIDEBAR_SEARCH_INPUT_SELECTOR);

        if (!sidebarInputSearch) return;
        await sidebarInputSearch.click();
        await sidebarInputSearch.type(cliente.telefono);
        // ======== //

        await page.waitForTimeout(3000);

        // FIXME: getChatTabSelector no lo encuentra, chequear si es bug o no
        // Chat Tab
        const chatTab = await page.waitForSelector(getChatTabSelector(cliente, contactBaseName), {
          timeout: 2000,
        });

        if (!chatTab) return;
        await chatTab.click();

        await page.waitForTimeout(1000);

        // Chat Input
        const chatInputBox = await page.waitForSelector(CHAT_INPUT_SELECTOR, WAIT_SELECTOR_OPTIONS);

        if (!chatInputBox) return;
        await chatInputBox.click();

        const getMensaje = MENSAJES[cliente.empresa];
        await chatInputBox.type(getMensaje(cliente));
        await page.keyboard.press('Enter');
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
