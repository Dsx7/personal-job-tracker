import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers"; // <--- Import from your new file

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal JobTracker",
  description: "Automated job application tracking dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Use the Client Component wrapper here */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}