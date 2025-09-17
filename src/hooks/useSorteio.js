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
      // Assumindo que todos os apartamentos podem receber vagas duplas por padrão, 
      // ou que a elegibilidade para vagas duplas não é uma informação no Excel de moradores.
      // Se houver uma coluna no Excel de moradores para isso, precisaria ser adicionada aqui.
      podeReceberVagaDupla: true 
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
    let apartamentosDisponiveis = [...apartamentos]; // Copia para não modificar o estado original
    let vagasDisponiveis = [...vagas]; // Copia para não modificar o estado original

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
        // Remover apartamento da lista de disponíveis se já ocupou uma vaga
        apartamentosDisponiveis = apartamentosDisponiveis.filter(apt => apt.numero !== vaga.apartamentoAssociado);
      }
    });
    vagasDisponiveis = vagasDisponiveis.filter(vaga => !vaga.preConfigurada);

    // 2. Separar vagas livres por tipo
    let vagasDuplasLivres = vagasDisponiveis.filter(vaga => vaga.tipo === 'DUPLA');
    let vagasUnicasLivres = vagasDisponiveis.filter(vaga => vaga.tipo === 'ÚNICA');

    // 3. Sortear vagas duplas primeiro
    // Apartamentos que podem receber vaga dupla e ainda não têm uma
    let aptosParaVagaDupla = apartamentosDisponiveis.filter(apt => apt.podeReceberVagaDupla);
    aptosParaVagaDupla.sort(() => Math.random() - 0.5); // Embaralhar

    let aptosComVagaDupla = new Set();

    while (vagasDuplasLivres.length > 0 && aptosParaVagaDupla.length > 0) {
      const vaga = vagasDuplasLivres.shift(); // Pega a primeira vaga dupla
      const apt = aptosParaVagaDupla.shift(); // Pega o primeiro apto elegível

      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: apt.numero,
        preConfigurada: false
      });
      aptosComVagaDupla.add(apt.numero);
      // Remover apto da lista de disponíveis para vagas únicas
      apartamentosDisponiveis = apartamentosDisponiveis.filter(a => a.numero !== apt.numero);
    }

    // 4. Lidar com apartamentos que deveriam ter vaga dupla mas não há mais
    // Esses apartamentos agora serão elegíveis para duas vagas únicas
    let aptosSemVagaDuplaMasElegiveis = apartamentos.filter(apt => 
      apt.podeReceberVagaDupla && 
      !aptosComVagaDupla.has(apt.numero) &&
      !vagasPreConfiguradas.some(v => v.apartamentoAssociado === apt.numero)
    );

    // 5. Sortear vagas únicas
    // Combinar apartamentos restantes e aqueles que não pegaram vaga dupla
    let aptosParaVagaUnica = [...apartamentosDisponiveis, ...aptosSemVagaDuplaMasElegiveis];
    aptosParaVagaUnica.sort(() => Math.random() - 0.5); // Embaralhar

    let aptosJaComVagaUnica = new Set();

    while (vagasUnicasLivres.length > 0 && aptosParaVagaUnica.length > 0) {
      const vaga = vagasUnicasLivres.shift();
      const apt = aptosParaVagaUnica.shift();

      novosResultados.push({
        vagaNumero: vaga.numero,
        vagaLocalizacao: vaga.localizacao,
        vagaTipo: vaga.tipo,
        apartamentoNumero: apt.numero,
        preConfigurada: false
      });
      aptosJaComVagaUnica.add(apt.numero);
    }

    // 6. Atribuir segunda vaga única para apartamentos que não pegaram dupla
    for (const aptNumero of aptosSemVagaDuplaMasElegiveis) {
      if (vagasUnicasLivres.length >= 1 && aptosJaComVagaUnica.has(aptNumero.numero)) { // Verifica se já tem uma vaga única
        const vaga = vagasUnicasLivres.shift();
        novosResultados.push({
          vagaNumero: vaga.numero,
          vagaLocalizacao: vaga.localizacao,
          vagaTipo: vaga.tipo,
          apartamentoNumero: aptNumero.numero,
          preConfigurada: false
        });
      }
    }

    // Adicionar vagas que sobraram (não sorteadas)
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

