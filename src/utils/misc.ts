import chalk from 'chalk';
import { GRAMMAR_NOT_NAMES } from '../constants';

import { ILogErrorMessageOptions } from 'types';

const warning = chalk.hex('#FFA500');

export const logErrorMessage = (message: string, options?: ILogErrorMessageOptions) => {
  const { includeFrame } = options || {};

  includeFrame &&
    console.log(chalk.red('\n==============================================================='));
  console.log(chalk.red(message));
  includeFrame &&
    console.log(chalk.red('===============================================================\n'));
};

export const logWarning = (message: string) => {
  console.log(warning(message));
};

export const titleCase = (value: string) => {
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
};

export const lowercaseNotNames = (value: string) => {
  const splitted = value.split(' ');
  const transformedText = splitted
    .map(word => (GRAMMAR_NOT_NAMES.includes(word.toLowerCase()) ? word.toLocaleLowerCase() : word))
    .join(' ');
  return `${transformedText.charAt(0).toUpperCase()}${transformedText.slice(1)}`;
};
