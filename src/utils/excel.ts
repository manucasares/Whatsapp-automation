import fs from 'fs';
import XLSX from 'xlsx';

import { EMPRESA } from '../data';
import { ICliente, IRowFromExcel } from 'types';
import { EXCEL_EXTENSION } from '../constants';
import { titleCase } from './misc';

export const getExcelFileName = () => {
  const rootFiles = fs.readdirSync('./');
  const regex = new RegExp(EXCEL_EXTENSION, 'g');
  const excelName = rootFiles.find(file => file.match(regex));
  return excelName;
};

export const getClientesFromExcel = (excelName: string): Promise<any> => {
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

export const getClientes = (excelRows: IRowFromExcel[]): ICliente[] => {
  const clientes: ICliente[] = excelRows.map(row => {
    const telefonoSliced = row.Telefono?.toString()
      .replace(/[\s\-]/g, '')
      .slice(-8);
    let [apellido, nombre] = row.Cliente.trim().split(',');
    nombre = titleCase(nombre).trim();
    apellido = titleCase(apellido).trim();

    return {
      numero_identificador: row.__EMPTY.toString(),
      nombre,
      apellido,
      genero: undefined,
      telefono: telefonoSliced || 'Sin número de teléfono',
      direccion: row.Dirección,
      empresa: EMPRESA,
    };
  });

  return clientes;
};

export const getUniqueClientes = (clientes: ICliente[]) => {
  return clientes.filter(
    (c1, idx, arr) => idx === arr.findIndex(c2 => c2.telefono === c1.telefono)
  );
};
