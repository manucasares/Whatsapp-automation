import { Mensaje } from './mensajes';

export interface ICliente {
  id: string;
  nombre: string;
  numero_identificador: string;
  telefono: string;
  direccion: string;
  mensaje: Mensaje;
  femenino: boolean;
}
