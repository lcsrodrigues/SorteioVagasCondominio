import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Car, Eye, RotateCcw, Shuffle, Users } from 'lucide-react';
import { useState } from 'react';
import { useSorteioContext } from '../context/SorteioContext';
import { useExcelReader } from '../hooks/useExcelReader';
// import { loadTestData } from '../utils/testData';

const AdminPanel = ({ onViewResults }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const { readExcelFile, loading: excelLoading, error: excelError } = useExcelReader();
  const {
    apartamentos,
    vagas,
    carregarApartamentos,
    carregarVagas,
    // realizarSorteio,
    resetarSorteio,
    // exportarResultados,
    getEstatisticas,
    sorteioRealizado
  } = useSorteioContext();

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleFileUpload = async (file, tipo) => {
    if (!file) return;

    try {
      const dados = await readExcelFile(file);

      if (tipo === 'moradores') {
        const apartamentosCarregados = carregarApartamentos(dados);
        showMessage(`${apartamentosCarregados.length} apartamentos carregados com sucesso!`, 'success');
      } else if (tipo === 'vagas') {
        const vagasCarregadas = carregarVagas(dados);
        showMessage(`${vagasCarregadas.length} vagas carregadas com sucesso!`, 'success');
      }
    } catch (error) {
      showMessage(`Erro ao processar arquivo: ${error.message}`, 'error');
    }
  };

  // const handleLoadTestData = () => {
  //   try {
  //     const resultado = loadTestData(carregarApartamentos, carregarVagas);
  //     showMessage(`Dados de teste carregados! ${resultado.apartamentos} apartamentos e ${resultado.vagas} vagas.`, 'success');
  //   } catch (error) {
  //     showMessage(`Erro ao carregar dados de teste: ${error.message}`, 'error');
  //   }
  // };

  // const handleSorteio = () => {
  //   try {
  //     const resultado = realizarSorteio();
  //     showMessage(`Sorteio realizado com sucesso! ${resultado.vagasSorteadas} vagas foram sorteadas.`, 'success');
  //   } catch (error) {
  //     showMessage(`Erro ao realizar sorteio: ${error.message}`, 'error');
  //   }
  // };

  const handleReset = () => {
    resetarSorteio();
    showMessage('Sorteio resetado com sucesso!', 'success');
  };

  // const handleExport = () => {
  //   try {
  //     const dados = exportarResultados();
  //     const worksheet = XLSX.utils.json_to_sheet(dados);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados do Sorteio');

  //     const fileName = `sorteio_vagas_${new Date().toISOString().split('T')[0]}.xlsx`;
  //     XLSX.writeFile(workbook, fileName);

  //     showMessage('Resultados exportados com sucesso!', 'success');
  //   } catch (error) {
  //     showMessage(`Erro ao exportar: ${error.message}`, 'error');
  //   }
  // };

  const estatisticas = getEstatisticas();

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Painel Administrativo</h1>
        <p className='text-gray-600'>Gerenciamento do sorteio de vagas do condomínio</p>
      </div>

      {message && (
        <Alert
          className={
            messageType === 'error'
              ? 'border-red-500 bg-red-50'
              : messageType === 'success'
              ? 'border-green-500 bg-green-50'
              : ''
          }
        >
          <AlertDescription
            className={messageType === 'error' ? 'text-red-700' : messageType === 'success' ? 'text-green-700' : ''}
          >
            {message}
          </AlertDescription>
        </Alert>
      )}

      {excelError && (
        <Alert className='border-red-500 bg-red-50'>
          <AlertDescription className='text-red-700'>{excelError}</AlertDescription>
        </Alert>
      )}

      {/* Botão para carregar dados de teste 
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-800">Dados de Teste</h3>
              <p className="text-sm text-yellow-700">Carregue dados de exemplo para testar o sistema</p>
            </div>
            <Button 
              onClick={handleLoadTestData}
              variant="outline"
              className="flex items-center gap-2 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              <TestTube className="h-4 w-4" />
              Carregar Dados de Teste
            </Button>
          </div>
        </CardContent>
      </Card>
*/}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Upload de Moradores */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              Upload de Moradores
            </CardTitle>
            <CardDescription>Carregue o arquivo Excel com a lista de apartamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='moradores-file'>Arquivo de Moradores (.xlsx)</Label>
                <Input
                  id='moradores-file'
                  type='file'
                  accept='.xlsx,.xls'
                  onChange={(e) => handleFileUpload(e.target.files[0], 'moradores')}
                  disabled={excelLoading}
                />
              </div>
              <p className='text-sm text-gray-500'>Apartamentos carregados: {apartamentos.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Upload de Vagas */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Car className='h-5 w-5' />
              Upload de Vagas
            </CardTitle>
            <CardDescription>Carregue o arquivo Excel com a lista de vagas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='vagas-file'>Arquivo de Vagas (.xlsx)</Label>
                <Input
                  id='vagas-file'
                  type='file'
                  accept='.xlsx,.xls'
                  onChange={(e) => handleFileUpload(e.target.files[0], 'vagas')}
                  disabled={excelLoading}
                />
              </div>
              <p className='text-sm text-gray-500'>Vagas carregadas: {vagas.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações do Sorteio */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shuffle className='h-5 w-5' />
            Controle do Sorteio
          </CardTitle>
          <CardDescription>Gerencie o sorteio das vagas e visualize os resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <Button
              onClick={handleReset}
              disabled={excelLoading || !sorteioRealizado}
              variant='outline'
              className='flex items-center gap-2'
            >
              <RotateCcw className='h-4 w-4' />
              Resetar Sorteio
            </Button>

            <Button onClick={onViewResults} variant='secondary' className='flex items-center gap-2'>
              <Eye className='h-4 w-4' />
              Ver Resultados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Dados */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>{estatisticas.totalApartamentos}</div>
              <p className='text-sm text-gray-600'>Apartamentos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>{estatisticas.totalVagas}</div>
              <p className='text-sm text-gray-600'>Vagas Totais</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>{estatisticas.vagasPreConfiguradas}</div>
              <p className='text-sm text-gray-600'>Vagas Pré-configuradas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-600'>{estatisticas.vagasSorteadas}</div>
              <p className='text-sm text-gray-600'>Vagas Sorteadas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
