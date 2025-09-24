import { useState } from 'react';

export const useSorteio = () => {
  const [apartamentos, setApartamentos] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [sorteioRealizado, setSorteioRealizado] = useState(false);

  const carregarDadosUnificados = (dados) => {
    try {
      // Extrair apartamentos únicos da coluna 'Apartamentos'
      const apartamentosUnicos = [...new Set(dados.map(item => item.Apartamentos).filter(apt => apt != null))];
      const apartamentosProcessados = apartamentosUnicos.map((numero, index) => ({
        id: index + 1,
        numero: numero,
        vagasAtribuidas: []
      }));

      // Processar vagas
      const vagasProcessadas = dados.map((item, index) => {
        const preConfigurada = item['Pré-Selecionada'] === 'SIM';
        let apartamentoAssociado = null;
        
        if (preConfigurada && item['Apartamentos Elegíveis']) {
          apartamentoAssociado = parseFloat(item['Apartamentos Elegíveis']);
        }

        return {
          id: index + 1,
          numero: item['Número da vaga'],
          localizacao: item['Localização'],
          tipo: item['Tipo de Vaga'], // 'DUPLA' ou 'ÚNICA'
          preConfigurada,
          apartamentoAssociado
        };
      });

      console.log('Dados unificados processados:', {
        apartamentos: apartamentosProcessados.length,
        vagas: vagasProcessadas.length,
        vagasPreConfiguradas: vagasProcessadas.filter(v => v.preConfigurada).length
      });

      setApartamentos(apartamentosProcessados);
      setVagas(vagasProcessadas);
      setResultados([]); // Reset resultados
      setSorteioRealizado(false);

      return {
        apartamentos: apartamentosProcessados.length,
        vagas: vagasProcessadas.length,
        vagasPreConfiguradas: vagasProcessadas.filter(v => v.preConfigurada).length
      };
    } catch (error) {
      console.error('Erro ao carregar dados unificados:', error);
      throw new Error('Erro ao processar dados do arquivo');
    }
  };

  const carregarApartamentos = (dados) => {
    const apartamentosProcessados = dados.map((item, index) => ({
      id: index + 1,
      numero: item.Apartamento,
      vagasAtribuidas: []
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
        tipo: item['Tipo de Vaga'],
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
    const apartamentosComVagas = new Map(apartamentos.map(apt => [apt.numero, { ...apt, vagasAtribuidas: [] }]));
    let vagasDisponiveis = [...vagas];

    // 1. Processar vagas pré-configuradas APENAS para seus apartamentos específicos
    const vagasPreConfiguradas = vagasDisponiveis.filter(vaga => vaga.preConfigurada);
    const apartamentosComRegras = new Set();

    vagasPreConfiguradas.forEach(vaga => {
      if (vaga.apartamentoAssociado) {
        // Verificar se o apartamento existe
        const apt = apartamentosComVagas.get(vaga.apartamentoAssociado);
        if (!apt) {
          console.warn(`Apartamento ${vaga.apartamentoAssociado} não encontrado para vaga pré-configurada ${vaga.numero}`);
          return; // Pular esta vaga se o apartamento não existir
        }

        // Marcar apartamento como tendo regras
        apartamentosComRegras.add(vaga.apartamentoAssociado);

        novosResultados.push({
          vagaNumero: vaga.numero,
          vagaLocalizacao: vaga.localizacao,
          vagaTipo: vaga.tipo,
          apartamentoNumero: vaga.apartamentoAssociado,
          preConfigurada: true
        });
        
        // Registrar a vaga atribuída ao apartamento
        apt.vagasAtribuidas.push(vaga);
      }
    });
    
    // Remover vagas pré-configuradas das disponíveis
    vagasDisponiveis = vagasDisponiveis.filter(vaga => !vaga.preConfigurada);

    // 2. Separar vagas livres por tipo e embaralhar
    let vagasDuplasLivres = vagasDisponiveis.filter(vaga => vaga.tipo === 'DUPLA').sort(() => Math.random() - 0.5);
    let vagasUnicasLivres = vagasDisponiveis.filter(vaga => vaga.tipo === 'ÚNICA').sort(() => Math.random() - 0.5);

    // 3. CORREÇÃO PRINCIPAL: Identificar apenas apartamentos SEM regras que precisam de vagas
    const apartamentosSemRegras = Array.from(apartamentosComVagas.values()).filter(apt => 
      !apartamentosComRegras.has(apt.numero)
    );

    const apartamentosSemVagas = apartamentosSemRegras.filter(apt => {
      const numVagas = apt.vagasAtribuidas.length;
      const temVagaDupla = apt.vagasAtribuidas.some(v => v.tipo === 'DUPLA');
      const numVagasUnicas = apt.vagasAtribuidas.filter(v => v.tipo === 'ÚNICA').length;
      
      // Apartamento precisa de vaga se não tem vaga dupla nem 2 vagas únicas
      return !(temVagaDupla || numVagasUnicas >= 2);
    }).sort(() => Math.random() - 0.5);

    console.log('Análise do sorteio:', {
      totalApartamentos: apartamentos.length,
      apartamentosComRegras: apartamentosComRegras.size,
      apartamentosSemRegras: apartamentosSemRegras.length,
      apartamentosSemVagas: apartamentosSemVagas.length,
      vagasDuplasDisponiveis: vagasDuplasLivres.length,
      vagasUnicasDisponiveis: vagasUnicasLivres.length
    });

    // 4. Verificar se há vagas suficientes para apartamentos SEM regras
    const apartamentosQueNecessitamVagas = apartamentosSemVagas.length;
    
    // Cenário otimista: todos recebem vagas duplas
    const cenarioOtimista = vagasDuplasLivres.length;
    // Cenário pessimista: todos recebem 2 vagas únicas
    const cenarioPessimista = Math.floor(vagasUnicasLivres.length / 2);
    // Cenário misto: máximo possível
    const cenarioMisto = vagasDuplasLivres.length + Math.floor(vagasUnicasLivres.length / 2);
    
    if (cenarioMisto < apartamentosQueNecessitamVagas) {
      throw new Error(`Vagas insuficientes! Necessárias no mínimo: ${apartamentosQueNecessitamVagas}, Disponíveis: ${cenarioMisto}. Apartamentos sem vagas: ${apartamentosQueNecessitamVagas}`);
    }

    // 5. Distribuir vagas para apartamentos sem regras
    for (const apt of apartamentosSemVagas) {
      if (vagasDuplasLivres.length > 0) {
        // Dar uma vaga dupla
        const vaga = vagasDuplasLivres.shift();
        novosResultados.push({
          vagaNumero: vaga.numero,
          vagaLocalizacao: vaga.localizacao,
          vagaTipo: vaga.tipo,
          apartamentoNumero: apt.numero,
          preConfigurada: false
        });
        apt.vagasAtribuidas.push(vaga);
      } else if (vagasUnicasLivres.length >= 2) {
        // Dar duas vagas únicas
        for (let i = 0; i < 2; i++) {
          const vaga = vagasUnicasLivres.shift();
          novosResultados.push({
            vagaNumero: vaga.numero,
            vagaLocalizacao: vaga.localizacao,
            vagaTipo: vaga.tipo,
            apartamentoNumero: apt.numero,
            preConfigurada: false
          });
          apt.vagasAtribuidas.push(vaga);
        }
      } else {
        throw new Error(`Não há vagas suficientes para o apartamento ${apt.numero}. Vagas duplas: ${vagasDuplasLivres.length}, Vagas únicas: ${vagasUnicasLivres.length}`);
      }
    }

    // 6. Verificar se todos os apartamentos SEM regras têm vagas adequadas
    const apartamentosSemVagasFinal = apartamentosSemRegras.filter(apt => {
      const numVagas = apt.vagasAtribuidas.length;
      const temVagaDupla = apt.vagasAtribuidas.some(v => v.tipo === 'DUPLA');
      const numVagasUnicas = apt.vagasAtribuidas.filter(v => v.tipo === 'ÚNICA').length;
      
      return !(temVagaDupla || numVagasUnicas >= 2);
    });

    if (apartamentosSemVagasFinal.length > 0) {
      const apartamentosSemVagas = apartamentosSemVagasFinal.map(apt => apt.numero).join(', ');
      throw new Error(`Os seguintes apartamentos ficaram sem vagas adequadas: ${apartamentosSemVagas}`);
    }

    // 7. Adicionar vagas que sobraram (não sorteadas)
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
      'Apartamento': resultado.apartamentoNumero || 'Não sorteada'
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
    carregarDadosUnificados,
    carregarApartamentos,
    carregarVagas,
    realizarSorteio,
    resetarSorteio,
    exportarResultados,
    getEstatisticas
  };
};
