import { ICliente } from './clientes';

export interface IWhatsappFlowReport {
  notSendMessages: ICliente[];
  messageAlreadySent: ICliente[];
}
