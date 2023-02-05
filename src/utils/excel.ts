import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import XLSX from 'xlsx';

import { ICliente, IRowFromExcel } from 'types';
import { STREET_SEPARATOR, EMPRESA } from '../constants';
import { lowercaseNotNames, titleCase } from './misc';

export const getExcelFileName = () => {
  const rootFiles = fs.readdirSync('./');
  const regex = new RegExp(/\.xlsx?$/, 'g');
  const excelName = rootFiles.find(file => file.match(regex));
  return excelName;
};

export const getClientsFromExcel = (excelName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const excelWorkbook: XLSX.WorkBook = XLSX.readFile(excelName);
    const sheetName = excelWorkbook.SheetNames;
    const clientes: any[] = XLSX.utils.sheet_to_json(excelWorkbook.Sheets[sheetName[0]]);

    if (!clientes || !clientes.length) {
      reject('Hubo un error al intentar conseguir la info del excel.');
      return;
    }

    console.log('Fetched data from excel');
    resolve(clientes);
  });
};

export const getClients = (excelRows: IRowFromExcel[]): ICliente[] => {
  const rowsFiltered = excelRows.filter((row, idx) => {
    if (!row.ID) {
      console.log(`No se encontró el cliente con ID: ${idx + 2}.`);
    }
    return row.ID;
  });
  //
  const clientes: ICliente[] = rowsFiltered.map((row, idx) => {
    const telefonoSliced = row.TELEFONO?.toString()
      .replace(/[\s\-]/g, '')
      .slice(-8);
    let [apellido, nombre] = row.NOMBRE.trim().split(',');
    nombre = titleCase(nombre).trim();
    apellido = titleCase(apellido).trim();

    const street = extractStreet(row.DOMICILIO).trim();
    const direccion = lowercaseNotNames(titleCase(street));

    return {
      uuid: uuidv4(),
      numero_identificador: row.ID.toString(),
      nombre,
      apellido,
      genero: undefined,
      telefono: telefonoSliced || 'Sin número de teléfono',
      direccion,
      empresa: EMPRESA,
    };
  });

  return clientes;
};

export const getUniqueClients = (clientes: ICliente[]) => {
  return clientes.filter(
    (c1, idx, arr) => idx === arr.findIndex(c2 => c2.telefono === c1.telefono)
  );
};

function extractStreet(direccion: string): string {
  if (direccion.includes(STREET_SEPARATOR)) {
    return direccion.split(STREET_SEPARATOR)[0];
  }

  // prettier-ignore
  const regex = new RegExp(/[a-zA-Z\s]+\d+/, 'g');
  const street = direccion.match(regex);

  if (street && street[0]) return street[0];
  return direccion;
}

export const trimRowsKeys = (excelData: any[]) => {
  return excelData.map(row => {
    const rowTrimmed = { ...row };

    Object.keys(row).forEach(key => {
      const replaced = key.trim();
      if (key !== replaced) {
        rowTrimmed[replaced] = rowTrimmed[key];
        delete rowTrimmed[key];
      }
    });

    return rowTrimmed;
  });
};
