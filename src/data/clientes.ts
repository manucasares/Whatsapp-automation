import { ICliente } from 'types';
import { v4 as uuidv4 } from 'uuid';
// ==================================================================== //
// =------------------------------------------------------------------= //
// =------------------------------------------------------------------= //
// =------------------------------------------------------------------= //
// ==================================================================== //

export const NOMBRE_CONTACTO = 'TELECENTRO AB';

export const CLIENTES: ICliente[] = [
  {
    id: uuidv4(),
    nombre: 'Diana',
    numero_identificador: '115',
    telefono: '11 3187-7290',
    direccion: 'Av. Rivadavia 5450',
    mensaje: 'DIRECT_TV',
    femenino: true,
  },
];
