
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                <Globe className="h-4 w-4" />
                <span className="sr-only">{language === 'en' ? 'Cambiar a español' : 'Switch to English'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('es')} className={language === 'es' ? "bg-primary/10" : ""}>
                Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? "bg-primary/10" : ""}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
