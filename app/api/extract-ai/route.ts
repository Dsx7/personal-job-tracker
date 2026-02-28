import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDB } from "@/lib/db";
import Job from "@/models/Job";
import axios from 'axios';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { jobId, pdfUrl } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    // 1. Download the PDF as a buffer
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const base64Pdf = Buffer.from(response.data).toString('base64');

    // 2. Setup Gemini 1.5 Flash (Super fast and supports PDFs)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Prompt Engineering for strict JSON output
    const prompt = `
      Analyze this job advertisement PDF from Bangladesh. 
      Extract the following information and return ONLY a valid JSON object without markdown formatting.
      If a value is not found, return "Not specified".
      
      Required Keys:
      - "fee": The application fee (e.g., "223 BDT", "500 Tk").
      - "ageLimit": The general age limit mentioned (e.g., "18-30 years").
      - "education": A very brief 3-word summary of the highest education required (e.g., "BSc in Engineering", "HSC Pass").
    `;

    const pdfPart = {
      inlineData: {
        data: base64Pdf,
        mimeType: "application/pdf",
      },
    };

    // 4. Generate Content
    const result = await model.generateContent([prompt, pdfPart]);
    const responseText = result.response.text();
    
    // Clean up response to ensure it's pure JSON (removes markdown backticks if present)
    const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanedJson);

    // 5. Save to Database
    await connectToDB();
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { aiSummary: parsedData },
      { new: true }
    );

    return NextResponse.json({ success: true, aiSummary: updatedJob.aiSummary });

  } catch (error: any) {
    console.error("AI Extraction Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}