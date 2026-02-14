"use client";

import { useEffect, useState } from "react";
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
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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

  // --- FILTERING & SORTING ---

  // 1. Filter by Search Term
  const filteredJobs = jobs.filter(job => 
    job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Grouping
  const pendingJobs = filteredJobs
    .filter(job => job.status === 'Pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const appliedJobs = filteredJobs
    .filter(job => job.status === 'Applied')
    .sort((a, b) => {
      const dateA = a.appliedDate ? new Date(a.appliedDate).getTime() : 0;
      const dateB = b.appliedDate ? new Date(b.appliedDate).getTime() : 0;
      return dateB - dateA;
    });

  const archivedJobs = filteredJobs
    .filter(job => ['Interview', 'Rejected'].includes(job.status))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Stats Calculation
  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'Pending').length,
    interview: jobs.filter(j => j.status === 'Interview').length,
    applied: jobs.filter(j => j.status === 'Applied').length,
  };

  // ---------------------------

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
          <p className="text-slate-500 text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar onRefresh={fetchJobs} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">
        
        {/* HERO SECTION: Welcome & Stats */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Welcome back, User 👋
              </h1>
              <p className="text-slate-500 mt-1">
                Here is what’s happening with your job applications today.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-9 bg-white border-slate-200 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Jobs" value={stats.total} icon={Briefcase} color="bg-blue-100 text-blue-700" />
            <StatCard label="Pending Action" value={stats.pending} icon={AlertCircle} color="bg-orange-100 text-orange-700" />
            <StatCard label="Applied" value={stats.applied} icon={CheckCircle2} color="bg-green-100 text-green-700" />
            <StatCard label="Interviews" value={stats.interview} icon={TrendingUp} color="bg-purple-100 text-purple-700" />
          </div>
        </div>

        {/* --- SECTIONS --- */}

        {/* 1. PENDING (Action Required) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-orange-200">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600 h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Pending Applications</h2>
            <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
              {pendingJobs.length}
            </span>
          </div>
          
          {pendingJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingJobs.map((job) => (
                <JobCard key={job._id} job={job} onUpdate={fetchJobs} />
              ))}
            </div>
          ) : (
            <EmptyState message="All caught up! No pending applications." icon={CheckCircle2} />
          )}
        </section>


        {/* 2. APPLIED (Tracking) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <CalendarDays className="text-blue-600 h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Applied Jobs</h2>
            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {appliedJobs.length}
            </span>
          </div>

          {appliedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appliedJobs.map((job) => (
                <JobCard key={job._id} job={job} onUpdate={fetchJobs} />
              ))}
            </div>
          ) : (
            <EmptyState message="No active applications yet." icon={Briefcase} />
          )}
        </section>


        {/* 3. ARCHIVED (Interview/Rejected) */}
        {archivedJobs.length > 0 && (
          <section className="space-y-4 pt-4 opacity-90">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <div className="p-1.5 bg-slate-100 rounded-lg">
                <Archive className="text-slate-500 h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-700">History & Interviews</h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {archivedJobs.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedJobs.map((job) => (
                <JobCard key={job._id} job={job} onUpdate={fetchJobs} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
      <Icon className="h-10 w-10 text-slate-300 mb-3" />
      <p className="text-slate-500 font-medium text-sm">{message}</p>
    </div>
  );
}