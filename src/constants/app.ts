import { PuppeteerLaunchOptions } from 'puppeteer';

export const GENDERIZE_API_URL = 'https://api.genderize.io';
export const GENDER_API_URL = 'https://gender-api.com/';
export const WHATSAPP_URL = 'https://web.whatsapp.com/';
export const STREET_SEPARATOR = '#';
export const LAUNCH_CONFIG: PuppeteerLaunchOptions = {
  headless: false,
  args: [
    // '--user-data-dir=./Google/Chrome/User Data/'
    '--disable-extensions'],
  // devtools: true,
  // slowMo: 1000,
  dumpio: true, // Show logs in Chrome
};

export const WAIT_SELECTOR_OPTIONS = {
  timeout: 3000000,
};

export const VIEWPORT = { width: 1366, height: 768 };
export const GRAMMAR_NOT_NAMES = ['de', 'el', 'la', 'las', 'los', 'y'];

export const EMPRESA = 'TELECENTRO';
