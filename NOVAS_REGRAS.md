# Novas Regras do Sistema de Sorteio de Vagas

## 📋 Resumo das Alterações

O sistema foi atualizado com novas regras de negócio mais rigorosas para garantir equidade e transparência no sorteio de vagas de estacionamento.

## 🎯 Regras Implementadas

### 1. **Apartamentos Pré-definidos**
- Apartamentos com vagas pré-configuradas **APENAS** recebem as vagas que foram especificamente definidas para eles
- Estes apartamentos **NÃO** participam do sorteio comum
- **Exceção à regra geral**: Podem ter qualquer quantidade de vagas (1 única, 1 dupla, 2 únicas, etc.)
- A configuração é feita através da coluna "Pré-Selecionada: SIM" no arquivo de vagas

### 2. **Garantia Universal de Vagas para Apartamentos sem Regras**
- **Apartamentos SEM regras pré-definidas** devem ter **exatamente**:
  - **1 vaga dupla** OU
  - **2 vagas simples**
- **Apartamentos COM regras pré-definidas** podem ter qualquer configuração de vagas
- **Não é permitido** que apartamentos fiquem sem vagas

### 3. **Validação de Suficiência**
- O sistema verifica automaticamente se há vagas suficientes antes de realizar o sorteio
- Se não houver vagas suficientes, o sorteio é **bloqueado** com mensagem de erro clara
- A validação considera tanto cenários otimistas (todos recebem duplas) quanto pessimistas (todos recebem 2 únicas)

### 4. **Remoção de Funcionalidades de Teste**
- O botão "Carregar Dados de Teste" foi **removido** da interface administrativa
- O sistema agora funciona exclusivamente com dados reais carregados via arquivos Excel
- Dados de teste ainda existem no código para desenvolvimento, mas não são acessíveis ao usuário final

## 🔄 Lógica de Execução Atualizada

### **Fase 1: Processamento de Vagas Pré-configuradas**
1. Identifica vagas marcadas como "Pré-Selecionada: SIM"
2. Atribui essas vagas diretamente aos apartamentos especificados
3. Remove essas vagas do pool de sorteio
4. Marca esses apartamentos como "já atendidos"

### **Fase 2: Validação de Suficiência**
1. Conta apartamentos que ainda precisam de vagas
2. Calcula cenários mínimo e máximo de vagas necessárias
3. Verifica se há vagas suficientes no pool restante
4. **Bloqueia o sorteio** se insuficiente

### **Fase 3: Distribuição Prioritária**
1. **Prioridade 1**: Apartamentos sem nenhuma vaga recebem vagas duplas
2. **Prioridade 2**: Se não há duplas suficientes, recebem 2 vagas únicas
3. **Prioridade 3**: Apartamentos com 1 vaga única recebem mais 1 vaga única

### **Fase 4: Verificação Final**
1. Confirma que todos os apartamentos têm vagas adequadas
2. Lista vagas não atribuídas (se houver)
3. Gera relatório final do sorteio

## ⚠️ Cenários de Erro

### **Erro: Vagas Insuficientes**
```
"Vagas insuficientes! Necessárias no mínimo: X, Disponíveis: Y. Apartamentos sem vagas: Z"
```

### **Erro: Apartamento Pré-configurado Inexistente**
```
"Apartamento X não encontrado para vaga pré-configurada Y"
```

### **Erro: Distribuição Incompleta**
```
"Os seguintes apartamentos ficaram sem vagas adequadas: X, Y, Z"
```

## 📊 Exemplo de Configuração Válida

### **Apartamentos (8 unidades)**
- 104, 105, 106, 205, 302, 401, 502, 603

### **Vagas (11 unidades)**
- 5 vagas duplas (podem atender 5 apartamentos)
- 6 vagas únicas (podem atender 3 apartamentos com 2 vagas cada)
- 2 vagas pré-configuradas (apartamentos 104 e 205)

### **Resultado Esperado**
- Apartamento 104: 1 vaga única (pré-configurada) + 1 vaga única (sorteada)
- Apartamento 205: 1 vaga única (pré-configurada) + 1 vaga única (sorteada)
- 6 apartamentos restantes: 1 vaga dupla cada OU 2 vagas únicas cada
- Possíveis vagas sobrando: Sim (3 vagas extras no exemplo)

## 🚀 Benefícios das Novas Regras

1. **Equidade Garantida**: Todos os apartamentos recebem vagas
2. **Transparência**: Regras claras e validações automáticas
3. **Flexibilidade**: Suporta vagas pré-configuradas e sorteio comum
4. **Robustez**: Validações impedem configurações inválidas
5. **Profissionalismo**: Interface limpa sem funcionalidades de teste

## 📝 Notas para Administradores

- **Planeje as vagas**: Certifique-se de ter vagas suficientes antes do sorteio
- **Teste a configuração**: Use a validação automática para verificar viabilidade
- **Documente pré-configurações**: Mantenha registro das vagas pré-definidas
- **Comunique as regras**: Informe aos moradores sobre o novo sistema

---

**Data de Implementação:** Setembro 2025  
**Versão:** 2.0  
**Status:** Implementado e Testado
