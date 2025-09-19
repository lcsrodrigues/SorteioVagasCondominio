# Manual do Usuário - Sistema de Sorteio de Vagas (Frontend)

## 📋 Visão Geral

O Sistema de Sorteio de Vagas é uma aplicação web desenvolvida em React que permite realizar sorteios de vagas de estacionamento para condomínios de forma transparente e justa. O sistema funciona inteiramente no navegador, sem necessidade de servidor backend.

## 🎯 Funcionalidades Principais

### 1. **Área Pública (Visualização e Controle do Sorteio)**
- Exibição em tempo real dos resultados do sorteio
- Botões "Realizar Sorteio" e "Exportar Resultados" visíveis
- Estatísticas claras (vagas totais, sorteadas, disponíveis)
- Interface limpa e profissional para apresentação pública
- Relógio em tempo real com data e hora

### 2. **Área Administrativa (Oculta)**
- Upload de arquivos Excel para moradores e vagas
- Configuração de vagas pré-associadas
- Controle do sorteio (realizar, resetar, visualizar)
- Exportação dos resultados em Excel
- Dados de teste para demonstração

## 🚀 Como Usar

### **Acesso à Área Administrativa**

1. **Localizar o Botão de Configurações**
   - Na tela principal, procure pelo ícone ⚙️ no canto superior direito
   - O botão é discreto (semi-transparente) para não chamar atenção durante o sorteio público

2. **Carregar Dados de Teste (Opcional)**
   - Clique em "Carregar Dados de Teste" para usar dados de exemplo
   - Isso carregará 10 apartamentos e 8 vagas automaticamente
   - Útil para demonstrações e testes

### **Upload de Arquivos Excel**

#### **Arquivo de Moradores**
- **Formato esperado:** Excel (.xlsx)
- **Colunas necessárias:**
  - `Apartamento`: Número do apartamento (ex: 104, 205, 302)

#### **Arquivo de Vagas**
- **Formato esperado:** Excel (.xlsx)
- **Colunas necessárias:**
  - `Número da Vaga`: Número identificador da vaga
  - `Localização`: Local da vaga (ex: TÉRREO, G1, G2)
  - `Tipo de Vaga`: Tipo da vaga (ex: DUPLA, ÚNICA)
  - `Pré-Selecionada`: SIM ou NÃO
  - `Apartamentos Elegíveis`: Número do apartamento (se pré-selecionada)

### **Realizando o Sorteio**

1. **Carregar os Dados**
   - Acesse a área administrativa (clique no ícone ⚙️ no canto superior direito).
   - Faça upload dos arquivos de moradores e vagas.
   - Ou use os dados de teste para demonstração.

2. **Voltar à Tela Pública**
   - Clique em "Ver Resultados" na área administrativa para retornar à tela principal.

3. **Executar o Sorteio**
   - Na tela pública, clique em "Realizar Sorteio".
   - O sistema irá:
     - Manter as vagas pré-configuradas com seus apartamentos.
     - Sortear aleatoriamente as vagas livres entre os apartamentos disponíveis.
     - Evitar que um apartamento tenha múltiplas vagas.

4. **Visualizar Resultados**
   - Os resultados serão exibidos em tempo real na tela pública.

### **Funcionalidades Adicionais**

#### **Resetar Sorteio**
- Acesse a área administrativa (ícone ⚙️).
- Clique em "Resetar Sorteio".
- Remove todos os resultados do sorteio atual, mas mantém os dados carregados (apartamentos e vagas).
- Permite realizar um novo sorteio.

#### **Exportar Resultados**
- Na tela pública, clique em "Exportar Resultados".
- Gera um arquivo Excel com todos os resultados do sorteio (sem a coluna "Pré-configurada").
- O nome do arquivo incluirá a data atual.

## 📊 Lógica do Sorteio

### **Regras Implementadas**

1- **Vagas Pré-configuradas**
   - Vagas marcadas como "Pré-Selecionada: SIM" ficam com o apartamento especificado
   - Essas associações não podem ser alteradas pelo sorteio
   - **Importante:** A informação de que uma vaga é pré-configurada não é exibida na interface pública do sorteio, garantindo o sigilo da configuração.

2. **Atribuição de Vagas**
   - Com exceção dos apartamentos com vagas pré-configuradas, os apartamentos que participam do sorteio comum podem receber no máximo 1 vaga dupla OU no máximo 2 vagas simples.
   - O sorteio prioriza a atribuição de vagas duplas primeiro.
   - Se um apartamento tiver direito a uma vaga dupla e não houver mais vagas duplas disponíveis, ele será atribuído a duas vagas únicas, se houver.
   - Não há problema em sobrar vagas (vagas não atribuídas).

## 🎨 Interface do Usuário

### **Tela Pública (Sorteio)**
- **Header:** Título, data e hora atual
- **Estatísticas:** Cards coloridos com números principais
- **Resultados:** Grid com vagas sorteadas e seus apartamentos
- **Vagas Disponíveis:** Lista de vagas ainda não sorteadas

### **Tela Administrativa**
- **Upload:** Seções para carregar arquivos Excel
- **Controles:** Botões para gerenciar o sorteio
- **Estatísticas:** Resumo dos dados carregados
- **Dados de Teste:** Opção para carregar dados de exemplo

## 🔧 Características Técnicas

- **Frontend:** React com Vite
- **UI:** Tailwind CSS + shadcn/ui
- **Ícones:** Lucide React
- **Excel:** Biblioteca XLSX para leitura e escrita
- **Deploy:** Compatível com Vercel, Netlify e outros
- **Responsivo:** Funciona em desktop e mobile

## 📱 Compatibilidade

- **Navegadores:** Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos:** Desktop, tablet e smartphone
- **Sistemas:** Windows, macOS, Linux, iOS, Android

## 🎯 Casos de Uso

### **Durante o Sorteio Público**
1. Projetar a tela principal em um telão
2. Manter a área administrativa oculta
3. Realizar o sorteio na área administrativa
4. Os resultados aparecerão automaticamente na tela pública

### **Para Administradores**
1. Preparar os arquivos Excel com antecedência
2. Testar o sistema com dados de exemplo
3. Configurar vagas pré-associadas conforme regras do condomínio
4. Exportar resultados para arquivo e distribuição

## 🔒 Segurança e Privacidade

- **Dados Locais:** Todos os dados ficam no navegador
- **Sem Servidor:** Não há transmissão de dados para servidores externos
- **Temporário:** Dados são perdidos ao fechar o navegador (por design)
- **Transparente:** Código aberto e auditável

## 📞 Suporte

Para dúvidas técnicas ou melhorias, o código-fonte está disponível e pode ser customizado conforme necessário. O sistema foi projetado para ser simples e intuitivo, minimizando a necessidade de treinamento.

---

**Versão:** 1.0  
**Data:** Setembro 2025  
**Desenvolvido com:** React + Vite + Tailwind CSS




## 🛠️ Versões das Tecnologias

- **Node.js:** 22.13.0
- **React:** 18.3.1
- **Vite:** 6.3.5
- **Tailwind CSS:** 3.4.10
- **shadcn/ui:** 0.8.0
- **xlsx:** 0.18.5
- **lucide-react:** 0.417.0

