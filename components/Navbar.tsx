"use client";
import { signOut, useSession } from "next-auth/react";
import { Briefcase, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddJobDialog from "./AddJobDialog"; // Move your AddDialog here if you want it in header

export default function Navbar({ onRefresh }: { onRefresh?: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto px-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Briefcase size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:inline-block">
            JobTracker<span className="text-blue-600">.</span>
          </span>
        </div>

        {/* Actions Section */}
        {session && (
          <div className="flex items-center gap-4">
            {/* Pass refresh function to dialog so page updates when job added */}
            {onRefresh && <AddJobDialog onJobAdded={onRefresh} />}
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-700">{session.user?.email}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Personal Account</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => signOut()}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}