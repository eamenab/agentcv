
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUsage } from "@/hooks/useUsage";
import { Loader2 } from "lucide-react";

interface CVFormProps {
  onSubmitSuccess: (data: any) => void;
}

export function CVForm({ onSubmitSuccess }: CVFormProps) {
  const [cvUrl, setCvUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { canUse, remainingUses, incrementUsage } = useUsage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canUse) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily submission limit. Sign in for more submissions or try again tomorrow.",
        variant: "destructive",
      });
      return;
    }

    if (!cvUrl) {
      toast({
        title: "URL required",
        description: "Please enter your Google Docs CV URL",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription) {
      toast({
        title: "Job description required",
        description: "Please enter the job description to get targeted suggestions",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Use the webhook URL from environment variables
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
      
      if (!webhookUrl) {
        throw new Error("Webhook URL not configured");
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cv_url: cvUrl,
          job_description: jobDescription,
        }),
      });

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
      <div className="notebook-header">AgentCV · Personalized CV Suggestions</div>

      <div className="space-y-2">
        <label htmlFor="cv-url" className="block font-medium text-foreground">
          Google Docs CV URL
        </label>
        <Input
          id="cv-url"
          type="url"
          placeholder="https://docs.google.com/document/d/..."
          value={cvUrl}
          onChange={(e) => setCvUrl(e.target.value)}
          className="w-full"
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          Paste the link to your CV Google Doc (make sure it's accessible)
        </p>
      </div>

      <div className="notebook-line"></div>

      <div className="space-y-2">
        <label htmlFor="job-description" className="block font-medium text-foreground">
          Job Description
        </label>
        <Textarea
          id="job-description"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[150px] w-full"
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground">
          The job description will help tailor the suggestions to the specific role
        </p>
      </div>

      <div className="notebook-line"></div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <span>Submissions remaining today: </span>
          <span className="font-bold">{remainingUses}</span>
        </div>
        
        <Button type="submit" disabled={isSubmitting || !canUse}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Get CV Suggestions"
          )}
        </Button>
      </div>
    </form>
  );
}
