import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Eye, RotateCcw, Shuffle, Users, Upload } from 'lucide-react';
import { useState } from 'react';
import { useSorteioContext } from '../context/SorteioContext';
import { useExcelReader } from '../hooks/useExcelReader';

const AdminPanel = ({ onViewResults }) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { 
    apartamentos, 
    vagas, 
    resultados,
    resetarSorteio,
    carregarDadosUnificados,
    getEstatisticas
  } = useSorteioContext();
  
  const { readExcelFile, error: excelError } = useExcelReader();

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const dados = await readExcelFile(file);
      
      if (!dados || dados.length === 0) {
        throw new Error('Arquivo vazio ou formato inválido');
      }

      // Verificar se tem as colunas necessárias
      const colunasNecessarias = ['Apartamentos', 'Número da vaga', 'Localização', 'Tipo de Vaga', 'Pré-Selecionada', 'Apartamentos Elegíveis'];
      const colunas = Object.keys(dados[0]);
      const colunasFaltando = colunasNecessarias.filter(col => !colunas.includes(col));
      
      if (colunasFaltando.length > 0) {
        throw new Error(`Colunas obrigatórias não encontradas: ${colunasFaltando.join(', ')}`);
      }

      const resultado = carregarDadosUnificados(dados);
      showMessage(
        `Dados carregados com sucesso! ${resultado.apartamentos} apartamentos, ${resultado.vagas} vagas, ${resultado.vagasPreConfiguradas} vagas pré-configuradas.`, 
        'success'
      );
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      showMessage(`Erro ao processar arquivo: ${error.message}`, 'error');
    }
  };

  const handleResetSorteio = () => {
    resetarSorteio();
    showMessage('Sorteio resetado com sucesso!', 'success');
  };

  // Obter estatísticas
  const stats = getEstatisticas();
  const vagasPreConfiguradas = resultados.filter(r => r.preConfigurada).length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Painel Administrativo</h1>
          <p className='text-gray-600'>Gerenciamento do sorteio de vagas do condomínio</p>
        </div>

        {message && (
          <Alert className={`mb-6 ${messageType === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={messageType === 'success' ? 'text-green-700' : 'text-red-700'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {excelError && (
          <Alert className='mb-6 border-red-200 bg-red-50'>
            <AlertDescription className='text-red-700'>{excelError}</AlertDescription>
          </Alert>
        )}

        {/* Upload de Dados Unificados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dados-unificados">Arquivo de Dados Unificados (.xlsx)</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Carregue o arquivo Excel com apartamentos, vagas e regras pré-definidas
                </p>
                <Input
                  id="dados-unificados"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Controle do Sorteio */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              Controle do Sorteio
            </CardTitle>
            <p className="text-sm text-gray-600">Gerencie o sorteio das vagas e visualize os resultados</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={handleResetSorteio}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Resetar Sorteio
              </Button>
              <Button 
                onClick={onViewResults}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver Resultados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>{apartamentos.length}</div>
                <div className='text-sm text-gray-600'>Apartamentos</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>{vagas.length}</div>
                <div className='text-sm text-gray-600'>Vagas Totais</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-600'>{vagasPreConfiguradas}</div>
                <div className='text-sm text-gray-600'>Vagas Pré-configuradas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>{stats.vagasSorteadas}</div>
                <div className='text-sm text-gray-600'>Vagas Sorteadas</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
