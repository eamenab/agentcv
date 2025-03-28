
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useClientUsage } from "@/hooks/useClientUsage";
import { Loader2, FileText, Link2, UploadCloud } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type InputSource = 'pdf' | 'gdoc';

interface CVFormProps {
  onSubmitSuccess: (data: any) => void;
}

export function CVForm({ onSubmitSuccess }: CVFormProps) {
  const [cvUrl, setCvUrl] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputSource, setInputSource] = useState<InputSource>("pdf"); // Default to PDF
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const { canUse, remainingUses, incrementUsage } = useClientUsage();
  const { language, t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      setCvFile(file);
    }
  };

  const toggleInputSource = () => {
    setInputSource(inputSource === 'pdf' ? 'gdoc' : 'pdf');
    // Clear both inputs when switching
    setCvFile(null);
    setCvUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canUse) {
      toast({
        title: t('limit_reached'),
        description: t('limit_reached'),
        variant: "destructive",
      });
      return;
    }

    if (inputSource === 'pdf' && !cvFile) {
      toast({
        title: "CV file required",
        description: "Please upload your CV as a PDF file",
        variant: "destructive",
      });
      return;
    }

    if (inputSource === 'gdoc' && !cvUrl) {
      toast({
        title: "URL required",
        description: "Please enter your Google Docs CV URL",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription) {
      toast({
        title: t('job_description_label') + " required",
        description: "Please enter the job description to get targeted suggestions",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Determine which webhook URL to use based on language and source
      let webhookUrl;
      
      if (language === 'es' && inputSource === 'pdf') {
        webhookUrl = import.meta.env.VITE_WEBHOOK_ES_PDF;
      } else if (language === 'es' && inputSource === 'gdoc') {
        webhookUrl = import.meta.env.VITE_WEBHOOK_ES_GDOC;
      } else if (language === 'en' && inputSource === 'pdf') {
        webhookUrl = import.meta.env.VITE_WEBHOOK_EN_PDF;
      } else {
        webhookUrl = import.meta.env.VITE_WEBHOOK_EN_GDOC;
      }
      
      if (!webhookUrl) {
        throw new Error("Webhook URL not configured for this combination of language and source");
      }

      let response;
      
      if (inputSource === 'pdf') {
        // Handle PDF file upload
        const formData = new FormData();
        formData.append('cv_file', cvFile as File);
        formData.append('job_description', jobDescription);
        
        response = await fetch(webhookUrl, {
          method: "POST",
          body: formData,
        });
      } else {
        // Handle Google Docs URL
        response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cv_url: cvUrl,
            job_description: jobDescription,
          }),
        });
      }

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      incrementUsage();
      onSubmitSuccess(data);
      
      toast({
        title: "Analysis complete!",
        description: "Check out the suggestions below to improve your CV.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="notebook-page space-y-6">
      <div className="notebook-header">AgentCV · {t('app_tagline')}</div>

      {/* CV Input Section */}
      <div className="space-y-2">
        {inputSource === 'pdf' ? (
          <div className="space-y-2">
            <label htmlFor="cv-file" className="block font-medium text-foreground">
              {t('cv_file_label')}
            </label>
            <div className="relative">
              <Input
                ref={fileInputRef}
                id="cv-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/70 focus:border-primary transition-colors py-8 px-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                disabled={isSubmitting}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!cvFile && (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <UploadCloud size={24} className="mb-2" />
                    <p className="text-sm">{t('cv_file_help')}</p>
                  </div>
                )}
              </div>
            </div>
            {cvFile && (
              <p className="text-sm text-primary flex items-center gap-2">
                <FileText size={16} />
                {cvFile.name}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="cv-url" className="block font-medium text-foreground">
              {t('cv_url_label')}
            </label>
            <div className="relative">
              <Input
                id="cv-url"
                type="url"
                placeholder="https://docs.google.com/document/d/..."
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full pl-10 border-2 hover:border-primary/50 focus:border-primary transition-colors"
                disabled={isSubmitting}
              />
              <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('cv_url_help')}
            </p>
          </div>
        )}
        
        {/* Toggle between PDF and Google Docs */}
        <div className="pt-2 flex items-center justify-end space-x-2">
          <Label htmlFor="input-toggle" className="text-sm cursor-pointer">
            {inputSource === 'pdf' ? t('use_google_docs') : t('use_pdf_upload')}
          </Label>
          <Switch 
            id="input-toggle" 
            checked={inputSource === 'gdoc'} 
            onCheckedChange={toggleInputSource} 
          />
        </div>
      </div>

      <div className="notebook-line"></div>

      <div className="space-y-2">
        <label htmlFor="job-description" className="block font-medium text-foreground">
          {t('job_description_label')}
        </label>
        <Textarea
          id="job-description"
          placeholder={t('job_description_placeholder')}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[150px] w-full border-2 hover:border-primary/50 focus:border-primary transition-colors"
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          {t('job_description_help')}
        </p>
      </div>

      <div className="notebook-line"></div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span>{t('submissions_remaining')} </span>
          <span className="font-bold">{remainingUses}</span>
          <span> / {5}</span>
        </div>
        
        <Button type="submit" disabled={isSubmitting || !canUse}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('analyzing')}
            </>
          ) : (
            t('get_suggestions')
          )}
        </Button>
      </div>
    </form>
  );
}
