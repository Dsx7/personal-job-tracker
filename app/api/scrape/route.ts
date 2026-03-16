import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';
import https from 'https';
import { v2 as cloudinary } from 'cloudinary'; 
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

// Create Axios client that ignores SSL errors
const scraperClient = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
});

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized: No session found" }, { status: 401 });
  }

  try {
    const { url, organization, position } = await req.json();
    await connectToDB();

    // User Lookup
    let userId = (session.user as any).id;
    if (!userId) {
      const user = await User.findOne({ email: session.user.email });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      userId = user._id;
    }

    console.log(`Scraping: ${url}`);

    // Fetch HTML
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
      if (href && (text.includes('advertisement') || (href.toLowerCase().endsWith('.pdf') && !pdfLink))) {
        pdfLink = href;
      }
    });

    // --- THE FIX: SMART URL RESOLVER ---
    // This perfectly merges relative paths with the base URL, keeping subfolders intact!
    if (pdfLink && !pdfLink.startsWith('http')) {
      try {
        pdfLink = new URL(pdfLink, url).href;
      } catch (e) {
        console.error("URL parsing error", e);
      }
    }

    // --- UPLOAD TO CLOUDINARY ---
    let savedFilePath = "";
    
    if (pdfLink) {
      try {
        console.log(`Downloading PDF to Base64: ${pdfLink}`);
        
        const response = await scraperClient.get(pdfLink, { responseType: 'arraybuffer' });
        const base64Data = Buffer.from(response.data).toString('base64');
        const fileDataUri = `data:application/pdf;base64,${base64Data}`;

        const customName = `job_ad_${Date.now()}`;
        console.log(`Uploading to Cloudinary...`);

        const uploadResult = await cloudinary.uploader.upload(fileDataUri, {
          folder: "job_raw_files",
          public_id: customName,
          resource_type: "auto", 
        });

        let finalUrl = uploadResult.secure_url.replace(/\/v\d+\//, "/");
        if (!finalUrl.endsWith('.pdf')) {
          finalUrl = `${finalUrl}.pdf`;
        }

        savedFilePath = finalUrl;
        console.log(`Success: ${savedFilePath}`);

      } catch (e: any) {
        console.error("Cloudinary Upload failed:", e.message || e);
        // Fallback: If upload fails, just save the direct Teletalk link so it's never broken!
        savedFilePath = pdfLink; 
      }
    }

    // --- SAVE TO DATABASE ---
    const newJob = await Job.create({
      userId: userId,
      organization,
      position,
      jobUrl: url,
      deadline,
      advertisementUrl: pdfLink,
      localPdfPath: savedFilePath,
      status: 'Pending'
    });

    return NextResponse.json({ success: true, job: newJob });

  } catch (error: any) {
    console.error("SCRAPE ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}