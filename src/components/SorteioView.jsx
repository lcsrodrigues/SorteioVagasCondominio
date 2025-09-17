import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Car, Building, MapPin, Settings, Clock, Shuffle, Download } from 'lucide-react';
import { useSorteioContext } from '../context/SorteioContext';
import * as XLSX from 'xlsx';

const SorteioView = ({ onShowAdmin }) => {
  const { 
    resultados, 
    getEstatisticas, 
    sorteioRealizado, 
    realizarSorteio, 
    exportarResultados, 
    apartamentos, 
    vagas 
  } = useSorteioContext();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const estatisticas = getEstatisticas();
  const vagasSorteadas = resultados.filter(r => r.apartamentoNumero !== null);
  const vagasDisponiveis = resultados.filter(r => r.apartamentoNumero === null);

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSorteio = () => {
    try {
      realizarSorteio();
      // No need for message here, as the view will update automatically
    } catch (error) {
      console.error(`Erro ao realizar sorteio: ${error.message}`);
      alert(`Erro ao realizar sorteio: ${error.message}`);
    }
  };

  const handleExport = () => {
    try {
      const dados = exportarResultados();
      const worksheet = XLSX.utils.json_to_sheet(dados);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados do Sorteio');
      
      const fileName = `sorteio_vagas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      // No need for message here
    } catch (error) {
      console.error(`Erro ao exportar: ${error.message}`);
      alert(`Erro ao exportar: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center relative">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sorteio de Vagas
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Condomínio Residencial
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(currentTime)}
          </div>
          <span>•</span>
          <span>{formatDate(currentTime)}</span>
        </div>
        
        {/* Botão Admin (discreto) */}
        <Button
          onClick={onShowAdmin}
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 opacity-30 hover:opacity-100 transition-opacity"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button 
          onClick={handleSorteio} 
          disabled={apartamentos.length === 0 || vagas.length === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Shuffle className="h-4 w-4" />
          Realizar Sorteio
        </Button>
        <Button 
          onClick={handleExport} 
          disabled={!sorteioRealizado}
          variant="outline"
          className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Download className="h-4 w-4" />
          Exportar Resultados
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{estatisticas.totalVagas}</div>
              <p className="text-blue-700 font-medium">Vagas Totais</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{estatisticas.vagasSorteadas}</div>
              <p className="text-green-700 font-medium">Vagas Sorteadas</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{estatisticas.vagasDisponiveis}</div>
              <p className="text-orange-700 font-medium">Vagas Disponíveis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!sorteioRealizado ? (
        /* Estado sem sorteio */
        <Card className="border-gray-200">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum sorteio realizado
              </h3>
              <p className="text-gray-500">
                Carregue os arquivos de moradores e vagas na área administrativa (clique no ícone de engrenagem no canto superior direito) e clique em "Realizar Sorteio".
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Resultados do Sorteio */}
          {vagasSorteadas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Resultados do Sorteio
                </CardTitle>
                <CardDescription>
                  Vagas sorteadas e seus respectivos apartamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {vagasSorteadas.map((resultado) => (
                    <Card key={resultado.vagaNumero} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">
                              Vaga {resultado.vagaNumero}
                            </h4>

                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {resultado.vagaLocalizacao}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Car className="h-4 w-4" />
                            {resultado.vagaTipo}
                          </div>
                          
                          <div className="flex items-center gap-2 text-lg font-bold text-blue-600 mt-3">
                            <Building className="h-5 w-5" />
                            Apartamento {resultado.apartamentoNumero}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vagas Disponíveis */}
          {vagasDisponiveis.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vagas Disponíveis
                </CardTitle>
                <CardDescription>
                  Vagas que ainda não foram sorteadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {vagasDisponiveis.map((vaga) => (
                    <div
                      key={vaga.vagaNumero}
                      className="p-3 border rounded-lg text-center bg-gray-50"
                    >
                      <div className="font-semibold">Vaga {vaga.vagaNumero}</div>
                      <div className="text-xs text-gray-600">{vaga.vagaLocalizacao}</div>
                      <div className="text-xs text-gray-600">{vaga.vagaTipo}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default SorteioView;

