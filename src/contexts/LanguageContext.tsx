
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
    'app_tagline': 'Optimize Your CV for Each Job Description',
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
    'url_required': 'Google Docs URL required',
    'file_required': 'CV file required',
    'job_desc_required': 'Job description required',
    'pdf_only': 'Please upload a PDF file',
    'webhook_error': 'Server configuration error',
    'submission_error': 'Error submitting form',
    'analysis_complete': 'Analysis complete!',
    'check_suggestions': 'Check out the suggestions below to improve your CV.',
    
    // Suggestions
    'overall_feedback': 'Overall Feedback',
    'key_skills': "Key Skills",
    'original': 'Original',
    'suggested_improvement': 'Suggested Improvement',
    'personalized_suggestions': 'Your Personalized Suggestions',
    'copy_suggestion': 'Copy suggestion',
    'copied': 'Copied!',
    'failed_to_copy': 'Failed to copy',
    'try_again': 'Please try again',
    'compatibility_score': 'Compatibility Score',
    'high_compatibility': 'Your CV is highly compatible with this job description.',
    'medium_compatibility': 'Your CV is moderately compatible with this job description.',
    'low_compatibility': 'Your CV needs significant improvements for this job description.',
    
    // How it works
    'how_it_works': 'How It Works',
    'step_1': 'Upload your CV or paste Google Docs URL',
    'step_2': 'Add the job description you\'re applying for',
    'step_3': 'Get tailored suggestions to improve your CV',
    'step_4': 'Apply the changes directly to your document',

    // Like this page
    'like_this_page': 'Like this page?',
    'contact_me_at': 'Contact me at',
    
    // Dashboard
    'welcome_dashboard': 'Welcome to Your Dashboard',
    'access_info': 'You have access to 10 CV submissions per day. Make them count!',
    'tips_for_better': 'Tips for Better Results',
    'tip_1': 'Make sure your Google Doc is accessible (set to "Anyone with the link can view")',
    'tip_2': 'Include the full job description for more accurate suggestions',
    'tip_3': 'Try different versions of your CV for different job types',
    'tip_4': 'Implement suggestions and resubmit for further improvements',
    
    // Footer
    'all_rights_reserved': 'All rights reserved.'
  },
  es: {
    // Header
    'sign_in': 'Iniciar sesión',
    'dashboard': 'Panel',
    'sign_out': 'Cerrar sesión',
    
    // Main page
    'app_tagline': 'Optimiza tu CV para cada oferta de trabajo',
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
    'job_description_placeholder': 'Pega la descripción de la oferta de trabajo aquí...',
    'job_description_help': 'La descripción del trabajo ayudará a adaptar las sugerencias al rol específico',
    'analyzing': 'Analizando...',
    'get_suggestions': 'Obtener sugerencias para CV',
    'use_google_docs': 'Usar URL de Google Docs en su lugar',
    'use_pdf_upload': 'Subir PDF en su lugar',
    'url_required': 'URL de Google Docs requerida',
    'file_required': 'Archivo CV requerido',
    'job_desc_required': 'Descripción del trabajo requerida',
    'pdf_only': 'Por favor sube un archivo PDF',
    'webhook_error': 'Error de configuración del servidor',
    'submission_error': 'Error al enviar el formulario',
    'analysis_complete': '¡Análisis completado!',
    'check_suggestions': 'Revisa las sugerencias a continuación para mejorar tu CV.',
    
    // Suggestions
    'overall_feedback': 'Comentarios Generales',
    'key_skills': "Habilidades Clave",
    'original': 'Original',
    'suggested_improvement': 'Mejora sugerida',
    'personalized_suggestions': 'Tus sugerencias personalizadas',
    'copy_suggestion': 'Copiar sugerencia',
    'copied': '¡Copiado!',
    'failed_to_copy': 'Error al copiar',
    'try_again': 'Por favor intenta de nuevo',
    'compatibility_score': 'Índice de compatibilidad',
    'high_compatibility': 'Tu CV es altamente compatible con esta descripción de trabajo.',
    'medium_compatibility': 'Tu CV es moderadamente compatible con esta descripción de trabajo.',
    'low_compatibility': 'Tu CV necesita mejoras significativas para esta descripción de trabajo.',
    
    // How it works
    'how_it_works': 'Cómo funciona',
    'step_1': 'Sube tu CV o pega la URL de Google Docs',
    'step_2': 'Agrega la descripción del trabajo al que estás aplicando',
    'step_3': 'Obtén sugerencias personalizadas para mejorar tu CV',
    'step_4': 'Aplica los cambios directamente a tu documento',

    // Like this page
    'like_this_page': '¿Te gusta está página?',
    'contact_me_at': 'Contáctame en',
    
    // Dashboard
    'welcome_dashboard': 'Bienvenido a tu Panel',
    'access_info': 'Tienes acceso a 10 envíos de CV por día. ¡Aprovéchalos!',
    'tips_for_better': 'Consejos para mejores resultados',
    'tip_1': 'Asegúrate de que tu Google Doc sea accesible (configúralo como "Cualquiera con el enlace puede ver")',
    'tip_2': 'Incluye la descripción completa del trabajo para obtener sugerencias más precisas',
    'tip_3': 'Prueba diferentes versiones de tu CV para diferentes tipos de trabajo',
    'tip_4': 'Implementa las sugerencias y vuelve a enviar para obtener más mejoras',
    
    // Footer
    'all_rights_reserved': 'Todos los derechos reservados.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es'); // Set Spanish as default

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
