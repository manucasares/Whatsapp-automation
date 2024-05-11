import inquirer from 'inquirer';

import { ICliente, IValueName } from 'types';

const getChoices = (clientes: ICliente[]): IValueName[] => {
  const choices = clientes.map(cliente => ({
    name: `${cliente.numero_identificador}) ${cliente.nombre} ${cliente.apellido}`,
    value: cliente.uuid,
  }));

  return choices;
};

export const startClientsPrompt = async (clientes: ICliente[]) => {
  const choices = getChoices(clientes);

  const { selected_clients_ids } = await inquirer.prompt<{ selected_clients_ids: string[] }>({
    type: 'checkbox',
    name: 'selected_clients_ids',
    message: 'Seleccione los clientes a los que quiera enviar mensajes...',
    default: clientes,
    choices,
  });

  const selectedClients = clientes.filter(cliente =>
    selected_clients_ids.some(id => id === cliente.uuid)
  );

  return selectedClients;
};

export const promptUseSpecificGenre = async () => {
  const { useSpecificGenre } = await inquirer.prompt<{ useSpecificGenre: boolean }>({
    type: 'confirm',
    name: 'useSpecificGenre',
    message: 'Desea usar un género específico para todos los clientes?',
  });

  return useSpecificGenre;
};

export const promptContactBaseName = async () => {
  const { contact_base_name } = await inquirer.prompt<{ contact_base_name: string }>({
    type: 'input',
    name: 'contact_base_name',
    message: 'Escriba el nombre de contacto base, por ej: AB, BC, CD:',
  });

  return contact_base_name.trim();
};
