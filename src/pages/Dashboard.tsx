
import { useState } from "react";
import { Header } from "@/components/Header";
import { CVForm } from "@/components/CVForm";
import { SuggestionsList } from "@/components/SuggestionsList";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface Suggestion {
  original: string;
  suggested: string;
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
  overall_feedback: string;
}

const Dashboard = () => {
  const [suggestions, setSuggestions] = useState<SuggestionsResponse | null>(null);

  const handleSubmitSuccess = (data: SuggestionsResponse) => {
    setSuggestions(data);
    // Scroll to suggestions
    setTimeout(() => {
      window.scrollTo({
        top: 400,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container max-w-4xl py-8">
          <section className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold mb-4">
                Welcome to Your Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                You have access to 10 CV submissions per day. Make them count!
              </p>
            </div>
            
            <CVForm onSubmitSuccess={handleSubmitSuccess} />
          </section>
          
          {suggestions && (
            <section id="suggestions" className="mb-12">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">
                Your Personalized Suggestions
              </h2>
              <SuggestionsList data={suggestions} />
            </section>
          )}
          
          <section className="mb-12">
            <div className="notebook-page">
              <h2 className="text-2xl font-serif font-bold mb-4">
                Tips for Better Results
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>Make sure your Google Doc is accessible (set to "Anyone with the link can view")</li>
                <li>Include the full job description for more accurate suggestions</li>
                <li>Try different versions of your CV for different job types</li>
                <li>Implement suggestions and resubmit for further improvements</li>
              </ul>
            </div>
          </section>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AgentCV. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
