import { ICliente } from 'types';

export const getChatTabSelector = (cliente: ICliente, contactBaseName: string) =>
  `div[role="gridcell"] span[title="TELECENTRO ${contactBaseName} ${cliente.numero_identificador}"]`;
