import mongoose from "mongoose";
import Job from "../models/Job";
import User from "../models/User";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

// PDF DATA EXTRACTED
const oldJobs = [
  {
    organization: "br.teletalk.com.bd",
    position: "BR Wayman",
    portalUsername: "",
    portalPassword: "",
    status: "Applied",
    notes: "First Exam Nervous",
    jobUrl: "http://br.teletalk.com.bd"
  },
  {
    organization: "ljd.teletalk.com.bd",
    position: "Office Support Staff",
    portalUsername: "17QP3XTS",
    portalPassword: "Y6156D",
    status: "Rejected",
    notes: "Absent",
    jobUrl: "http://ljd.teletalk.com.bd"
  },
  {
    organization: "dgfood.teletalk.com.bd",
    position: "Assistant Sub Inspector of Food",
    portalUsername: "UYD3QJGC",
    portalPassword: "F563422L",
    status: "Interview",
    appliedDate: new Date("2025-05-01"),
    notes: "Exam Date - 29 Nov. 25. Score: 26/50",
    jobUrl: "http://dgfood.teletalk.com.bd"
  },
  {
    organization: "dirs.teletalk.com.bd",
    position: "Office Support Staff",
    portalUsername: "NMP8D7Z2",
    portalPassword: "V554665E",
    status: "Applied",
    appliedDate: new Date("2024-04-30"),
    jobUrl: "http://dirs.teletalk.com.bd/dlrs_sv2/"
  },
  {
    organization: "dcsirajganj.teletalk.com.bd",
    position: "Office Sohoyok",
    portalUsername: "",
    portalPassword: "",
    status: "Rejected",
    notes: "Not Passed. Need more Dedication",
    jobUrl: "http://dcsirajganj.teletalk.com.bd"
  },
  {
    organization: "dcsirajganj.teletalk.com.bd",
    position: "Office Assistant Cum",
    portalUsername: "KEXM1STA",
    portalPassword: "Y554384G",
    status: "Applied",
    appliedDate: new Date("2025-04-15"),
    notes: "Need More Preparation",
    jobUrl: "http://dcsirajganj.teletalk.com.bd"
  },
  {
    organization: "bnfe.teletalk.com.bd",
    position: "Computer Typist Office Support Staff",
    portalUsername: "AWL1DVTU",
    portalPassword: "P683629C",
    status: "Rejected",
    appliedDate: new Date("2023-07-19"),
    notes: "Absent",
    jobUrl: "http://bnfe.teletalk.com.bd"
  },
  {
    organization: "bbs.teletalk.com.bd",
    position: "Data Entry / Control",
    portalUsername: "79YSQXGR",
    portalPassword: "N296336V",
    status: "Applied",
    notes: "Exam Not Good",
    jobUrl: "http://bbs.teletalk.com.bd"
  },
  {
    organization: "Unknown Org (Date: 05-04-2025)",
    position: "Operator",
    portalUsername: "",
    portalPassword: "",
    status: "Applied",
    appliedDate: new Date("2025-04-05"),
    notes: "Need More Practice of Math and Out Knowledge also English",
    jobUrl: "http://teletalk.com.bd"
  },
  {
    organization: "cssirajganj.teletalk.com.bd",
    position: "Office Assistant Cum Computer Typist",
    portalUsername: "5Y8NF9PR",
    portalPassword: "L662224P",
    status: "Applied",
    appliedDate: new Date("2025-06-28"),
    jobUrl: "http://cssirajganj.teletalk.com.bd"
  },
  {
    organization: "bwmri.teletalk.com.bd",
    position: "Scientific Assistant (বৈজ্ঞানিক সহকারী)",
    portalUsername: "LM64XGVF",
    portalPassword: "A893865X",
    status: "Rejected",
    appliedDate: new Date("2025-07-17"),
    notes: "Absent",
    jobUrl: "http://bwmri.teletalk.com.bd"
  },
  {
    organization: "ifb.teletalk.com.bd",
    position: "Office Assistant-Cum-Computer Typist",
    portalUsername: "SKM7CPJQ",
    portalPassword: "Z636494N",
    status: "Rejected",
    appliedDate: new Date("2025-08-26"),
    notes: "Absent",
    jobUrl: "https://ifb.teletalk.com.bd/"
  },
  {
    organization: "dotr.teletalk.com.bd",
    position: "Office Assistant cum-Computer Typist",
    portalUsername: "7ZLY9D2H",
    portalPassword: "F553765V",
    status: "Rejected",
    appliedDate: new Date("2025-08-31"),
    notes: "Absent",
    jobUrl: "http://dotr.teletalk.com.bd/"
  },
  {
    organization: "bjri.teletalk.com.bd",
    position: "Junior Field Assistant (Permanent)",
    portalUsername: "BJAHZ5P4",
    portalPassword: "B964273L",
    status: "Applied",
    appliedDate: new Date("2025-09-02"),
    jobUrl: "https://bjri.teletalk.com.bd/"
  },
  {
    organization: "dper.teletalk.com.bd",
    position: "Office Assistant Cum Computer Typist",
    portalUsername: "TSA5JDPZ",
    portalPassword: "X839495P",
    status: "Interview",
    appliedDate: new Date("2025-09-21"),
    notes: "Exam: 17 January 26",
    jobUrl: "https://dper.teletalk.com.bd/"
  },
  {
    organization: "ptd.teletalk.com.bd",
    position: "Office Assistant Cum Computer Typist",
    portalUsername: "TR329XK5",
    portalPassword: "E594238X",
    status: "Interview",
    appliedDate: new Date("2025-09-25"),
    notes: "Exam: 17 January 26",
    jobUrl: "https://ptd.teletalk.com.bd/ptd_2025/"
  },
  {
    organization: "dcsirajganj.teletalk.com.bd",
    position: "Office Assistant Cum Computer Typist",
    portalUsername: "KH5QZMC8",
    portalPassword: "F376989M",
    status: "Applied",
    appliedDate: new Date("2025-09-26"),
    jobUrl: "https://dcsirajganj.teletalk.com.bd/"
  },
  {
    organization: "dcsirajganj (V4)",
    position: "Office Support Staff",
    portalUsername: "5ZXKSP2G",
    portalPassword: "NRNTEPBS",
    status: "Applied",
    appliedDate: new Date("2025-10-17"),
    jobUrl: "https://dcsirajganj.teletalk.com.bd/dcsirajganjV4"
  },
  {
    organization: "BPSC",
    position: "Junior Instructor (Tech) [Farm Machinery]",
    portalUsername: "J566262K",
    portalPassword: "S0632816",
    status: "Applied",
    deadline: "26 Oct 2025",
    notes: "Gender: M",
    jobUrl: "http://bpsc.teletalk.com.bd/ncad/"
  },
  {
    organization: "bpdb.teletalk.com.bd",
    position: "Helper (সাহায্যকারী)",
    portalUsername: "8JQ7KGMD",
    portalPassword: "B895737E",
    status: "Applied",
    jobUrl: "https://bpdb.teletalk.com.bd/bpdb25V3/"
  },
  {
    organization: "bjsccr.teletalk.com.bd",
    position: "Office Assistant-Cum-Computer Typist",
    portalUsername: "XZM2EFJA",
    portalPassword: "XBBY9TFL",
    status: "Applied",
    appliedDate: new Date("2025-12-02"),
    jobUrl: "http://bjsccr.teletalk.com.bd/"
  },
  {
    organization: "dter.teletalk.com.bd",
    position: "Office Assistant Cum Computer Typist",
    portalUsername: "SPZWUYVT",
    portalPassword: "G456395D",
    status: "Applied",
    jobUrl: "https://dter.teletalk.com.bd/dter_2025/"
  },
  {
    organization: "bsri.teletalk.com.bd",
    position: "Scientific Assistant",
    portalUsername: "ALMK75ET",
    portalPassword: "KXATM6G K",
    status: "Applied",
    appliedDate: new Date("2025-12-09"),
    jobUrl: "https://bsri.teletalk.com.bd/"
  },
  {
    organization: "ddmr.teletalk.com.bd",
    position: "Office Assistant-Cum-Computer Typist",
    portalUsername: "S6NFDMLT",
    portalPassword: "7GHOSAN B",
    status: "Applied",
    deadline: "10/01/2026",
    jobUrl: "https://ddmr.teletalk.com.bd/"
  }
];

async function seed() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGODB_URI!, { bufferCommands: false });
    
    // 1. FIND YOUR USER
    // REPLACE THIS EMAIL WITH YOUR ACTUAL LOGIN EMAIL
    const TARGET_EMAIL = "dsxspa@gmail.com"; 
    
    const user = await User.findOne({ email: TARGET_EMAIL });
    if (!user) {
      console.error(`User with email ${TARGET_EMAIL} not found! Register first.`);
      process.exit(1);
    }
    console.log(`Found user: ${user.email} (${user._id})`);

    // 2. INSERT JOBS
    const jobsWithUser = oldJobs.map(job => ({
      ...job,
      userId: user._id,
      deadline: job.deadline || "Unknown",
    }));

    console.log(`Inserting ${jobsWithUser.length} old jobs...`);
    await Job.insertMany(jobsWithUser);
    
    console.log("✅ Success! All old PDF data has been imported.");
    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);
    process.exit(1);
  }
}

seed();