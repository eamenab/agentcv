
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'sign_in': 'Sign in',
    'dashboard': 'Dashboard',
    'sign_out': 'Sign out',
    
    // Main page
    'app_tagline': 'Optimize Your CV for Each Application',
    'app_description': 'Get personalized suggestions to tailor your CV for specific job descriptions using our AI-powered analysis.',
    'get_started': 'Get Started',
    'want_more': 'Want more suggestions?',
    'sign_up_free': 'Sign up for free',
    'submissions_remaining': 'Submissions remaining today:',
    'limit_reached': 'Daily limit reached. Try again tomorrow.',
    
    // Form
    'cv_file_label': 'Upload Your CV (PDF)',
    'cv_url_label': 'Or enter Google Docs CV URL',
    'cv_file_help': 'Upload a PDF version of your CV',
    'cv_url_help': 'Paste the link to your CV Google Doc (make sure it\'s accessible)',
    'job_description_label': 'Job Description',
    'job_description_placeholder': 'Paste the job description here...',
    'job_description_help': 'The job description will help tailor the suggestions to the specific role',
    'analyzing': 'Analyzing...',
    'get_suggestions': 'Get CV Suggestions',
    'use_google_docs': 'Use Google Docs URL instead',
    'use_pdf_upload': 'Upload PDF instead',
    
    // Suggestions
    'overall_feedback': 'Overall Feedback',
    'original': 'Original',
    'suggested_improvement': 'Suggested Improvement',
    'personalized_suggestions': 'Your Personalized Suggestions',
    'copy_suggestion': 'Copy suggestion',
    'copied': 'Copied!',
    
    // How it works
    'how_it_works': 'How It Works',
    'step_1': 'Upload your CV or paste Google Docs URL',
    'step_2': 'Add the job description you\'re applying for',
    'step_3': 'Get tailored suggestions to improve your CV',
    'step_4': 'Apply the changes directly to your document',
    
    // Footer
    'all_rights_reserved': 'All rights reserved.'
  },
  es: {
    // Header
    'sign_in': 'Iniciar sesión',
    'dashboard': 'Panel',
    'sign_out': 'Cerrar sesión',
    
    // Main page
    'app_tagline': 'Optimiza tu CV para cada aplicación',
    'app_description': 'Obtén sugerencias personalizadas para adaptar tu CV a descripciones de trabajo específicas utilizando nuestro análisis impulsado por IA.',
    'get_started': 'Comenzar',
    'want_more': '¿Quieres más sugerencias?',
    'sign_up_free': 'Regístrate gratis',
    'submissions_remaining': 'Envíos restantes hoy:',
    'limit_reached': 'Límite diario alcanzado. Inténtalo de nuevo mañana.',
    
    // Form
    'cv_file_label': 'Sube tu CV (PDF)',
    'cv_url_label': 'O ingresa la URL de Google Docs de tu CV',
    'cv_file_help': 'Sube una versión PDF de tu CV',
    'cv_url_help': 'Pega el enlace a tu CV de Google Docs (asegúrate de que sea accesible)',
    'job_description_label': 'Descripción del trabajo',
    'job_description_placeholder': 'Pega la descripción del trabajo aquí...',
    'job_description_help': 'La descripción del trabajo ayudará a adaptar las sugerencias al rol específico',
    'analyzing': 'Analizando...',
    'get_suggestions': 'Obtener sugerencias para CV',
    'use_google_docs': 'Usar URL de Google Docs en su lugar',
    'use_pdf_upload': 'Subir PDF en su lugar',
    
    // Suggestions
    'overall_feedback': 'Retroalimentación general',
    'original': 'Original',
    'suggested_improvement': 'Mejora sugerida',
    'personalized_suggestions': 'Tus sugerencias personalizadas',
    'copy_suggestion': 'Copiar sugerencia',
    'copied': '¡Copiado!',
    
    // How it works
    'how_it_works': 'Cómo funciona',
    'step_1': 'Sube tu CV o pega la URL de Google Docs',
    'step_2': 'Agrega la descripción del trabajo al que estás aplicando',
    'step_3': 'Obtén sugerencias personalizadas para mejorar tu CV',
    'step_4': 'Aplica los cambios directamente a tu documento',
    
    // Footer
    'all_rights_reserved': 'Todos los derechos reservados.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es'); // Default to Spanish

  useEffect(() => {
    // Load language preference from localStorage on initial render
    const savedLanguage = localStorage.getItem('agentcv_language');
    if (savedLanguage === 'en' || savedLanguage === 'es') {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agentcv_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
