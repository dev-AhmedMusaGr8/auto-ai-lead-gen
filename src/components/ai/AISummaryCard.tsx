
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';

interface AISummaryCardProps {
  type: 'leads' | 'sales' | 'service' | 'inventory' | 'customers';
  data?: any;
  title?: string;
}

const AISummaryCard = ({ type, data, title }: AISummaryCardProps) => {
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would use the AIContext to get insights
    // For now, we'll just simulate it with predefined insights
    const insights = {
      leads: "3 high-priority leads require immediate follow-up. Your conversion rate is up 5% this week.",
      sales: "Your team is on track to exceed the monthly sales target by 12%. Focus on closing 4 pending deals.",
      service: "Service bay utilization is at 85%. Consider promoting oil changes to fill remaining slots next week.",
      inventory: "5 vehicles have been in stock over 60 days. Consider pricing adjustments on these models.",
      customers: "Return customer rate is 15% higher than industry average. 8 customers have service appointments due."
    };

    // Simulate API delay
    const timer = setTimeout(() => {
      setInsight(insights[type]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [type]);

  return (
    <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all">
      <CardHeader className="bg-primary/5 py-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          {title || 'AI Insight'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <p className="text-sm">{insight}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AISummaryCard;
