
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Suggestion {
  original: string;
  suggested: string;
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
  overall_feedback: string;
}

interface SuggestionsListProps {
  data: SuggestionsResponse | null;
}

export function SuggestionsList({ data }: SuggestionsListProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (data) {
      // Trigger animation on data change
      setVisible(false);
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data || !data.suggestions.length) {
    return null;
  }

  return (
    <div className={cn("transition-opacity duration-500", visible ? "opacity-100" : "opacity-0")}>
      {/* Overall Feedback as a sticky note */}
      <div className="sticky-note max-w-xl mx-auto mb-8 font-handwriting text-lg">
        <h3 className="text-xl mb-2 font-bold">Overall Feedback</h3>
        <p>{data.overall_feedback}</p>
      </div>

      {/* Individual suggestions */}
      <div className="space-y-6">
        {data.suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className="notebook-page hover-lift"
            style={{ 
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-serif mb-2 text-gray-800 dark:text-gray-200">Original</h4>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-200 dark:border-red-800">
                  <p>{suggestion.original}</p>
                </div>
              </div>
              
              <div className="notebook-line"></div>
              
              <div>
                <h4 className="text-lg font-serif mb-2 text-gray-800 dark:text-gray-200">Suggested Improvement</h4>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-200 dark:border-green-800">
                  <p className="pen-annotation">{suggestion.suggested}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
