"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function AddJobDialog({ onJobAdded }: { onJobAdded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [org, setOrg] = useState("");

  const handleScrape = async () => {
    setLoading(true);
    await fetch('/api/scrape', {
      method: 'POST',
      body: JSON.stringify({ url, organization: org, position: "Job Position" })
    });
    setLoading(false);
    setOpen(false);
    onJobAdded(); // Refresh parent
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>+ Add New Job</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Job & Scrape</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Organization Name" value={org} onChange={e => setOrg(e.target.value)} />
          <Input placeholder="Job URL (e.g. teletalk...)" value={url} onChange={e => setUrl(e.target.value)} />
          <Button onClick={handleScrape} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Scraping PDF...</> : "Grab Info & Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}