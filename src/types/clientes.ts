import { Mensaje } from './mensajes';

export interface ICliente {
  nombre: string;
  apellido: string;
  numero_identificador: string;
  telefono: string;
  direccion: string;
  empresa: Mensaje;
  genero: 'f' | 'm' | undefined;
}

// genero: string | undefined;
// nombre: string;
// apellido: string;
// numero_identificador: string;
// telefono: string;
// direccion: string;
// empresa: Mensaje;
