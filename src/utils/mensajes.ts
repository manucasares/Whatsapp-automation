import { ICliente, Mensaje } from 'types';

const CONTACT_NAME_SEPARATOR = '#';

export const getName = (cliente: ICliente) => {
  const nombre = cliente.nombre.split(CONTACT_NAME_SEPARATOR)[0];
  return nombre.trim();
};

export const getMensajeTelecentro = (cliente: ICliente) =>
  `${cliente.femenino ? 'Sra.' : 'Sr.'} ${
    cliente.nombre
  }, estoy retirando los equipos de TELECENTRO, mi nombre es Eduardo Casares, estoy recorriendo su zona mañana por la mañana, la dirección que tengo es ${
    cliente.direccion
  }. Para su tranquilidad le informo que yo no ingreso a su domicilio, los equipos me los entregan en la puerta. Disculpe la molestia y desde ya, muchas gracias.`;

export const getMensajeDirectTV = (cliente: ICliente) =>
  `${cliente.femenino ? 'Sra.' : 'Sr.'} ${
    cliente.nombre
  }, estoy retirando los equipos de DirectTV, mi nombre es Eduardo Casares, estoy recorriendo su zona mañana por la mañana, la dirección que tengo es ${
    cliente.direccion
  }. Para su tranquilidad le informo que yo no ingreso a su domicilio, los equipos me los entregan en la puerta. Disculpe la molestia y desde ya, muchas gracias.`;

export const MENSAJES: Record<Mensaje, (cliente: ICliente) => string> = {
  DIRECT_TV: getMensajeDirectTV,
  TELECENTRO: getMensajeTelecentro,
};
