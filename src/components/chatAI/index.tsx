import React from "react";
import { Box, Typography } from "@mui/material";
import { Close, Stop } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { useChatAI } from "./useChatAi";
import {
  ChatContainer,
  Header,
  ChatHeader,
  HeaderTitleContainer,
  HeaderTitle,
  CloseButton,
  FilterPill,
  ContentArea,
  SuggestionsArea,
  SuggestionsHeader,
  SuggestionsTitle,
  IABadge,
  InfoPill,
  SuggestionsGrid,
  SuggestionItem,
  SuggestionText,
  MessagesContainer,
  UserMessageBubble,
  UserMessageText,
  UserLabel,
  AssistantMessageCard,
  AssistantCardHeader,
  AssistantCardInfo,
  AssistantCardContent,
  TypingIndicator,
  TypingDot,
  FooterArea,
  InputContainer,
  StyledInput,
  SendButton,
  StopButton,
  FooterDescription,
} from "./styledComponents";

interface ChatAIProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: any;
  initialSuggestions?: string[];
}

const HeaderIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16.5C12.1427 16.5 12.2617 16.452 12.357 16.356C12.4523 16.26 12.5 16.1413 12.5 16V11.5C12.5 11.358 12.452 11.2393 12.356 11.144C12.26 11.0487 12.141 11.0007 11.999 11C11.857 10.9993 11.7383 11.0473 11.643 11.144C11.5477 11.2407 11.5 11.3593 11.5 11.5V16C11.5 16.142 11.548 16.2607 11.644 16.356C11.74 16.4513 11.859 16.4993 12.001 16.5M12 9.577C12.1747 9.577 12.321 9.518 12.439 9.4C12.557 9.282 12.6157 9.136 12.615 8.962C12.6143 8.788 12.5553 8.64167 12.438 8.523C12.3207 8.40433 12.1747 8.34533 12 8.346C11.8253 8.34667 11.6793 8.40567 11.562 8.523C11.4447 8.64033 11.3857 8.78667 11.385 8.962C11.3843 9.13733 11.4433 9.28333 11.562 9.4C11.6807 9.51667 11.8267 9.57567 12 9.577ZM12.003 21C10.7583 21 9.58833 20.764 8.493 20.292C7.39767 19.8193 6.44467 19.178 5.634 18.368C4.82333 17.558 4.18167 16.606 3.709 15.512C3.23633 14.418 3 13.2483 3 12.003C3 10.7577 3.23633 9.58767 3.709 8.493C4.181 7.39767 4.82133 6.44467 5.63 5.634C6.43867 4.82333 7.391 4.18167 8.487 3.709C9.583 3.23633 10.753 3 11.997 3C13.241 3 14.411 3.23633 15.507 3.709C16.6023 4.181 17.5553 4.82167 18.366 5.631C19.1767 6.44033 19.8183 7.39267 20.291 8.488C20.7637 9.58333 21 10.753 21 11.997C21 13.241 20.764 14.411 20.292 15.507C19.82 16.603 19.1787 17.556 18.368 18.366C17.5573 19.176 16.6053 19.8177 15.512 20.291C14.4187 20.7643 13.249 21.0007 12.003 21ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
      fill="#20423D"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 11C8.09513 11 8.17447 10.968 8.238 10.904C8.30153 10.84 8.33333 10.7609 8.33333 10.6667V7.66667C8.33333 7.572 8.30133 7.49287 8.23733 7.42933C8.17333 7.3658 8.09402 7.33382 7.99933 7.33333C7.90467 7.33289 7.82533 7.36489 7.76133 7.42933C7.69733 7.49378 7.66533 7.57289 7.66533 7.66667V10.6667C7.66533 10.7613 7.69733 10.8404 7.76133 10.904C7.82533 10.9676 7.90467 10.9996 7.99933 11M8 6.38467C8.11647 6.38467 8.214 6.34533 8.29267 6.26667C8.37133 6.188 8.41044 6.09067 8.41 5.97467C8.40956 5.85867 8.37022 5.76111 8.292 5.682C8.21378 5.60289 8.11647 5.56356 8 5.564C7.88353 5.56445 7.78622 5.60378 7.708 5.682C7.62978 5.76022 7.59044 5.85778 7.59 5.97467C7.58956 6.09156 7.62889 6.18889 7.708 6.26667C7.78711 6.34445 7.88444 6.38378 8 6.38467ZM8.002 14C7.17222 14 6.39222 13.8427 5.662 13.528C4.93178 13.2129 4.29644 12.7853 3.756 12.2453C3.21556 11.7053 2.78778 11.0707 2.47267 10.3413C2.15756 9.612 2 8.83222 2 8.002C2 7.17178 2.15756 6.39178 2.47267 5.662C2.78733 4.93178 3.21422 4.29644 3.75333 3.756C4.29244 3.21556 4.92733 2.78778 5.658 2.47267C6.38867 2.15756 7.16867 2 7.998 2C8.82733 2 9.60733 2.15756 10.338 2.47267C11.0682 2.78733 11.7036 3.21445 12.244 3.754C12.7844 4.29356 13.2122 4.92844 13.5273 5.65867C13.8424 6.38889 14 7.16867 14 7.998C14 8.82733 13.8427 9.60733 13.528 10.338C13.2133 11.0687 12.7858 11.704 12.2453 12.244C11.7049 12.784 11.0702 13.2118 10.3413 13.5273C9.61244 13.8429 8.83267 14.0004 8.002 14ZM8 13.3333C9.48889 13.3333 10.75 12.8167 11.7833 11.7833C12.8167 10.75 13.3333 9.48889 13.3333 8C13.3333 6.51111 12.8167 5.25 11.7833 4.21667C10.75 3.18333 9.48889 2.66667 8 2.66667C6.51111 2.66667 5.25 3.18333 4.21667 4.21667C3.18333 5.25 2.66667 6.51111 2.66667 8C2.66667 9.48889 3.18333 10.75 4.21667 11.7833C5.25 12.8167 6.51111 13.3333 8 13.3333Z"
      fill="#3E8277"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.60991 2.7584C6.08831 1.3584 8.02271 1.316 8.58991 2.6312L8.63791 2.7592L9.28351 4.6472C9.43144 5.08018 9.67056 5.47641 9.98464 5.80914C10.2987 6.14187 10.6806 6.40337 11.1043 6.576L11.2779 6.6408L13.1659 7.2856C14.5659 7.764 14.6083 9.6984 13.2939 10.2656L13.1659 10.3136L11.2779 10.9592C10.8448 11.107 10.4484 11.3461 10.1155 11.6602C9.78264 11.9743 9.52104 12.3562 9.34831 12.78L9.28351 12.9528L8.63871 14.8416C8.16031 16.2416 6.22591 16.284 5.65951 14.9696L5.60991 14.8416L4.96511 12.9536C4.81725 12.5205 4.5782 12.1241 4.26409 11.7912C3.94999 11.4583 3.56814 11.1967 3.14431 11.024L2.97151 10.9592L1.08351 10.3144C-0.317294 9.836 -0.359694 7.9016 0.955506 7.3352L1.08351 7.2856L2.97151 6.6408C3.40449 6.49285 3.80071 6.25375 4.13344 5.93966C4.46617 5.62556 4.72767 5.24375 4.90031 4.82L4.96511 4.6472L5.60991 2.7584ZM13.5243 1.44551e-06C13.674 -1.88777e-06 13.8207 0.0419826 13.9476 0.121178C14.0746 0.200372 14.1769 0.313602 14.2427 0.448L14.2811 0.5416L14.5611 1.3624L15.3827 1.6424C15.5327 1.69336 15.6641 1.7877 15.7605 1.91346C15.8568 2.03922 15.9136 2.19074 15.9238 2.34882C15.9339 2.5069 15.8968 2.66442 15.8173 2.80143C15.7378 2.93843 15.6194 3.04875 15.4771 3.1184L15.3827 3.1568L14.5619 3.4368L14.2819 4.2584C14.2309 4.40834 14.1365 4.53976 14.0106 4.63599C13.8848 4.73223 13.7332 4.78895 13.5752 4.79898C13.4171 4.809 13.2597 4.77187 13.1227 4.6923C12.9857 4.61273 12.8755 4.4943 12.8059 4.352L12.7675 4.2584L12.4875 3.4376L11.6659 3.1576C11.5159 3.10664 11.3844 3.0123 11.2881 2.88655C11.1918 2.76079 11.135 2.60926 11.1248 2.45118C11.1147 2.2931 11.1519 2.13558 11.2314 1.99857C11.3108 1.86157 11.4292 1.75125 11.5715 1.6816L11.6659 1.6432L12.4867 1.3632L12.7667 0.5416C12.8206 0.383541 12.9227 0.246327 13.0586 0.149199C13.1944 0.0520714 13.3573 -0.000100225 13.5243 1.44551e-06Z"
      fill="#63CFBD"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="#3E8277"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChatAI: React.FC<ChatAIProps> = ({
  isOpen,
  onClose,
  contextData,
  initialSuggestions = [
    "Análise do Relatório",
    "Resumo do Relatório",
    "Destaques do Desempenho",
    "Pontos de Atenção",
    "Comparar Categorias",
  ],
}) => {
  const {
    messages,
    input,
    isLoading,
    showSuggestions,
    messagesEndRef,
    setInput,
    handleStopGeneration,
    handleSuggestionClick,
    handleSubmit,
    handleKeyPress,
    getFilterName,
  } = useChatAI({ isOpen, contextData });

  if (!isOpen) return null;

  return (
    <ChatContainer>
      <Header>
        <ChatHeader>
          <HeaderTitleContainer>
            <HeaderIcon />
            <HeaderTitle>Assistente de interpretação (IA)</HeaderTitle>
          </HeaderTitleContainer>
          <CloseButton onClick={onClose}>
            <Close />
          </CloseButton>
        </ChatHeader>
        <FilterPill title={getFilterName()}>{getFilterName()}</FilterPill>
      </Header>

      <ContentArea>
        <MessagesContainer>
          {showSuggestions && (
            <SuggestionsArea>
              <SuggestionsHeader>
                <SuggestionsTitle>Opções de assistência:</SuggestionsTitle>
                <IABadge>
                  IA
                  <StarIcon />
                </IABadge>
              </SuggestionsHeader>
              <InfoPill>
                <InfoIcon />
                Baseado apenas nos dados exibidos
              </InfoPill>
              <SuggestionsGrid>
                {initialSuggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <SuggestionText>{suggestion}</SuggestionText>
                    <ArrowIcon />
                  </SuggestionItem>
                ))}
              </SuggestionsGrid>
            </SuggestionsArea>
          )}

          {messages.map((message) =>
            message.role === "user" ? (
              <UserMessageBubble key={message.id}>
                <UserMessageText>{message.content}</UserMessageText>
                <UserLabel>Você</UserLabel>
              </UserMessageBubble>
            ) : (
              <AssistantMessageCard key={message.id}>
                <AssistantCardHeader>
                  <AssistantCardInfo>
                    <InfoIcon />
                    Baseado apenas nos dados exibidos
                  </AssistantCardInfo>
                  <IABadge>
                    IA
                    <StarIcon />
                  </IABadge>
                </AssistantCardHeader>

                <AssistantCardContent>
                  {message.content ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <Typography
                            component="p"
                            sx={{
                              margin: "0 0 12px 0",
                              fontSize: "14px",
                              lineHeight: 1.7,
                              "&:last-child": { margin: 0 },
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                        ul: ({ children }) => (
                          <Box
                            component="ul"
                            sx={{ margin: "8px 0", paddingLeft: "20px" }}
                          >
                            {children}
                          </Box>
                        ),
                        ol: ({ children }) => (
                          <Box
                            component="ol"
                            sx={{ margin: "8px 0", paddingLeft: "20px" }}
                          >
                            {children}
                          </Box>
                        ),
                        li: ({ children }) => (
                          <Typography
                            component="li"
                            sx={{
                              margin: "6px 0",
                              fontSize: "14px",
                              lineHeight: 1.7,
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                        strong: ({ children }) => (
                          <strong style={{ fontWeight: 600 }}>
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em style={{ fontStyle: "italic" }}>{children}</em>
                        ),
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#3E8277",
                              textDecoration: "underline",
                            }}
                          >
                            {children}
                          </a>
                        ),
                        h1: ({ children }) => (
                          <Typography
                            component="h1"
                            sx={{
                              margin: "16px 0 8px 0",
                              fontWeight: 600,
                              fontSize: "16px",
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                        h2: ({ children }) => (
                          <Typography
                            component="h2"
                            sx={{
                              margin: "14px 0 8px 0",
                              fontWeight: 600,
                              fontSize: "15px",
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                        h3: ({ children }) => (
                          <Typography
                            component="h3"
                            sx={{
                              margin: "12px 0 6px 0",
                              fontWeight: 600,
                              fontSize: "14px",
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <TypingIndicator>
                      <TypingDot delay="0s" />
                      <TypingDot delay="0.2s" />
                      <TypingDot delay="0.4s" />
                    </TypingIndicator>
                  )}
                </AssistantCardContent>
              </AssistantMessageCard>
            ),
          )}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <TypingIndicator>
              <TypingDot delay="0s" />
              <TypingDot delay="0.2s" />
              <TypingDot delay="0.4s" />
            </TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
      </ContentArea>

      <FooterArea>
        <form onSubmit={handleSubmit}>
          <InputContainer>
            <StyledInput
              placeholder={
                isLoading
                  ? "Estamos gerando uma resposta para você ..."
                  : "Ex: Analise o relatório para melhor entendimento"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            {isLoading ? (
              <StopButton onClick={handleStopGeneration} type="button">
                <Stop />
              </StopButton>
            ) : (
              <SendButton type="submit" disabled={!input.trim()}>
                Enviar
              </SendButton>
            )}
          </InputContainer>
        </form>
        <FooterDescription>
          A IA interpreta somente os dados exibidos nesse relatório
          <br />
          <b>Ela não toma decisões e não substitui a análise oficial.</b>
        </FooterDescription>
      </FooterArea>
    </ChatContainer>
  );
};
