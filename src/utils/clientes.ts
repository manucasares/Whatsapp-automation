import axios from 'axios';
import { ICliente } from 'types';
import { GENDERIZE_API_URL, GENDER_API_URL } from '../constants';

export async function setClientesGenre(clientes: ICliente[]) {
  const clientesWithGenre: ICliente[] = [];

  for (const cliente of clientes) {
    const genero = await getGender(cliente);

    const clienteWithGenre: ICliente = {
      ...cliente,
      genero,
    };

    clientesWithGenre.push(clienteWithGenre);
  }

  return clientesWithGenre;
}

const getGender = async (cliente: ICliente) => {
  // Genderize API
  const gender = await genderizeIoApi(cliente);
  return gender;

  // Fallback API in case API calls for 'genderize.api.io' limit is exceeded
  // const gender = await genderApi(cliente);
  // return gender;
};

const genderizeIoApi = async (cliente: ICliente) => {
  const res = await axios.get(GENDERIZE_API_URL, {
    params: {
      name: cliente.nombre.split(' ')[0],
    },
  });

  return res.data.gender === 'male' ? 'm' : 'f';
};

const genderApi = async (cliente: ICliente) => {
  if (!process.env.GENDER_API_KEY) {
    throw new Error('Gender API Key is undefined or null.');
  }

  const res = await axios.get(GENDER_API_URL, {
    params: {
      name: cliente.nombre.split(' ')[0],
      key: process.env.GENDER_API_KEY,
    },
  });

  return res.data.gender === 'male' ? 'm' : 'f';
};
