
import { useState } from "react";
import { Header } from "@/components/Header";
import { CVForm } from "@/components/CVForm";
import { SuggestionsList } from "@/components/SuggestionsList";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

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
                {t('dashboard')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('submissions_remaining')} <span className="font-bold">10</span> / 10
              </p>
            </div>
            
            <CVForm onSubmitSuccess={handleSubmitSuccess} />
          </section>
          
          {suggestions && (
            <section id="suggestions" className="mb-12">
              <h2 className="text-3xl font-serif font-bold mb-6 text-center">
                {t('personalized_suggestions')}
              </h2>
              <SuggestionsList data={suggestions} />
            </section>
          )}
          
          <section className="mb-12">
            <div className="notebook-page">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {t('how_it_works')}
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>{t('step_1')}</li>
                <li>{t('step_2')}</li>
                <li>{t('step_3')}</li>
                <li>{t('step_4')}</li>
              </ul>
            </div>
          </section>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AgentCV. {t('all_rights_reserved')}</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
