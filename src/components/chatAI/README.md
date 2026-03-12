# ChatAI - Assistente de Interpretação com IA

## Visão Geral

O ChatAI é um componente de chat integrado com inteligência artificial para auxiliar na interpretação de relatórios educacionais. Ele permite que usuários façam perguntas sobre os dados exibidos e recebam análises contextualizadas.

## Arquitetura

```
src/
├── components/
│   └── chatAI/
│       ├── index.tsx           # Componente principal (UI)
│       ├── useChatAi.ts        # Hook com toda a lógica do chat
│       ├── styledComponents.ts # Estilos (styled-components)
│       ├── ChatButton.tsx      # Botão para abrir o chat
│       └── README.md           # Esta documentação
└── services/
    └── chat.service.ts         # Serviço de comunicação com a API
```

## Componentes

### ChatAI (`index.tsx`)

Componente principal que renderiza a interface do chat.

#### Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `isOpen` | `boolean` | Sim | Controla a visibilidade do chat |
| `onClose` | `() => void` | Sim | Callback para fechar o chat |
| `contextData` | `any` | Sim | Dados do relatório para contexto da IA |
| `initialSuggestions` | `string[]` | Não | Sugestões iniciais de perguntas |

#### Exemplo de Uso

```tsx
import { ChatAI } from 'src/components/chatAI';

const MyComponent = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const contextData = {
    serie: { SER_NOME: '5º Ano', SER_NUMBER: 5 },
    year: { name: '2024' },
    edition: { name: '1ª Edição' },
    county: { name: 'São Paulo' },
    school: { name: 'Escola Municipal' },
    breadcrumb: [
      { name: 'São Paulo' },
      { name: 'Escola Municipal' },
      { name: '5º Ano' }
    ],
    items: [
      {
        id: 1,
        subject: 'Matemática',
        avg: 7.5,
        min: 3.0,
        max: 10.0,
        items: [
          { id: 1, name: 'Álgebra', value: 7.8 },
          { id: 2, name: 'Geometria', value: 7.2 }
        ]
      }
    ]
  };

  return (
    <>
      <button onClick={() => setIsChatOpen(true)}>Abrir Chat</button>
      <ChatAI
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        contextData={contextData}
      />
    </>
  );
};
```

### ChatButton (`ChatButton.tsx`)

Botão estilizado para abrir o chat, usado no breadcrumb dos relatórios.

```tsx
import { ChatButton } from 'src/components/chatAI/ChatButton';

<ChatButton onClick={() => setIsChatOpen(true)} />
```

### useChatAI Hook (`useChatAi.ts`)

Hook customizado que encapsula toda a lógica do chat, separando a lógica de negócio da camada de apresentação.

#### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `isOpen` | `boolean` | Estado de visibilidade do chat |
| `contextData` | `any` | Dados do relatório para contexto da IA |

#### Retorno

```typescript
interface UseChatAIReturn {
  messages: Message[];                           // Lista de mensagens do chat
  input: string;                                 // Texto atual do input
  isLoading: boolean;                            // Estado de carregamento
  showSuggestions: boolean;                      // Exibir sugestões iniciais
  messagesEndRef: React.RefObject<HTMLDivElement>; // Ref para auto-scroll
  setInput: (value: string) => void;             // Atualizar input
  sendMessage: (messageText: string) => Promise<void>; // Enviar mensagem
  handleStopGeneration: () => void;              // Cancelar geração
  handleSuggestionClick: (suggestion: string) => void; // Clicar em sugestão
  handleSubmit: (e: React.FormEvent) => void;    // Submit do formulário
  handleKeyPress: (e: React.KeyboardEvent) => void; // Tecla Enter
  getFilterName: () => string;                   // Nome do filtro atual
}
```

#### Exemplo de Uso

```tsx
import { useChatAI } from './useChatAi';

const MyChatComponent = ({ isOpen, contextData }) => {
  const {
    messages,
    input,
    isLoading,
    setInput,
    handleSubmit,
    handleKeyPress,
  } = useChatAI({ isOpen, contextData });

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button type="submit" disabled={isLoading}>
        Enviar
      </button>
    </form>
  );
};
```

#### Funcionalidades Internas

- **Limpeza de dados**: Remove valores `null` e `undefined` do contexto antes de enviar
- **Streaming**: Recebe e exibe chunks da resposta em tempo real
- **Cancelamento**: Suporte para abortar requisições em andamento via `AbortController`
- **Auto-scroll**: Rola automaticamente para a última mensagem

## Serviço de Chat (`chat.service.ts`)

### Interfaces

#### `ChatMessageDto`
```typescript
interface ChatMessageDto {
  role: 'user' | 'assistant';
  content: string;
}
```

#### `ReportSubItem`
```typescript
interface ReportSubItem {
  id: number;
  name: string;
  value: number;
  type?: string;
  countTotalStudents?: number;
  countPresentStudents?: number;
  totalGradesStudents?: number;
  // Campos específicos para Leitura
  fluente?: number;
  nao_fluente?: number;
  frases?: number;
  palavras?: number;
  silabas?: number;
  nao_leitor?: number;
  nao_avaliado?: number;
  nao_informado?: number;
}
```

#### `ReportItem`
```typescript
interface ReportItem {
  id: number;
  subject: string;
  level?: string;
  avg?: number;
  min?: number;
  max?: number;
  items?: ReportSubItem[];
}
```

#### `ReportContextDto`
```typescript
interface ReportContextDto {
  serie?: { SER_NOME: string; SER_NUMBER?: number };
  year?: { name: string };
  edition?: { name: string };
  state?: { name: string };
  county?: { name: string };
  school?: { name: string };
  schoolClass?: { name: string };
  items?: ReportItem[];
}
```

### Função `sendChatMessage`

Envia mensagens para a API e processa a resposta em streaming.

```typescript
async function sendChatMessage(
  request: ChatRequestDto,
  options: ChatStreamOptions
): Promise<void>
```

#### Parâmetros

- `request`: Objeto contendo as mensagens e o contexto do relatório
- `options`: Callbacks para processar o streaming
  - `onChunk(chunk: string)`: Chamado para cada chunk recebido
  - `onError(error: Error)`: Chamado em caso de erro
  - `onComplete()`: Chamado quando a resposta termina
  - `signal?: AbortSignal`: Para cancelar a requisição

## Fluxo de Dados

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   ChatAI        │────▶│   useChatAI      │────▶│  chat.service    │────▶│   Backend API   │
│   Component     │     │   (Hook)         │     │                  │     │   /ai/chat      │
│   (UI)          │     │   (Lógica)       │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │                        │
        │   Interação do        │   Mensagem do         │   Request POST         │
        │   usuário             │   usuário             │   com contexto         │
        │                        │                        │                        │
        │◀───────────────────────│◀───────────────────────│◀───────────────────────│
        │   Renderiza           │   Atualiza estado     │   Streaming            │
        │   mensagens           │   progressivamente    │   Response             │
        └───────────────────────────────────────────────────────────────────────────
```

## Funcionalidades

### 1. Sugestões Iniciais
Quando o chat é aberto sem mensagens, exibe sugestões clicáveis:
- Análise do Relatório
- Resumo do Relatório
- Destaques do Desempenho
- Pontos de Atenção
- Comparar Categorias

### 2. Streaming de Respostas
As respostas da IA são exibidas em tempo real conforme são geradas, proporcionando uma experiência mais fluida.

### 3. Cancelamento de Geração
O usuário pode parar a geração de uma resposta a qualquer momento clicando no botão de stop.

### 4. Contexto do Relatório
O chat envia automaticamente os dados do relatório atual como contexto, permitindo que a IA faça análises específicas.

### 5. Limpeza de Dados
Antes de enviar, os dados são limpos para remover valores `null` e `undefined`, evitando erros de validação no backend.

## Autenticação

O serviço utiliza o token JWT armazenado no cookie `__session` para autenticar as requisições. Em caso de erro 401, o usuário é automaticamente deslogado.

## Estilos

Os estilos seguem o padrão do projeto utilizando `styled-components`. As cores principais são:

| Cor | Hex | Uso |
|-----|-----|-----|
| Verde primário | `#3E8277` | Textos de destaque, badges |
| Verde claro | `#CEF6EB` | Background mensagem usuário |
| Verde header | `#D8E9E1` | Background do header |
| Cinza borda | `#EBECEB` | Bordas e separadores |
| Texto escuro | `#22282C` | Texto principal |

## Integração com Relatórios

O chat é integrado na página de "Síntese Geral" através do componente `ReportBreadcrumb`:

```tsx
// pages/sintese-geral.tsx
<ReportBreadcrumb
  action={<ChatButton onClick={() => setIsChatOpen(true)} />}
/>

<ChatAI
  isOpen={isChatOpen}
  onClose={() => setIsChatOpen(false)}
  contextData={{
    ...filterData,
    breadcrumb: breadcrumbItems,
    items: reportItems
  }}
/>
```

## API Backend

### Endpoint
```
POST /ai/chat
```

### Request Body
```json
{
  "messages": [
    { "role": "user", "content": "Analise o relatório" }
  ],
  "context": {
    "serie": { "SER_NOME": "5º Ano" },
    "year": { "name": "2024" },
    "county": { "name": "São Paulo" },
    "items": [...]
  }
}
```

### Response
Streaming de texto em chunks.

## Tratamento de Erros

1. **Erro 401**: Usuário é deslogado automaticamente
2. **Erro de rede**: Mensagem de erro é exibida no chat
3. **Cancelamento**: Requisição é abortada silenciosamente

## Dependências

- `react` >= 17.0.2
- `styled-components`
- `@mui/material` (para Typography e Box no ReactMarkdown)
- `@mui/icons-material` (ícones Close e Stop)
- `react-markdown` v8.0.7
- `nookies` (para cookies)
