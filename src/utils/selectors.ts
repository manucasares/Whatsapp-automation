import { ICliente } from 'types';
import { BASE_CONTACTO } from '../data/clientes';

export const getChatTabSelector = (cliente: ICliente) =>
  `div[data-testid="cell-frame-container"] div[role="gridcell"] span[title="${BASE_CONTACTO} ${cliente.numero_identificador}"]`;
