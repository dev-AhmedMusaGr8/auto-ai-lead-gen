
import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AIMessage, AIConversation, AIAssistantOptions, AIContextType } from '@/types/ai';

// Create context without requiring AuthContext
const AIContext = createContext<AIContextType | null>(null);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

const getRoleSystemPrompt = (role: string): string => {
  const prompts: Record<string, string> = {
    sales: "You are an AI assistant for automotive sales representatives. Help with lead management, sales strategy, and vehicle recommendations. Provide concise, actionable advice focused on closing deals and improving customer relationships.",
    service: "You are an AI assistant for automotive service advisors. Help with service scheduling, maintenance recommendations, and technical advice. Focus on customer satisfaction and efficient service operations.",
    finance: "You are an AI assistant for automotive finance administrators. Help with financing options, contract management, and financial analysis. Provide clear, compliant advice on dealership financial matters.",
    marketing: "You are an AI assistant for automotive marketing personnel. Help with campaign planning, lead generation strategies, and marketing analytics. Focus on increasing dealership visibility and customer engagement.",
    admin: "You are an AI assistant for dealership administrators. Help with team management, business operations, and performance analytics. Provide strategic guidance for overall dealership success.",
  };
  
  return prompts[role] || prompts.admin;
};

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const { toast } = useToast();
  
  // Remove useAuth dependency at initialization
  // We'll get the user information when needed in the methods

  const startNewConversation = useCallback(async (options: AIAssistantOptions): Promise<AIConversation> => {
    // Check authentication at method call time instead of initialization
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User must be authenticated to start a conversation');
    }
    
    setIsProcessing(true);
    
    try {
      const systemPrompt = getRoleSystemPrompt(options.role);
      
      const newConversation: AIConversation = {
        id: uuidv4(),
        messages: [
          {
            id: uuidv4(),
            role: 'system',
            content: systemPrompt,
            timestamp: new Date()
          }
        ],
        title: `${options.role.charAt(0).toUpperCase() + options.role.slice(1)} Assistant`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to Supabase (we'll implement this later)
      
      setCurrentConversation(newConversation);
      setConversations(prev => [newConversation, ...prev]);
      
      return newConversation;
    } catch (error) {
      console.error('Error starting new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start new assistant conversation",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);
  
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!currentConversation) {
      throw new Error('No active conversation');
    }
    
    setIsProcessing(true);
    
    try {
      // Add user message to conversation
      const userMessage: AIMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date()
      };
      
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
        updatedAt: new Date()
      };
      
      setCurrentConversation(updatedConversation);
      
      // Call AI service via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          messages: updatedConversation.messages,
        }
      });
      
      if (error) throw error;
      
      // Add AI response to conversation
      const aiMessage: AIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.message || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };
      
      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiMessage],
        updatedAt: new Date()
      };
      
      setCurrentConversation(finalConversation);
      setConversations(prev => 
        prev.map(conv => 
          conv.id === finalConversation.id ? finalConversation : conv
        )
      );
      
      // Save to Supabase (we'll implement this later)
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response from the assistant",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [currentConversation, toast]);
  
  const loadConversation = useCallback(async (id: string): Promise<void> => {
    // This will be implemented to load conversations from Supabase
    // For now just find from local state
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversations]);
  
  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
  }, []);
  
  const value: AIContextType = {
    isProcessing,
    currentConversation,
    conversations,
    startNewConversation,
    sendMessage,
    loadConversation,
    clearCurrentConversation
  };
  
  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
