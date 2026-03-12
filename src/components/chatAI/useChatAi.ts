import { useState, useRef, useEffect, useCallback } from "react";
import {
  sendChatMessage,
  ReportContextDto,
  ReportItem,
} from "src/services/chat.service";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface UseChatAIOptions {
  isOpen: boolean;
  contextData: any;
}

export interface UseChatAIReturn {
  messages: Message[];
  input: string;
  isLoading: boolean;
  showSuggestions: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setInput: (value: string) => void;
  sendMessage: (messageText: string) => Promise<void>;
  handleStopGeneration: () => void;
  handleSuggestionClick: (suggestion: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  getFilterName: () => string;
}

const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      cleaned[key] = value.map((item) =>
        typeof item === "object" && item !== null ? cleanObject(item) : item,
      );
    } else if (typeof value === "object") {
      cleaned[key] = cleanObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned as Partial<T>;
};

const cleanReportItems = (items: any[]): ReportItem[] => {
  return items.map((item) => cleanObject(item) as ReportItem);
};

export const useChatAI = ({
  isOpen,
  contextData,
}: UseChatAIOptions): UseChatAIReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset state when chat is closed
  useEffect(() => {
    if (!isOpen) {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      // Reset all state
      setMessages([]);
      setInput("");
      setIsLoading(false);
      setShowSuggestions(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setShowSuggestions(true);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      // Remove empty assistant message if generation was stopped before receiving content
      setMessages((prev) => prev.filter((m) => !(m.role === "assistant" && !m.content)));
    }
  }, []);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      abortControllerRef.current = new AbortController();

      const assistantMessageId = (Date.now() + 1).toString();
      let assistantContent = "";

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
        },
      ]);

      const context: ReportContextDto = contextData
        ? (cleanObject({
            serie: contextData.serie
              ? {
                  SER_NOME: contextData.serie.SER_NOME,
                  SER_NUMBER: contextData.serie.SER_NUMBER,
                }
              : undefined,
            year: contextData.year
              ? { name: contextData.year.name }
              : undefined,
            edition: contextData.edition
              ? { name: contextData.edition.name }
              : undefined,
            state: contextData.state
              ? { name: contextData.state.name }
              : undefined,
            stateRegional: contextData.stateRegional
              ? { name: contextData.stateRegional.name }
              : undefined,
            county: contextData.county
              ? { name: contextData.county.name }
              : undefined,
            countyRegional: contextData.countyRegional
              ? { name: contextData.countyRegional.name }
              : undefined,
            school: contextData.school
              ? { name: contextData.school.name }
              : undefined,
            schoolClass: contextData.schoolClass
              ? { name: contextData.schoolClass.name }
              : undefined,
            items: contextData.items
              ? cleanReportItems(contextData.items)
              : undefined,
          }) as ReportContextDto)
        : undefined;

      await sendChatMessage(
        {
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context,
        },
        {
          signal: abortControllerRef.current.signal,
          onChunk: (chunk) => {
            assistantContent += chunk;
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage?.role === "assistant") {
                lastMessage.content = assistantContent;
              }
              return [...newMessages];
            });
          },
          onError: (error) => {
            console.error("Error sending message:", error);
            setMessages((prev) => {
              const newMessages = prev.filter(
                (m) => m.id !== assistantMessageId,
              );
              return [
                ...newMessages,
                {
                  id: Date.now().toString(),
                  role: "assistant",
                  content:
                    error.message ||
                    "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
                },
              ];
            });
            setIsLoading(false);
          },
          onComplete: () => {
            setIsLoading(false);
            abortControllerRef.current = null;
          },
        },
      );
    },
    [messages, contextData, isLoading],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage(suggestion);
    },
    [sendMessage],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      sendMessage(input);
    },
    [sendMessage, input],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [sendMessage, input],
  );

  const getFilterName = useCallback(() => {
    if (!contextData) return "Carregando...";

    if (contextData.breadcrumb && contextData.breadcrumb.length > 0) {
      return contextData.breadcrumb.map((item: any) => item.name).join(" - ");
    }

    return "Filtro atual";
  }, [contextData]);

  return {
    messages,
    input,
    isLoading,
    showSuggestions,
    messagesEndRef,
    setInput,
    sendMessage,
    handleStopGeneration,
    handleSuggestionClick,
    handleSubmit,
    handleKeyPress,
    getFilterName,
  };
};
