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
      
      // Primeiro, ler os headers para garantir que todas as colunas sejam preservadas
      const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
      
      // Depois, ler os dados usando os headers como referência
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: headers,
        defval: null // Define valor padrão para células vazias
      });
      
      // Remover a primeira linha que contém os headers duplicados
      const cleanData = jsonData.slice(1);
      
      setLoading(false);
      return cleanData;
    } catch (err) {
      setError(`Erro ao ler arquivo: ${err.message}`);
      setLoading(false);
      throw err;
    }
  };

  return { readExcelFile, loading, error };
};

