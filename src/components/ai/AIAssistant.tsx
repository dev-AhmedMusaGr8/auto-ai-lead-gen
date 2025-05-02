
import { useState } from 'react';
import { useAI } from '@/contexts/AIContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Maximize2, Minimize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAssistantProps {
  role?: 'sales' | 'service' | 'finance' | 'marketing' | 'admin';
  initiallyExpanded?: boolean;
}

const AIAssistant = ({ role = 'admin', initiallyExpanded = false }: AIAssistantProps) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [inputValue, setInputValue] = useState('');
  const { currentConversation, isProcessing, sendMessage, startNewConversation } = useAI();

  // Initialize conversation if needed
  const handleInitializeConversation = async () => {
    if (!currentConversation) {
      try {
        await startNewConversation({ role });
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    }
  };

  // Send message on form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    // Initialize conversation if not already started
    if (!currentConversation) {
      await handleInitializeConversation();
    }

    // Send the message
    await sendMessage(inputValue);
    setInputValue('');
  };

  // Toggle expanded/collapsed state
  const toggleExpanded = () => {
    if (!isExpanded && !currentConversation) {
      handleInitializeConversation();
    }
    setIsExpanded(prev => !prev);
  };

  // Get relevant messages (exclude system prompts)
  const visibleMessages = currentConversation?.messages.filter(
    msg => msg.role === 'user' || msg.role === 'assistant'
  ) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 right-4 z-50"
      >
        {isExpanded ? (
          <Card className="w-80 md:w-96 shadow-lg border-primary/10">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-primary/5">
              <CardTitle className="text-sm font-medium">
                {role.charAt(0).toUpperCase() + role.slice(1)} AI Assistant
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleExpanded}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleExpanded}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 h-[300px] overflow-y-auto flex flex-col gap-3">
              {visibleMessages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4 text-muted-foreground">
                  <p>How can I help you today?</p>
                </div>
              ) : (
                <>
                  {visibleMessages.map(message => (
                    <div
                      key={message.id}
                      className={`max-w-[80%] ${
                        message.role === 'user' ? 'self-end bg-primary/10' : 'self-start bg-secondary/10'
                      } rounded-lg p-3`}
                    >
                      {message.content}
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="self-start bg-secondary/10 rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            
            <CardFooter className="p-3 border-t">
              <form onSubmit={handleSubmit} className="flex w-full gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question..."
                  className="min-h-[40px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button type="submit" size="icon" disabled={isProcessing || !inputValue.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        ) : (
          <Button
            onClick={toggleExpanded}
            className="rounded-full h-12 w-12 shadow-lg"
            aria-label="Open AI Assistant"
          >
            AI
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;
