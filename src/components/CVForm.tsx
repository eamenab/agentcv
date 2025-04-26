import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useClientUsage } from "@/hooks/useClientUsage";
import { Loader2, FileText, Link2, UploadCloud, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type InputSource = 'pdf' | 'gdoc';
type JobSource = 'linkedin' | 'text';

interface CVFormProps {
  onSubmitSuccess: (data: any) => void;
}

export function CVForm({ onSubmitSuccess }: CVFormProps) {
  const [cvUrl, setCvUrl] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [linkedinJobUrl, setLinkedinJobUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputSource, setInputSource] = useState<InputSource>("pdf"); // Default to PDF
  const [jobSource, setJobSource] = useState<JobSource>("linkedin"); // Default to LinkedIn
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const { canUse, remainingUses, incrementUsage } = useClientUsage();
  const { language, t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: t('pdf_only'),
          description: t('pdf_only'),
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
  
  const toggleJobSource = () => {
    setJobSource(jobSource === 'linkedin' ? 'text' : 'linkedin');
    // Clear both inputs when switching
    setJobDescription("");
    setLinkedinJobUrl("");
  };

  const validateLinkedinUrl = (url: string): boolean => {
    return url.includes('linkedin.com/jobs/view/');
  }

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
        title: t('file_required'),
        description: t('file_required'),
        variant: "destructive",
      });
      return;
    }

    if (inputSource === 'gdoc' && !cvUrl) {
      toast({
        title: t('url_required'),
        description: t('url_required'),
        variant: "destructive",
      });
      return;
    }

    if (jobSource === 'text' && !jobDescription) {
      toast({
        title: t('job_desc_required'),
        description: t('job_desc_required'),
        variant: "destructive",
      });
      return;
    }

    if (jobSource === 'linkedin') {
      if (!linkedinJobUrl) {
        toast({
          title: t('linkedin_url_required'),
          description: t('linkedin_url_required'),
          variant: "destructive",
        });
        return;
      }
      
      if (!validateLinkedinUrl(linkedinJobUrl)) {
        toast({
          title: t('invalid_linkedin_url'),
          description: t('please_enter_valid_linkedin'),
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setProgress(0);
      setProgressMessage(t('progress_cv'));
      
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

      if (!webhookUrl) {
        throw new Error(t('webhook_error'));
      }
      
      let response;
      
      if (inputSource === 'pdf') {
        // Handle PDF file upload
        const formData = new FormData();
        formData.append('cv_file', cvFile as File);
        
        if (jobSource === 'text') {
          formData.append('job_description', jobDescription);
        } else {
          formData.append('linkedin_url', linkedinJobUrl);
        }
        
        formData.append('language', language);
        formData.append('inputSource', inputSource);
        formData.append('jobSource', jobSource);
      
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
            job_description: jobSource === 'text' ? jobDescription : null,
            linkedin_url: jobSource === 'linkedin' ? linkedinJobUrl : null,
            language,
            inputSource,
            jobSource,
          }),
        });
      }
      
      if (!response.ok) {
        throw new Error(`${t('submission_error')}: ${response.status}`);
      }

      const data = await response.json();
      incrementUsage();
      onSubmitSuccess(data);
      
      toast({
        title: t('analysis_complete'),
        description: t('check_suggestions'),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t('submission_error'),
        description: error instanceof Error ? error.message : t('submission_error'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 5 + 1, 95));
      }, 1250);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);
      setProgressMessage(t('progress_complete'));
      const timeout = setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isSubmitting]);

  // Update progress message based on progress thresholds
  useEffect(() => {
    if (isSubmitting) {
      if (progress < 25) setProgressMessage(t('progress_cv'));
      else if (progress < 50) setProgressMessage(t('progress_offer'));
      else if (progress < 75) setProgressMessage(t('progress_suggestions'));
      else if (progress < 100) setProgressMessage(t('progress_match'));
    }
  }, [progress, isSubmitting]);

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <p className="mb-4 font-medium">{progressMessage}</p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className="bg-primary h-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mt-2 text-sm">{Math.floor(progress)}%</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="notebook-page space-y-6">
        {/* CV Input Section */}
        <div className="space-y-2">
          {inputSource === 'pdf' ? (
            <div className="space-y-2">
              <label htmlFor="cv-file" className="block font-medium text-foreground">
                {t('cv_file_label')}
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  id="cv-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div
                  className={`w-full border-2 border-dashed rounded-md p-8 text-center transition-colors ${
                    cvFile
                      ? 'border-primary/70'
                      : 'border-primary/30 hover:border-primary/50 animate-pulse-bg'
                  }`}
                >
                  {!cvFile ? (
                    <div className="flex flex-col items-center text-muted-foreground pointer-events-none">
                      <UploadCloud size={24} className="mb-2" />
                      <p className="text-sm">{t('cv_file_help')}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-primary flex items-center justify-center gap-2 pointer-events-none">
                      <FileText size={16} />
                      {cvFile.name}
                    </p>
                  )}
                </div>
              </div>
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

        {/* Job Description Section with Toggle */}
        <div className="space-y-4">
          <div className="font-medium text-foreground">
            {t('job_description_label')}
          </div>
          
          {jobSource === 'linkedin' ? (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="linkedin-url"
                  type="url"
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  value={linkedinJobUrl}
                  onChange={(e) => setLinkedinJobUrl(e.target.value)}
                  className="w-full pl-10 border-2 hover:border-primary/50 focus:border-primary transition-colors"
                  disabled={isSubmitting}
                />
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('linkedin_url_help')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
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
          )}
          
          {/* Toggle between LinkedIn and Text */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <Label htmlFor="job-toggle" className="text-sm cursor-pointer">
              {jobSource === 'linkedin' ? t('use_text_input') : t('use_linkedin_url')}
            </Label>
            <Switch 
              id="job-toggle" 
              checked={jobSource === 'text'} 
              onCheckedChange={toggleJobSource} 
            />
          </div>
        </div>

        <div className="notebook-line"></div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <span>{t('submissions_remaining')} </span>
            <span className="font-bold">{remainingUses}</span>
            <span> / {3}</span>
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
    </>
  );
}
