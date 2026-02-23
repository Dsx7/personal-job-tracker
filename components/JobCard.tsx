"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, FileText, Save, Edit2, CheckCircle2, Copy } from "lucide-react"; 
import { toast } from "sonner"; // <--- IMPORT SONNER
import Countdown from "./Countdown";

export default function JobCard({ job, onUpdate }: { job: any, onUpdate: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    position: job.position || "",
    portalUsername: job.portalUsername || "",
    portalPassword: job.portalPassword || "",
    status: job.status || "Pending",
    notes: job.notes || ""
  });

  const handleSave = async () => {
    await fetch('/api/jobs', {
      method: 'PUT',
      body: JSON.stringify({
        _id: job._id,
        ...formData
      })
    });
    setIsEditing(false);
    onUpdate(); 
  };

  // --- SONNER COPY FUNCTION ---
  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied!", {
      description: `${label} copied to clipboard.`,
      duration: 2000,
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return "default"; 
      case 'Interview': return "secondary"; 
      case 'Rejected': return "destructive"; 
      default: return "outline";
    }
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-all border-t-4 border-t-blue-600 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="w-[70%]">
            <h3 className="font-bold text-lg text-slate-800 leading-tight">{job.organization}</h3>
            {!isEditing && <p className="text-sm font-medium text-blue-600 mt-1">{job.position}</p>}
          </div>
          <Badge variant={getStatusColor(job.status)}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        {/* DATES */}
        <div className="flex justify-between text-[11px] text-gray-400 border-b pb-2">
          <span>Added: {new Date(job.createdAt).toLocaleDateString()}</span>
          {job.appliedDate && <span className="text-green-600 font-medium">Applied: {new Date(job.appliedDate).toLocaleDateString()}</span>}
        </div>

        {/* DEADLINE */}
        {job.status === 'Pending' && !isEditing && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">Deadline:</span>
              <span className="text-xs font-bold text-gray-700">{job.deadline}</span>
            </div>
            <div className="flex justify-end">
              <Countdown deadlineStr={job.deadline} />
            </div>
          </div>
        )}

        {/* --- EDIT MODE --- */}
        {isEditing ? (
          <div className="space-y-3 bg-slate-50 p-3 rounded-lg border shadow-inner animate-in fade-in zoom-in-95 duration-200">
            <div>
              <Label className="text-xs text-gray-500 font-bold">Current Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({...formData, status: val})}
              >
                <SelectTrigger className="h-8 bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Position</Label>
              <Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="bg-white h-8 text-sm"/>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-gray-500">Username</Label>
                <Input value={formData.portalUsername} onChange={(e) => setFormData({...formData, portalUsername: e.target.value})} className="bg-white h-8 text-sm"/>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Password</Label>
                <Input value={formData.portalPassword} onChange={(e) => setFormData({...formData, portalPassword: e.target.value})} className="bg-white h-8 text-sm font-mono"/>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Notes / Remarks</Label>
              <Textarea 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                className="bg-white text-sm min-h-[60px]"
                placeholder="e.g. Exam on 25th, Score 40/50..."
              />
            </div>
          </div>
        ) : (
          /* --- VIEW MODE --- */
          <>
            {/* CREDENTIALS DISPLAY WITH COPY BUTTONS */}
            {job.status !== 'Pending' && (
              <div className="space-y-1 bg-slate-50 p-2 rounded border border-slate-100">
                <div className="flex justify-between items-center text-xs group">
                  <span className="font-bold text-slate-500">USER:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{job.portalUsername || "--"}</span>
                    {job.portalUsername && (
                      <button onClick={() => copyToClipboard(job.portalUsername, "Username")} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs group">
                  <span className="font-bold text-slate-500">PASS:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-slate-200 px-1 rounded">{job.portalPassword || "--"}</span>
                    {job.portalPassword && (
                      <button onClick={() => copyToClipboard(job.portalPassword, "Password")} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {job.notes && (
              <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs text-slate-700 italic">
                <span className="font-bold text-yellow-700 not-italic">📝 Note: </span>
                {job.notes}
              </div>
            )}
          </>
        )}

        {/* Links */}
        <div className="flex gap-3 pt-1">
          <a href={job.jobUrl} target="_blank" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <ExternalLink size={12} /> Link
          </a>
          {job.localPdfPath && (
            <a href={job.localPdfPath} target="_blank" className="flex items-center gap-1 text-xs text-red-600 hover:underline">
              <FileText size={12} /> PDF
            </a>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="w-full bg-white text-slate-600 border hover:bg-slate-50" 
            size="sm"
          >
            <Edit2 className="w-3 h-3 mr-2" /> Edit Info / Status
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="w-1/3">Cancel</Button>
            <Button onClick={handleSave} size="sm" className="w-2/3 bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}