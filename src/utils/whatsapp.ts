import moment from 'moment';

import { ICliente, IWhatsappFlowReport } from 'types';

const getClienteReportText = (cliente: ICliente) => {
  return `\nNombre: ${cliente.nombre} ${cliente.apellido}. Identificador: ${cliente.numero_identificador}. Teléfono: ${cliente.telefono}`;
};

export const generateReport = (report: IWhatsappFlowReport) => {
  const fileName = moment().format('MMMM Do YYYY, h:mm:ss a').replace(/:/g, '-');

  let reportText = '';
  let alreadySentText = '';
  let messagesNotSent = '';

  report.messageAlreadySent.forEach(cliente => {
    alreadySentText += getClienteReportText(cliente);
  });

  report.notSendMessages.forEach(cliente => {
    messagesNotSent += getClienteReportText(cliente);
  });

  reportText += `
    ===============================================================
    CLIENTES QUE NO SE ENVIÓ MENSAJE PORQUE YA TENIA MENSAJES NUESTROS EN EL CHAT:
    ${alreadySentText}
    ===============================================================

    ===============================================================
    CLIENTES A LOS QUE NO SE PUDO ENVIAR UN MENSAJE (probablemente porque no los encontró el programa al no tener Whatsapp, pero puede ser otro motivo):
    ${messagesNotSent}
    ===============================================================
  `;

  console.log('reportText', reportText);

  return [fileName, reportText] as const;
};
