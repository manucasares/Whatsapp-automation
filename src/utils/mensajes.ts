import { ICliente, Mensaje } from 'types';

const CONTACT_NAME_SEPARATOR = '#';

export const getName = (cliente: ICliente) => {
  const nombre = cliente.nombre.split(CONTACT_NAME_SEPARATOR)[0];
  return nombre.trim();
};

export const getMensajeTelecentro = (cliente: ICliente) =>
  `${getGenderPrefix(cliente)} ${cliente.nombre} ${
    cliente.apellido
  }, estoy retirando los equipos de TELECENTRO, mi nombre es Eduardo Casares, estoy recorriendo su zona en el día de mañana, la dirección que tengo es ${
    cliente.direccion
  }${
    cliente.localidad ? ', ' + cliente.localidad : ''
  }. Por favor confirmar si se puede pasar o no. Para su tranquilidad le informo que yo no ingreso a su domicilio, los equipos me los entregan en la puerta. Disculpe la molestia y desde ya, muchas gracias.`;

export const getMensajeDirectTV = (cliente: ICliente) =>
  `${getGenderPrefix(cliente)} ${cliente.nombre} ${
    cliente.apellido
  }, estoy retirando los equipos de DirectTV, mi nombre es Eduardo Casares, estoy recorriendo su zona mañana por la mañana, la dirección que tengo es ${
    cliente.direccion
  }${
    cliente.localidad ? ', ' + cliente.localidad : ''
  }. Para su tranquilidad le informo que yo no ingreso a su domicilio, los equipos me los entregan en la puerta. Disculpe la molestia y desde ya, muchas gracias.`;

export const MENSAJES: Record<Mensaje, (cliente: ICliente) => string> = {
  DIRECT_TV: getMensajeDirectTV,
  TELECENTRO: getMensajeTelecentro,
};

const getGenderPrefix = (cliente: ICliente): string => {
  if (!cliente.genero) return 'Sr./Sra.';
  return cliente.genero == 'f' ? 'Sra.' : 'Sr.';
};
