
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Globe, Languages } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative transform rotate-3 bg-gradient-to-r from-primary/80 to-primary px-4 py-1 rounded-sm shadow-sm">
            <h1 className="font-handwriting text-2xl font-bold text-primary-foreground">
              AgentCV
            </h1>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <div className="border border-border/50 rounded-full p-1 flex">
            <Toggle
              pressed={language === 'es'}
              onPressedChange={() => setLanguage('es')}
              className={`px-3 rounded-full data-[state=on]:bg-primary/20 ${language === 'es' ? 'text-primary font-semibold' : ''}`}
              aria-label="Toggle Spanish language"
            >
              ES
            </Toggle>
            <Toggle
              pressed={language === 'en'}
              onPressedChange={() => setLanguage('en')}
              className={`px-3 rounded-full data-[state=on]:bg-primary/20 ${language === 'en' ? 'text-primary font-semibold' : ''}`}
              aria-label="Toggle English language"
            >
              EN
            </Toggle>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
