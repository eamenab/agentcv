
import { useState } from "react";
import { Header } from "@/components/Header";
import { CVForm } from "@/components/CVForm";
import { SuggestionsList } from "@/components/SuggestionsList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
              Optimize Your CV for Each Application
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized suggestions to tailor your CV for specific job descriptions 
              using our AI-powered analysis.
            </p>

            {!user && (
              <Button 
                onClick={() => navigate('/auth')} 
                size="lg" 
                className="mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          
          <CVForm onSubmitSuccess={handleSubmitSuccess} />
          
          {!user && (
            <div className="mt-8 p-6 border border-primary/20 rounded-lg bg-primary/5 text-center">
              <h3 className="text-xl font-medium mb-2">Want more suggestions?</h3>
              <p className="text-muted-foreground mb-4">
                Sign up to get <span className="font-bold">10 submissions</span> per day!
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              >
                Sign up for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
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
              How It Works
            </h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Paste your Google Docs CV URL</li>
              <li>Add the job description you're applying for</li>
              <li>Get tailored suggestions to improve your CV</li>
              <li>Apply the changes directly to your Google Doc</li>
            </ol>
          </div>
        </section>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AgentCV. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
