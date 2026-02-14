import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';
import https from 'https';
import { v2 as cloudinary } from 'cloudinary'; // <--- NEW: Import Cloudinary
import { connectToDB } from "@/lib/db";
import Job from "@/models/Job";
import User from "@/models/User";
import { getServerSession } from "next-auth";

// 1. CONFIGURE CLOUDINARY
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Create Axios client that ignores SSL errors (for govt sites)
const scraperClient = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

export async function POST(req: Request) {
  // 2. CHECK SESSION
  const session = await getServerSession();
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized: No session found" }, { status: 401 });
  }

  try {
    const { url, organization, position } = await req.json();
    await connectToDB();

    // 3. ROBUST USER ID FINDER
    // (Fixes the issue where session might lack the ID)
    let userId = (session.user as any).id;

    if (!userId) {
      console.log(`Session ID missing, looking up user by email: ${session.user.email}`);
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: "User not found in database" }, { status: 404 });
      }
      userId = user._id;
    }

    console.log(`Scraping: ${url} for User: ${userId}`);

    // 4. FETCH HTML
    const { data } = await scraperClient.get(url);
    const $ = cheerio.load(data);

    // Extract Deadline
    const bodyText = $('body').text();
    const deadlineMatch = bodyText.match(/Deadline:\s*(.*?)(?:\]|\n|$)/);
    const deadline = deadlineMatch ? deadlineMatch[1].trim() : "Unknown Deadline";

    // Extract PDF Link
    let pdfLink = '';
    $('a').each((_, el) => {
      const text = $(el).text().toLowerCase();
      const href = $(el).attr('href');
      if (href) {
        if (text.includes('advertisement') || (href.toLowerCase().endsWith('.pdf') && !pdfLink)) {
          pdfLink = href;
        }
      }
    });

    // Resolve Relative URL
    if (pdfLink && !pdfLink.startsWith('http')) {
      const baseUrlObj = new URL(url);
      const origin = baseUrlObj.origin;
      // Handle slash logic safely
      if (pdfLink.startsWith('/')) {
        pdfLink = `${origin}${pdfLink}`;
      } else {
        pdfLink = `${origin}/${pdfLink}`;
      }
    }

    // 5. UPLOAD TO CLOUDINARY (Replaces local file system)
    let savedFilePath = "";
    
    if (pdfLink) {
      try {
        console.log(`Uploading to Cloudinary from URL: ${pdfLink}`);
        
        // We let Cloudinary fetch the PDF directly from the URL
        const uploadResult = await cloudinary.uploader.upload(pdfLink, {
          folder: "job_portal_pdfs",
          resource_type: "auto", // Auto-detects that it is a PDF/Raw file
          use_filename: true,
          unique_filename: true
        });

        // Get the secure, permanent URL
        savedFilePath = uploadResult.secure_url;
        console.log(`Cloudinary Success: ${savedFilePath}`);

      } catch (e: any) {
        console.error("Cloudinary Upload failed:", e.message);
        // We continue even if upload fails, so we at least save the job entry
      }
    }

    // 6. SAVE TO DB
    const newJob = await Job.create({
      userId: userId,
      organization,
      position,
      jobUrl: url,
      deadline,
      advertisementUrl: pdfLink,
      localPdfPath: savedFilePath, // This is now the Cloudinary URL
      status: 'Pending'
    });

    return NextResponse.json({ success: true, job: newJob });

  } catch (error: any) {
    console.error("SCRAPE ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}