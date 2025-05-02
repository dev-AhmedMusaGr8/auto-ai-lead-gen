
export interface AIMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAssistantOptions {
  role: 'sales' | 'service' | 'finance' | 'marketing' | 'admin';
  dealershipContext?: boolean;
  customerContext?: boolean;
  inventoryContext?: boolean;
}

export interface AIContextType {
  isProcessing: boolean;
  currentConversation: AIConversation | null;
  conversations: AIConversation[];
  startNewConversation: (options: AIAssistantOptions) => Promise<AIConversation>;
  sendMessage: (content: string) => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  clearCurrentConversation: () => void;
}
