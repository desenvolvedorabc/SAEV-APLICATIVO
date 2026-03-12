import { api } from "./api";
import { signOut } from "src/context/AuthContext";
import { parseCookies } from "nookies";

export interface ChatMessageDto {
  role: "user" | "assistant";
  content: string;
}

export interface ReportSubItem {
  id: number;
  name: string;
  value: number;
  type?: string;
  countTotalStudents?: number;
  countPresentStudents?: number;
  totalGradesStudents?: number;
  fluente?: number;
  nao_fluente?: number;
  frases?: number;
  palavras?: number;
  silabas?: number;
  nao_leitor?: number;
  nao_avaliado?: number;
  nao_informado?: number;
}

export interface ReportItem {
  id: number;
  subject: string;
  level?: string;
  avg?: number;
  min?: number;
  max?: number;
  items?: ReportSubItem[];
}

export interface ReportContextDto {
  serie?: { SER_NOME: string; SER_NUMBER?: number };
  year?: { name: string };
  edition?: { name: string };
  state?: { name: string };
  county?: { name: string };
  school?: { name: string };
  schoolClass?: { name: string };
  items?: ReportItem[];
}

export interface ChatRequestDto {
  messages: ChatMessageDto[];
  context?: ReportContextDto;
}

export interface ChatStreamOptions {
  onChunk: (chunk: string) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
  signal?: AbortSignal;
}

export async function sendChatMessage(
  request: ChatRequestDto,
  options: ChatStreamOptions,
): Promise<void> {
  const { onChunk, onError, onComplete, signal } = options;

  const baseUrl = api.defaults.baseURL;
  const cookies = parseCookies();
  const token = cookies["__session"];

  try {
    const response = await fetch(`${baseUrl}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
      signal,
    });

    if (!response.ok) {
      if (response.status === 401) {
        signOut();
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Erro ${response.status}: Falha ao enviar mensagem`,
      );
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      return;
    }
    onError(error instanceof Error ? error : new Error(String(error)));
  }
}
