import { useState } from 'react';

export const useSorteio = () => {
  const [apartamentos, setApartamentos] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [sorteioRealizado, setSorteioRealizado] = useState(false);

  const carregarApartamentos = (dados) => {
    const apartamentosProcessados = dados.map((item, index) => ({
      id: index + 1,
      numero: item.Apartamento,
      // Adicionando uma propriedade para rastrear o tipo de vaga que o apartamento pode receber
      // Assumimos que todos podem receber dupla, a menos que especificado o contrário no futuro
      podeReceberVagaDupla: true, 
      vagasAtribuidas: [] // Para rastrear as vagas atribuídas a cada apartamento
    }));
    setApartamentos(apartamentosProcessados);
    return apartamentosProcessados;
  };

  const carregarVagas = (dados) => {
    const vagasProcessadas = dados.map((item, index) => {
      const preConfigurada = item['Pré-Selecionada'] === 'SIM';
      let apartamentoAssociado = null;
      
      if (preConfigurada && item['Apartamentos Elegíveis']) {
        apartamentoAssociado = parseInt(item['Apartamentos Elegíveis']);
      }

      return {
        id: index + 1,
        numero: item['Número da Vaga'],
        localizacao: item['Localização'],
        tipo: item['Tipo de Vaga'], // 'DUPLA' ou 'ÚNICA'
        preConfigurada,
        apartamentoAssociado
      };
    });
    setVagas(vagasProcessadas);
    return vagasProcessadas;
  };

  const realizarSorteio = () => {
    if (apartamentos.length === 0 || vagas.length === 0) {
      throw new Error('É necessário carregar apartamentos e vagas antes do sorteio');
    }

    let novosResultados = [];
    // Usar um mapa para controlar as vagas atribuídas a cada apartamento
    const apartamentosComVagas = new Map(apartamentos.map(apt => [apt.numero, { ...apt, vagasAtribuidas: [] }]));
    let vagasDisponiveis = [...vagas];

    // 1. Processar vagas pré-configuradas
    const vagasPreConfiguradas = vagasDisponiveis.filter(vaga => vaga.preConfigurada);
    vagasPreConfiguradas.forEach(vaga => {
      if (vaga.apartamentoAssociado) {
        novosResultados.push({
          vagaNumero: vaga.numero,
          vagaLocalizacao: vaga.localizacao,
          vagaTipo: vaga.tipo,
          apartamentoNumero: vaga.apartamentoAssociado,
          preConfigurada: true
        });
        // Registrar a vaga atribuída ao apartamento
        const apt = apartamentosComVagas.get(vaga.apartamentoAssociado);
        if (apt) {
          apt.vagasAtribuidas.push(vaga);
        }
      }
    });
    vagasDisponiveis = vagasDisponiveis.filter(vaga => !vaga.preConfigurada);

    // 2. Separar vagas livres por tipo
    let vagasDuplasLivres = vagasDisponiveis.filter(vaga => vaga.tipo === 'DUPLA').sort(() => Math.random() - 0.5);
    let vagasUnicasLivres = vagasDisponiveis.filter(vaga => vaga.tipo === 'ÚNICA').sort(() => Math.random() - 0.5);

    // 3. Sortear vagas duplas primeiro para apartamentos elegíveis
    // Filtrar apartamentos que ainda não têm vagas e podem receber dupla
    let aptosElegiveisParaDupla = Array.from(apartamentosComVagas.values()).filter(apt => 
      apt.vagasAtribuidas.length === 0 && apt.podeReceberVagaDupla
    ).sort(() => Math.random() - 0.5);

    while (vagasDuplasLivres.length > 0 && aptosElegiveisParaDupla.length > 0) {
      const vaga = vagasDuplasLivres.shift();
      const apt = aptosElegiveisParaDupla.shift();

      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: apt.numero,
        preConfigurada: false
      });
      apt.vagasAtribuidas.push(vaga);
    }

    // 4. Sortear vagas únicas para apartamentos restantes
    // Apartamentos que ainda não têm vagas ou que receberam uma vaga dupla e não podem receber mais
    // Ou apartamentos que podem receber até duas vagas únicas
    let aptosParaVagasUnicas = Array.from(apartamentosComVagas.values()).filter(apt => {
      const numVagas = apt.vagasAtribuidas.length;
      const temVagaDupla = apt.vagasAtribuidas.some(v => v.tipo === 'DUPLA');
      const temVagaUnica = apt.vagasAtribuidas.some(v => v.tipo === 'ÚNICA');

      // Se já tem uma vaga dupla, não pode receber mais
      if (temVagaDupla) return false;
      // Se tem 0 ou 1 vaga única, pode receber mais
      if (numVagas < 2 && !temVagaDupla) return true;
      return false;
    }).sort(() => Math.random() - 0.5);

    while (vagasUnicasLivres.length > 0 && aptosParaVagasUnicas.length > 0) {
      const vaga = vagasUnicasLivres.shift();
      const apt = aptosParaVagasUnicas.shift();

      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: apt.numero,
        preConfigurada: false
      });
      apt.vagasAtribuidas.push(vaga);

      // Se o apartamento já tem 2 vagas únicas, remove da lista de elegíveis
      if (apt.vagasAtribuidas.filter(v => v.tipo === 'ÚNICA').length >= 2) {
        aptosParaVagasUnicas = aptosParaVagasUnicas.filter(a => a.numero !== apt.numero);
      }
    }

    // 5. Adicionar vagas que sobraram (não sorteadas)
    vagasDuplasLivres.forEach(vaga => {
      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: null,
        preConfigurada: false
      });
    });
    vagasUnicasLivres.forEach(vaga => {
      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: null,
        preConfigurada: false
      });
    });

    // Ordenar por número da vaga
    novosResultados.sort((a, b) => a.vagaNumero - b.vagaNumero);

    setResultados(novosResultados);
    setSorteioRealizado(true);

    return {
      totalVagas: vagas.length,
      vagasSorteadas: novosResultados.filter(r => r.apartamentoNumero !== null).length,
      vagasDisponiveis: novosResultados.filter(r => r.apartamentoNumero === null).length
    };
  };

  const resetarSorteio = () => {
    setResultados([]);
    setSorteioRealizado(false);
  };

  const exportarResultados = () => {
    if (resultados.length === 0) {
      throw new Error('Nenhum resultado para exportar');
    }

    const dadosExport = resultados.map(resultado => ({
      'Número da Vaga': resultado.vagaNumero,
      'Localização': resultado.vagaLocalizacao,
      'Tipo': resultado.vagaTipo,
      'Apartamento': resultado.apartamentoNumero || 'Não sorteada',
    }));

    return dadosExport;
  };

  const getEstatisticas = () => {
    const totalVagas = vagas.length;
    const vagasSorteadas = resultados.filter(r => r.apartamentoNumero !== null).length;
    const vagasDisponiveis = resultados.filter(r => r.apartamentoNumero === null).length;
    const vagasPreConfiguradas = resultados.filter(r => r.preConfigurada).length;

    return {
      totalVagas,
      vagasSorteadas,
      vagasDisponiveis,
      vagasPreConfiguradas,
      totalApartamentos: apartamentos.length
    };
  };

  return {
    apartamentos,
    vagas,
    resultados,
    sorteioRealizado,
    carregarApartamentos,
    carregarVagas,
    realizarSorteio,
    resetarSorteio,
    exportarResultados,
    getEstatisticas
  };
};

