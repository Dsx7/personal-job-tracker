import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Job from "@/models/Job";
import User from "@/models/User"; // <--- Import User Model
import { getServerSession } from "next-auth";

// GET ALL JOBS
export async function GET() {
  const session = await getServerSession();
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  await connectToDB();

  // 1. ROBUST USER LOOKUP (The Fix)
  // If session doesn't have the ID, find the user by email
  let userId = (session.user as any).id;

  if (!userId) {
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      userId = user._id;
    } else {
      // If user somehow doesn't exist in DB, return empty list
      return NextResponse.json([]);
    }
  }

  // 2. FETCH JOBS FOR THIS USER
  const jobs = await Job.find({ userId: userId }).sort({ createdAt: -1 });
  
  return NextResponse.json(jobs);
}

// UPDATE JOB (Mark as Applied)
export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectToDB();
  
  // We can just update by ID, but checking ownership is safer
  // For now, simple update by ID is fine for a personal tool
  const updatedJob = await Job.findByIdAndUpdate(body._id, body, { new: true });
  
  return NextResponse.json(updatedJob);
}



// Add this at the bottom of app/api/jobs/route.ts

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    await connectToDB();
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (error: any) {
    console.error("DELETE JOB ERROR:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}