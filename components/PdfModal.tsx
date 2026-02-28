"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, Sparkles, GraduationCap, Coins, UserCircle } from "lucide-react";
import { toast } from "sonner";

export default function PdfModal({ job, onUpdate }: { job: any, onUpdate?: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);

  const viewerUrl = `${job.localPdfPath}#toolbar=0&navpanes=0&view=FitH`;

  const handleExtract = async () => {
    setIsExtracting(true);
    toast.info("AI is reading the document...");

    try {
      const res = await fetch('/api/extract-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job._id, pdfUrl: job.localPdfPath })
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success("Extraction Complete!");
        if (onUpdate) onUpdate(); // Refresh the parent to get the new AI data
      } else {
        toast.error("Failed to extract data.");
      }
    } catch (e) {
      toast.error("Something went wrong.");
    } finally {
      setIsExtracting(false);
    }
  };

  const hasAiData = job.aiSummary && (job.aiSummary.fee || job.aiSummary.ageLimit);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 px-2.5 py-1.5 rounded-md border border-rose-100/50 hover:bg-rose-100">
          <FileText size={14} /> View Circular
        </button>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 flex flex-col gap-0 overflow-hidden bg-slate-50 border-slate-200 rounded-2xl">
        
        {/* Modal Header */}
        <DialogHeader className="px-5 py-4 border-b bg-white flex flex-col sm:flex-row sm:items-center justify-between shrink-0 shadow-sm z-20 gap-4">
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {job.organization}
              <span className="hidden sm:inline-block text-slate-400 font-medium text-sm">| Official Advertisement</span>
            </DialogTitle>
            
            {/* AI Tags Section */}
            {hasAiData ? (
              <div className="flex flex-wrap gap-2 animate-in fade-in zoom-in duration-500">
                <AiTag icon={Coins} label="Fee" value={job.aiSummary.fee} color="text-emerald-600 bg-emerald-50 border-emerald-200" />
                <AiTag icon={UserCircle} label="Age" value={job.aiSummary.ageLimit} color="text-amber-600 bg-amber-50 border-amber-200" />
                <AiTag icon={GraduationCap} label="Edu" value={job.aiSummary.education} color="text-blue-600 bg-blue-50 border-blue-200" />
              </div>
            ) : (
              <Button 
                onClick={handleExtract} 
                disabled={isExtracting}
                variant="outline" 
                size="sm" 
                className="w-fit h-7 text-xs bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
              >
                {isExtracting ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1.5 text-indigo-500" />}
                {isExtracting ? "Analyzing PDF..." : "Extract Insights with AI"}
              </Button>
            )}
          </div>
          
          {/* Download Button */}
          <Button asChild size="sm" className="bg-slate-800 hover:bg-slate-900 text-white shadow-sm transition-all h-9 rounded-lg shrink-0 w-full sm:w-auto">
            <a href={job.localPdfPath} download target="_blank" rel="noreferrer">
              <Download className="w-4 h-4 sm:mr-2" /> 
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          </Button>
        </DialogHeader>

        {/* PDF Viewer Area */}
        <div className="relative flex-1 w-full bg-slate-200/50">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50/80 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
              <p className="text-sm font-medium animate-pulse">Loading Document...</p>
            </div>
          )}
          
          <iframe
            src={viewerUrl}
            className="w-full h-full border-0 relative z-0"
            onLoad={() => setIsLoading(false)}
            title={`${job.organization} PDF Circular`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Micro-component for the AI Tags
function AiTag({ icon: Icon, label, value, color }: any) {
  if (!value || value === "Not specified") return null;
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] sm:text-xs font-bold ${color}`}>
      <Icon className="w-3.5 h-3.5 opacity-80" />
      <span className="opacity-70 font-semibold">{label}:</span> {value}
    </div>
  );
}