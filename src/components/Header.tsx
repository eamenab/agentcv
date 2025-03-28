
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon } from "lucide-react";
import { Link } from 'react-router-dom';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
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
          {user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.email || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.email ? getInitials(user.email) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 leading-none p-2">
                    {user.email && (
                      <p className="font-medium">{user.email}</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive" 
                    onClick={signOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              Sign in
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
