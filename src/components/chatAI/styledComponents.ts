import styled, { keyframes } from "styled-components";

// Animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const typingAnimation = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
`;

export const ChatContainer = styled.div`
  position: fixed;
  right: 32px;
  bottom: 24px;
  width: 521px;
  height: 916px;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.16);
  z-index: 9999;
  overflow: hidden;
  background-color: #ffffff;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Header = styled.div`
  padding: 20px 24px;
  background-color: #d8e9e1;
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const HeaderTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderTitle = styled.span`
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #22282c;
`;

export const CloseButton = styled.button`
  padding: 8px;
  color: #22282c;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const FilterPill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #e5efe9;
  border-radius: 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  color: #4b4b4b;
  font-weight: 400;
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const SuggestionsArea = styled.div`
  margin-bottom: 16px;
`;

export const SuggestionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px 20px;
`;

export const SuggestionsTitle = styled.span`
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #22282c;
`;

export const IABadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #ecf8ef;
  border: 1px solid #63cfbd;
  border-radius: 20px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #3e8277;
`;

export const InfoPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #e5efe9;
  border-radius: 16px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #4b4b4b;
  font-weight: 400;
  margin-left: 20px;
  margin-bottom: 16px;
`;

export const SuggestionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: #ebeceb;
  border-radius: 0;
  overflow: hidden;
`;

export const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: #ffffff;
  cursor: pointer;
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: #3e8277;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f6f9f8;
  }
`;

export const SuggestionText = styled.span`
  font-size: 14px;
  color: #3e8277;
  font-family: Inter, sans-serif;
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d5d5d5;
    border-radius: 3px;
  }
`;

export const UserMessageBubble = styled.div`
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  background-color: #cef6eb;
  color: #22282c;
  font-family: Inter, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const UserMessageText = styled.span`
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
`;

export const UserLabel = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background-color: #ecf8ef;
  border: 1px solid #63cfbd;
  border-radius: 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  color: #3e8277;
  font-weight: 500;
  flex-shrink: 0;
`;

export const AssistantMessageCard = styled.div`
  max-width: 100%;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #ebeceb;
  background-color: #fbfafc;
`;

export const AssistantCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ebeceb;
`;

export const AssistantCardTitle = styled.span`
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #22282c;
`;

export const AssistantCardInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background-color: #e5efe9;
  border-radius: 12px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  color: #4b4b4b;
`;

export const AssistantCardContent = styled.div`
  font-family: Inter, sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #22282c;

  p {
    margin: 0 0 12px 0;

    &:last-child {
      margin: 0;
    }
  }

  ul,
  ol {
    margin: 8px 0;
    padding-left: 20px;
  }

  li {
    margin: 6px 0;
  }

  strong {
    font-weight: 600;
  }
`;

export const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 16px;
  align-self: flex-start;
  max-width: 70px;
`;

export const TypingDot = styled.div<{ delay: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9e9e9e;
  animation: ${typingAnimation} 1.4s infinite ease-in-out;
  animation-delay: ${(props) => props.delay};
`;

export const FooterArea = styled.div`
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #ebeceb;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const StyledInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  border-radius: 12px;
  font-family: Inter, sans-serif;
  font-size: 14px;
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  outline: none;

  &:hover {
    border-color: #b3b3b3;
  }

  &:focus {
    border-color: #3e8277;
  }

  &:disabled {
    background-color: #f8f8f8;
  }

  &::placeholder {
    color: #9e9e9e;
  }
`;

export const SendButton = styled.button`
  min-width: 90px;
  height: 48px;
  border-radius: 12px;
  background-color: #3e8277;
  color: #ffffff;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #20423d;
  }

  &:disabled {
    background-color: #b3b3b3;
    color: #ffffff;
    cursor: not-allowed;
  }
`;

export const StopButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  color: #22282c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f5f5f5;
    border-color: #b3b3b3;
  }
`;

export const FooterDescription = styled.p`
  font-size: 13px;
  color: #808080;
  text-align: left;
  margin-top: 12px;
  font-weight: 400;
  line-height: 1.5;

  b {
    font-weight: 600;
  }
`;
