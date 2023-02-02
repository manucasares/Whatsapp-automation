import { ICliente } from 'types';

export const getChatTabSelector = (cliente: ICliente, contactBaseName: string) =>
  `div[data-testid="cell-frame-container"] div[role="gridcell"] span[title="${contactBaseName} ${cliente.numero_identificador}"]`;
