# Sistema de Sorteio de Vagas - Instalação Local

## 🚀 **Instruções de Instalação**

### **Pré-requisitos**
- Node.js (versão 16 ou superior)
- npm ou yarn

### **1. Instalação das Dependências**
```bash
npm install
```

### **2. Executar o Projeto**
```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

## 📋 **Como Usar**

### **1. Acessar o Painel Administrativo**
- Clique no ícone de **configurações** (⚙️) no canto superior direito
- Digite a senha de acesso: **`admin@sorteio`**

### **2. Carregar Dados**
- Clique em **"Escolher arquivo"**
- Selecione o arquivo `Massa_Dados.xlsx` (incluído no projeto)
- Aguarde o carregamento dos dados

### **3. Executar Sorteio**
- Clique em **"Ver Resultados"** para voltar à tela principal
- Clique em **"Realizar Sorteio"**
- Visualize os resultados

## 📊 **Dados de Teste**

O arquivo `Massa_Dados.xlsx` contém:
- **121 apartamentos** totais
- **128 vagas** (106 duplas + 22 únicas)
- **49 apartamentos com regras** pré-definidas
- **72 apartamentos sem regras** (participam do sorteio)

## ✅ **Regras do Sorteio**

### **Apartamentos Pré-configurados:**
- Recebem **APENAS** suas vagas específicas definidas no arquivo
- **Exceção à regra geral**: Podem ter qualquer quantidade de vagas (1 única, 1 dupla, 2 únicas, etc.)
- **Não participam** do sorteio comum

### **Apartamentos sem Regras:**
- **DEVEM** receber **1 vaga dupla OU 2 vagas únicas**
- Participam do sorteio aleatório
- **Nenhum** pode ficar sem vaga

## ✅ **Validação dos Resultados**

Após executar o sorteio, verifique se:

1. **Apartamentos pré-configurados**: Recebem APENAS suas vagas específicas (qualquer quantidade)
2. **Apartamentos sem regras**: Recebem 1 vaga dupla OU 2 vagas únicas
3. **Nenhum apartamento** fica sem vaga
4. **Total de apartamentos atendidos** = Todos os apartamentos do arquivo

## 🔧 **Estrutura do Projeto**

```
SorteioVagasCondominio/
├── src/
│   ├── components/          # Componentes React
│   ├── hooks/              # Hooks customizados
│   ├── context/            # Context API
│   └── utils/              # Utilitários
├── Massa_Dados.xlsx        # Arquivo de dados para teste
├── CORRECOES_IMPLEMENTADAS.md  # Documentação das correções
└── NOVAS_REGRAS.md         # Documentação das regras
```

## 🔐 **Credenciais de Acesso**

### **Painel Administrativo**
- **Senha**: `admin@sorteio`
- **Uso**: Necessária para acessar as configurações do sistema

## 📝 **Colunas Obrigatórias no Excel**

- `Apartamentos`: Número do apartamento
- `Número da vaga`: ID da vaga
- `Localização`: Local da vaga (TÉRREO, G1, G2, etc.)
- `Tipo de Vaga`: DUPLA ou ÚNICA
- `Pré-Selecionada`: SIM ou NÃO
- `Apartamentos Elegíveis`: Apartamento específico (se pré-selecionada)

## 🆘 **Suporte**

Em caso de problemas:
1. Verifique se todas as dependências foram instaladas
2. Confirme que o arquivo Excel tem as colunas obrigatórias
3. Verifique o console do navegador para erros

---

**Versão**: 3.0 - Correção Crítica  
**Data**: Setembro 2025
