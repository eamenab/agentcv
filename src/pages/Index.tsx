
import { useState } from "react";
import { Header } from "@/components/Header";
import { CVForm } from "@/components/CVForm";
import { SuggestionsList } from "@/components/SuggestionsList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Suggestion {
  original: string;
  suggested: string;
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
  overall_feedback: string;
}

const Index = () => {
  const [suggestions, setSuggestions] = useState<SuggestionsResponse | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl py-8">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold mb-4">
              {t('app_tagline')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('app_description')}
            </p>

{/*             {!user && (
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg" 
                className="mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              >
                {t('get_started')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )} */}
          </div>
          
          <CVForm onSubmitSuccess={handleSubmitSuccess} />
          
{/*           {!user && (
            <div className="mt-8 p-6 border border-primary/20 rounded-lg bg-primary/5 text-center">
              <h3 className="text-xl font-medium mb-2">{t('want_more')}</h3>
              <p className="text-muted-foreground mb-4">
                Sign up to get <span className="font-bold">10 submissions</span> per day!
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              >
                {t('sign_up_free')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )} */}
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
            <ol className="list-decimal pl-6 space-y-3">
              <li>{t('step_1')}</li>
              <li>{t('step_2')}</li>
              <li>{t('step_3')}</li>
              <li>{t('step_4')}</li>
            </ol>
          </div>
        </section>
        
        <section className="mb-6 p-4 bg-primary/10 rounded-lg border-2 border-primary shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="rounded-full bg-primary p-3">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-serif font-bold">{t('like_this_page')}</h3>
              <p className="text-lg">
                {t('contact_me_at')} <a href="mailto:eamenabar@zazsoluciones.cl" className="text-primary hover:underline font-medium">eamenabar@zazsoluciones.cl</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AgentCV. {t('all_rights_reserved')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
