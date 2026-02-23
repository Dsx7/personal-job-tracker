"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import JobCard from "@/components/JobCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Briefcase, 
  CheckCircle2, 
  Archive, 
  Loader2, 
  Search, 
  Clock, 
  CalendarDays,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";

// ==========================================
// PREMIUM UI COMPONENTS
// ==========================================

// 1. Refined Spotlight Card (Linear Style)
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.1)] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

// 2. Subtle Gradient Text
function GradientText({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchJobs();
  }, [status, router]);

  // --- FILTERING & SORTING LOGIC ---
  const filteredJobs = jobs.filter(job => 
    (job.organization?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (job.position?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const pendingJobs = filteredJobs
    .filter(job => job.status === 'Pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const appliedJobs = filteredJobs
    .filter(job => job.status === 'Applied')
    .sort((a, b) => {
      const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : new Date(a.updatedAt).getTime();
      const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });

  const archivedJobs = filteredJobs
    .filter(job => ['Interview', 'Rejected'].includes(job.status))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'Pending').length,
    interview: jobs.filter(j => j.status === 'Interview').length,
    applied: jobs.filter(j => j.status === 'Applied').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length,
  };

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || "User";

  // ---------------------------

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-12 w-12 animate-ping rounded-full border border-blue-400 opacity-20"></div>
            <Loader2 className="animate-spin text-blue-600 w-8 h-8 relative z-10" />
          </div>
          <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Loading Workspace</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-[#FAFAFA] selection:bg-blue-100">
      
      {/* PREMIUM BACKGROUND: Dot Matrix + Soft Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Dot Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Ambient Glows */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400/20 opacity-50 blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onRefresh={fetchJobs} />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-12">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-1.5">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Welcome back, <GradientText>{userName}</GradientText>
              </h1>
              <p className="text-slate-500 font-medium">
                Here's a breakdown of your job application pipeline.
              </p>
            </div>
            
            {/* Frosted Pill Search Bar */}
            <div className="relative w-full md:w-80">
              <div className="relative flex items-center bg-white/60 backdrop-blur-md rounded-full border border-slate-200/80 shadow-sm px-4 py-2.5 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-300">
                <Search className="text-slate-400 h-4 w-4 mr-2.5" />
                <Input 
                  placeholder="Search organizations or roles..." 
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 text-sm font-medium placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* BENTO STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SpotlightCard>
              <StatContent label="Total Tracked" value={stats.total} icon={Briefcase} color="text-blue-600" bg="bg-blue-50" />
            </SpotlightCard>
            <SpotlightCard>
              <StatContent label="Pending Action" value={stats.pending} icon={AlertCircle} color="text-amber-600" bg="bg-amber-50" />
            </SpotlightCard>
            <SpotlightCard>
              <StatContent label="Applied Successfully" value={stats.applied} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
            </SpotlightCard>
            <SpotlightCard>
              <StatContent label="Archived / History" value={stats.interview + stats.rejected} icon={Archive} color="text-slate-500" bg="bg-slate-100" />
            </SpotlightCard>
          </div>

          {/* --- SECTIONS --- */}

          {/* 1. PENDING */}
          <section className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <SectionHeader title="Pending Applications" count={pendingJobs.length} icon={Clock} color="text-amber-600" bg="bg-amber-100/50" border="border-amber-200/50" />
            
            {pendingJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pendingJobs.map((job) => (
                  <SpotlightCard key={job._id} className="p-0">
                    <JobCard job={job} onUpdate={fetchJobs} />
                  </SpotlightCard>
                ))}
              </div>
            ) : (
              <EmptyState message="All caught up! No pending applications." icon={CheckCircle2} />
            )}
          </section>

          {/* 2. APPLIED */}
          <section className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <SectionHeader title="Applied Jobs" count={appliedJobs.length} icon={CalendarDays} color="text-blue-600" bg="bg-blue-100/50" border="border-blue-200/50" />

            {appliedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {appliedJobs.map((job) => (
                  <SpotlightCard key={job._id} className="p-0">
                    <JobCard job={job} onUpdate={fetchJobs} />
                  </SpotlightCard>
                ))}
              </div>
            ) : (
              <EmptyState message="No active applications yet." icon={Briefcase} />
            )}
          </section>

          {/* 3. ARCHIVED */}
          {archivedJobs.length > 0 && (
            <section className="space-y-5 pt-8 animate-in fade-in duration-1000 delay-300">
              <SectionHeader title="History & Interviews" count={archivedJobs.length} icon={Archive} color="text-slate-500" bg="bg-slate-200/50" border="border-slate-200" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-80 hover:opacity-100 transition-opacity duration-300">
                {archivedJobs.map((job) => (
                  <SpotlightCard key={job._id} className="p-0 bg-slate-50/50">
                    <JobCard job={job} onUpdate={fetchJobs} />
                  </SpotlightCard>
                ))}
              </div>
            </section>
          )}

        </main>
        <Footer />
      </div>
    </div>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function StatContent({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="p-5 flex flex-col justify-between h-full gap-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        <div className={`p-2 rounded-lg ${bg} ${color}`}>
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, count, icon: Icon, color, bg, border }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${border} ${bg} ${color} shadow-sm`}>
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${bg} text-[10px] font-bold ${color}`}>
        {count}
      </span>
    </div>
  );
}

function EmptyState({ message, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white/40 backdrop-blur-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3 shadow-inner">
        <Icon className="h-5 w-5 text-slate-400" strokeWidth={2} />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}