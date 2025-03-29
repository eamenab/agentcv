
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { CopyCheck, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  original: string;
  suggested: string;
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
  overall_feedback: string;
  compatibilty_index?: string;
  keywords?: string[];
}

interface SuggestionsListProps {
  data: SuggestionsResponse | null;
}

export function SuggestionsList({ data }: SuggestionsListProps) {
  const [visible, setVisible] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (data) {
      // Trigger animation on data change
      setVisible(false);
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedIndex(index);
        toast({
          title: t('copied'),
          description: "",
          duration: 1500,
        });
        setTimeout(() => setCopiedIndex(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          title: t('failed_to_copy'),
          description: t('try_again'),
          variant: "destructive",
        });
      });
  };

  const getBadgeVariant = (score) => {
    if (score > 70) return "default";
    if (score > 40) return "secondary";
    return "destructive";
  };
  
  const getCompatibilityText = (score) => {
    if (score > 70) return t('high_compatibility');
    if (score > 40) return t('medium_compatibility');
    return t('low_compatibility');
  };

  if (!data || !data.suggestions.length) {
    return null;
  }

  const compatibilityScore = parseFloat(data.compatibilty_index.replace('%', '')) || 0;
  // Ensure keywords is an array before using map
  const keywords = Array.isArray(data.keywords) ? data.keywords : [];

  return (
    <div className={cn("transition-opacity duration-500", visible ? "opacity-100" : "opacity-0")}>
      {/* Compatibility Score */}
      {data?.compatibilty_index && (
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{t('compatibility_score')}</h3>
            <Badge variant={getBadgeVariant(compatibilityScore)} className="text-md px-3 py-1">
              {compatibilityScore}%
            </Badge>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-transparent">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${compatibilityScore}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {getCompatibilityText(compatibilityScore)}
          </p>
        </div>
      )}

      {/* Overall Feedback as a sticky note */}
      <div className="sticky-note max-w-xl mx-auto mb-4 font-handwriting text-lg">
        <h3 className="text-xl mb-2 font-bold">{t('overall_feedback')}</h3>
        <p>{data.overall_feedback}</p>
      </div>

      {/* Keywords Section */}
      {keywords.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <h4 className="w-full text-center text-base font-medium mb-2">{t('key_skills')}</h4>
          {keywords.map((keyword, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="px-3 py-1 bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              {keyword}
            </Badge>
          ))}
        </div>
      )}

      {/* Individual suggestions - Git diff style */}
      <div className="space-y-8">
        {data.suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="notebook-page hover-lift overflow-hidden"
            style={{ 
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Original version */}
              <div className="flex-1 pt-4 px-4 pb-0">
                <div className="flex justify-between items-center mb-2 min-h-[40px]">
                  <h4 className="text-lg font-serif text-gray-800 dark:text-gray-200">
                    {t('original')}
                  </h4>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-200 dark:border-red-800 min-h-[100px]">
                  <p>{suggestion.original}</p>
                </div>
              </div>

              {/* Suggested version */}
              <div className="flex-1 pt-4 px-4 pb-0">
                <div className="flex justify-between items-center mb-2 min-h-[40px]">
                  <h4 className="text-lg font-serif text-gray-800 dark:text-gray-200">
                    {t('suggested_improvement')}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(suggestion.suggested, index)}
                    className="text-xs hover:bg-primary/10 hover:text-primary"
                  >
                    {copiedIndex === index ? (
                      <><CopyCheck size={14} className="mr-1" /> {t('copied')}</>
                    ) : (
                      <><Copy size={14} className="mr-1" /> {t('copy_suggestion')}</>
                    )}
                  </Button>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-200 dark:border-green-800 min-h-[100px]">
                  <p>{suggestion.suggested}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
