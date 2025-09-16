import { useState } from 'react';
import * as XLSX from 'xlsx';

export const useExcelReader = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const readExcelFile = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      setLoading(false);
      return jsonData;
    } catch (err) {
      setError(`Erro ao ler arquivo: ${err.message}`);
      setLoading(false);
      throw err;
    }
  };

  return { readExcelFile, loading, error };
};

