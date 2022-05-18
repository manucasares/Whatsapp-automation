import axios from 'axios';
import { ICliente } from 'types';
import { GENDERIZE_API_URL } from '../constants';

export async function setClientesGenre(clientes: ICliente[]) {
  const clientesWithGenre: ICliente[] = [];

  for (const cliente of clientes) {
    const res = await axios.get(GENDERIZE_API_URL, {
      params: {
        name: cliente.nombre.split(' ')[0],
      },
    });

    const clienteWithGenre: ICliente = {
      ...cliente,
      genero: getGender(res.data.gender),
    };

    clientesWithGenre.push(clienteWithGenre);
  }

  return clientesWithGenre;
}

const getGender = (data: 'male' | 'female' | null) => {
  if (data === 'male') return 'm';
  if (data === 'female') return 'f';
};
