"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ExternalLink, 
  Save, 
  Edit2, 
  Copy, 
  CalendarCheck, 
  Ticket, 
  Building2, 
  Briefcase, 
  User, 
  KeyRound, 
  Clock,
  CalendarDays,
  AlignLeft
} from "lucide-react"; 
import { toast } from "sonner"; 
import Countdown from "./Countdown";
import PdfModal from "./PdfModal";

export default function JobCard({ job, onUpdate }: { job: any, onUpdate: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    position: job.position || "",
    portalUsername: job.portalUsername || "",
    portalPassword: job.portalPassword || "",
    status: job.status || "Pending",
    notes: job.notes || "",
    examDate: job.examDate || "",           
    admitCardUrl: job.admitCardUrl || ""    
  });

  const handleSave = async () => {
    // 1. Prepare the payload
    const payload: any = {
      _id: job._id,
      ...formData
    };

    // 2. AUTO-STAMP APPLIED DATE
    if (formData.status === 'Applied' && !job.appliedDate) {
      payload.appliedDate = new Date().toISOString();
    }

    // 3. Send to database
    await fetch('/api/jobs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    setIsEditing(false);
    onUpdate(); 
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied!", {
      description: `${label} copied to clipboard.`,
      duration: 2000,
    });
  };

  // Upgraded custom badge styles
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Applied': 
        return "bg-emerald-100/80 text-emerald-700 border-emerald-200/60"; 
      case 'Interview': 
        return "bg-blue-100/80 text-blue-700 border-blue-200/60"; 
      case 'Rejected': 
        return "bg-rose-100/80 text-rose-700 border-rose-200/60"; 
      default: 
        return "bg-amber-100/80 text-amber-700 border-amber-200/60";
    }
  };

  return (
    <Card className="w-full h-full flex flex-col bg-white rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md overflow-hidden group">
      
      {/* --- HEADER --- */}
      <div className="p-5 pb-4 border-b border-slate-100/80 bg-slate-50/50">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-[17px] text-slate-900 leading-tight tracking-tight flex items-start gap-2">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{job.organization}</span>
            </h3>
            {!isEditing && (
              <p className="text-sm font-medium text-blue-600 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {job.position || "Position not specified"}
              </p>
            )}
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider shrink-0 ${getStatusBadge(job.status)}`}>
            {job.status}
          </span>
        </div>
      </div>

      {/* --- BODY --- */}
      <CardContent className="p-5 space-y-5 flex-grow">
        
        {/* DATES */}
        <div className="flex justify-between items-center text-[11px] font-medium text-slate-400">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Added {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          {job.appliedDate && (
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Applied {new Date(job.appliedDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* DEADLINE COUNTDOWN */}
        {job.status === 'Pending' && !isEditing && (
          <div className="flex items-center justify-between bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-amber-700">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Deadline</span>
            </div>
            <Countdown deadlineStr={job.deadline} />
          </div>
        )}

        {/* --- EDIT MODE --- */}
        {isEditing ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                <SelectTrigger className="h-9 bg-white border-slate-200"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Position</Label>
              <Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="bg-white h-9 text-sm border-slate-200"/>
            </div>
            
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Username</Label>
                <Input value={formData.portalUsername} onChange={(e) => setFormData({...formData, portalUsername: e.target.value})} className="bg-white h-8 text-sm border-slate-200"/>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500">Password</Label>
                <Input value={formData.portalPassword} onChange={(e) => setFormData({...formData, portalPassword: e.target.value})} className="bg-white h-8 text-sm font-mono border-slate-200"/>
              </div>
            </div>

            {/* EXAM TRACKING INPUTS */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/60">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Exam Date</Label>
                <Input type="date" value={formData.examDate} onChange={(e) => setFormData({...formData, examDate: e.target.value})} className="bg-white h-8 text-xs border-blue-200/50 text-blue-900"/>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Admit Card URL</Label>
                <Input type="url" placeholder="https://" value={formData.admitCardUrl} onChange={(e) => setFormData({...formData, admitCardUrl: e.target.value})} className="bg-white h-8 text-xs border-blue-200/50 placeholder:text-blue-300"/>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes / Remarks</Label>
              <Textarea 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                className="bg-white text-sm min-h-[80px] border-slate-200 resize-none"
                placeholder="e.g. MCQ Exam on 25th, Score 40/50..."
              />
            </div>
          </div>
        ) : (
          /* --- VIEW MODE --- */
          <div className="space-y-4">
            
            {/* EXAM TRACKING DISPLAY */}
            {(job.examDate || job.admitCardUrl) && (
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/30 p-3 rounded-xl border border-blue-100/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                {job.examDate && (
                  <div className="flex items-center gap-2 text-[13px] font-bold text-blue-900">
                    <div className="p-1.5 bg-blue-100/80 rounded-lg text-blue-600">
                      <CalendarCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>{new Date(job.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
                {job.admitCardUrl && (
                  <a href={job.admitCardUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-lg hover:bg-blue-700 hover:shadow-md transition-all ml-auto">
                    <Ticket className="w-3.5 h-3.5" /> Admit Card
                  </a>
                )}
              </div>
            )}

            {/* SECURE CREDENTIALS VAULT */}
            {job.status !== 'Pending' && (job.portalUsername || job.portalPassword) && (
              <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-1.5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white transition-colors">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-20">
                      <User className="w-3.5 h-3.5" /> ID
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="font-mono text-xs text-slate-700 font-medium truncate">{job.portalUsername || "--"}</span>
                      {job.portalUsername && (
                        <button onClick={() => copyToClipboard(job.portalUsername, "Username")} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Copy size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="h-px bg-slate-200/50 mx-2" />
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white transition-colors">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-20">
                      <KeyRound className="w-3.5 h-3.5" /> Pass
                    </div>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="font-mono text-xs text-slate-700 bg-slate-200/50 px-2 py-0.5 rounded border border-slate-200/60 truncate max-w-[120px]">{job.portalPassword || "--"}</span>
                      {job.portalPassword && (
                        <button onClick={() => copyToClipboard(job.portalPassword, "Password")} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Copy size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTES */}
            {job.notes && (
              <div className="flex items-start gap-2 bg-amber-50/40 border border-amber-100/80 p-3 rounded-xl text-xs text-slate-700">
                <AlignLeft className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{job.notes}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* --- FOOTER LINKS & BUTTONS --- */}
      <CardFooter className="flex flex-col gap-3 p-5 pt-0">
        
        {/* Document Links */}
        <div className="flex items-center gap-2 w-full pt-4 border-t border-slate-100/80">
          <a href={job.jobUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100/50 hover:bg-slate-200/50 px-3 py-2 rounded-lg border border-slate-200/50">
            <ExternalLink size={13} /> Portal Link
          </a>
          
          {job.localPdfPath && (
            <div className="flex-1 flex">
              <PdfModal job={job} onUpdate={onUpdate} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full text-slate-500 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 h-9 rounded-xl transition-all group-hover:border-solid">
            <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit Details
          </Button>
        ) : (
          <div className="flex gap-2 w-full mt-2">
            <Button onClick={() => setIsEditing(false)} variant="ghost" className="w-1/3 h-10 rounded-xl text-slate-500">Cancel</Button>
            <Button onClick={handleSave} className="w-2/3 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}