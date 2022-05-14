import { ICliente } from 'types';
import { NOMBRE_CONTACTO } from '../data/clientes';

export const getChatTabSelector = (cliente: ICliente) =>
  `div[data-testid="cell-frame-container"] div[role="gridcell"] span[title="${NOMBRE_CONTACTO} ${cliente.numero_identificador}"]`;
