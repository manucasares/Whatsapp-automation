import { CONTACT_BASE_NAME } from '../constants';
import { ICliente } from 'types';

export const getChatTabSelector = (cliente: ICliente) =>
  `div[data-testid="cell-frame-container"] div[role="gridcell"] span[title="${CONTACT_BASE_NAME} ${cliente.numero_identificador}"]`;
