<div align="center">

  <h1>🚀 Personal JobTracker</h1>
  
  <p>
    <strong>A Smart, Automated Dashboard for Government & NGO Job Applications.</strong>
  </p>

  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
    </a>
    <a href="https://www.mongodb.com">
      <img src="https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb" alt="MongoDB" />
    </a>
    <a href="https://cloudinary.com">
      <img src="https://img.shields.io/badge/Cloudinary-Storage-blue?style=flat-square&logo=cloudinary" alt="Cloudinary" />
    </a>
    <a href="https://ui.shadcn.com">
      <img src="https://img.shields.io/badge/UI-ShadCN-white?style=flat-square&logo=shadcnui" alt="ShadCN" />
    </a>
  </p>

  <br />
</div>

---

## 🧐 The Problem
Applying for jobs in Bangladesh (Teletalk, Government, NGOs) involves managing dozens of URLs, user IDs, passwords, and PDF circulars. 
* **Links expire.**
* **PDFs get deleted.**
* **Deadlines are missed.**
* **Credentials get lost.**

## 💡 The Solution
**JobTracker** is a personal fortress for my career applications. It doesn't just "list" jobs—it **actively captures** them. 

Simply paste a URL, and the system:
1.  🕷️ **Scrapes** the deadline and position automatically.
2.  ☁️ **Downloads** the advertisement PDF and permanently saves it to Cloud Storage (so I never lose it even if the circular is removed).
3.  ⏳ **Tracks** deadlines with a live countdown.
4.  🔐 **Secures** my credentials (User/Pass) once I apply.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🤖 Auto-Scraper** | Paste a Teletalk link, and it auto-fetches the *Organization Name*, *Deadline*, and *Position*. |
| **📄 PDF Archiving** | Automatically detects the "Advertisement PDF" link, downloads it, and uploads it to **Cloudinary** for permanent safe-keeping. |
| **⏱️ Deadline Logic** | Shows a **live countdown** (e.g., "2 days left"). Auto-calculates expiry status. |
| **🔐 Credential Vault** | Securely stores `User ID` and `Password` for each specific job *after* application. |
| **📊 Smart Status** | Visual pipeline: `Pending` → `Applied` → `Interview` → `Rejected`. |
| **🔎 Notes & Search** | Add exam results, marks, or personal notes (e.g., *"Exam Date: 25th Nov"*). |

---

## 🛠️ Tech Stack & Architecture

This project is built on the **MERN** stack (modified for Serverless) with a focus on automation.

### **Core**
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/)

### **Automation & Storage**
* **Scraper:** `Cheerio` + `Axios` (Server-side parsing of HTML).
* **Storage:** `Cloudinary API` (Server-side upload of scraped PDFs).
* **Security:** `Bcrypt` hashing + Environment Variable protection.

---
