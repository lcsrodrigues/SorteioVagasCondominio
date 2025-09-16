// Dados de teste para simular upload de arquivos Excel

export const testMoradores = [
  { Apartamento: 104 },
  { Apartamento: 105 },
  { Apartamento: 106 },
  { Apartamento: 205 },
  { Apartamento: 302 },
  { Apartamento: 401 },
  { Apartamento: 502 },
  { Apartamento: 603 },
  { Apartamento: 704 },
  { Apartamento: 805 }
];

export const testVagas = [
  { 'Número da Vaga': 1, 'Localização': 'TÉRREO', 'Tipo de Vaga': 'DUPLA', 'Pré-Selecionada': 'NÃO', 'Apartamentos Elegíveis': '' },
  { 'Número da Vaga': 2, 'Localização': 'TÉRREO', 'Tipo de Vaga': 'DUPLA', 'Pré-Selecionada': 'NÃO', 'Apartamentos Elegíveis': '' },
  { 'Número da Vaga': 3, 'Localização': 'TÉRREO', 'Tipo de Vaga': 'ÚNICA', 'Pré-Selecionada': 'SIM', 'Apartamentos Elegíveis': '104' },
  { 'Número da Vaga': 4, 'Localização': 'G1', 'Tipo de Vaga': 'DUPLA', 'Pré-Selecionada': 'NÃO', 'Apartamentos Elegíveis': '' },
  { 'Número da Vaga': 5, 'Localização': 'G1', 'Tipo de Vaga': 'ÚNICA', 'Pré-Selecionada': 'SIM', 'Apartamentos Elegíveis': '205' },
  { 'Número da Vaga': 6, 'Localização': 'G2', 'Tipo de Vaga': 'DUPLA', 'Pré-Selecionada': 'NÃO', 'Apartamentos Elegíveis': '' },
  { 'Número da Vaga': 7, 'Localização': 'G2', 'Tipo de Vaga': 'ÚNICA', 'Pré-Selecionada': 'NÃO', 'Apartamentos Elegíveis': '' },
  { 'Número da Vaga': 8, 'Localização': 'G3', 'Tipo de Vaga': 'DUPLA', 'Pré-Selecionada': 'NÃO', 'Apartamentos Elegíveis': '' }
];

// Função para simular upload de dados de teste
export const loadTestData = (carregarApartamentos, carregarVagas) => {
  console.log('Carregando dados de teste...');
  
  const apartamentosCarregados = carregarApartamentos(testMoradores);
  console.log(`${apartamentosCarregados.length} apartamentos carregados`);
  
  const vagasCarregadas = carregarVagas(testVagas);
  console.log(`${vagasCarregadas.length} vagas carregadas`);
  
  return {
    apartamentos: apartamentosCarregados.length,
    vagas: vagasCarregadas.length
  };
};

