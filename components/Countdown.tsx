"use client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function Countdown({ deadlineStr }: { deadlineStr: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  // Helper: Parse various date formats
  const parseDate = (str: string) => {
    if (!str) return null;

    // 1. Try Standard Date first (e.g., "28 Feb 2026")
    let date = new Date(str);
    if (!isNaN(date.getTime())) return date;

    // 2. Handle DD/MM/YYYY Format (e.g., "15/03/2026, 05:00 PM")
    // Regex looks for: 15/03/2026
    const ddmmyyyy = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    
    if (ddmmyyyy) {
      const day = ddmmyyyy[1];
      const month = ddmmyyyy[2];
      const year = ddmmyyyy[3];
      
      // Convert to "YYYY-MM-DD" which JS likes
      // Also keep the time part if it exists
      const timePart = str.split(',')[1] || ''; 
      const isoString = `${year}-${month}-${day} ${timePart}`;
      
      date = new Date(isoString);
      if (!isNaN(date.getTime())) return date;
    }

    return null;
  };

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = parseDate(deadlineStr);
      
      if (!targetDate) {
        setTimeLeft("Invalid Date");
        return;
      }

      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000); 
    return () => clearInterval(timer);
  }, [deadlineStr]);

  if (isExpired) return <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-1 rounded">Expired</span>;

  return (
    <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full animate-pulse">
      <Clock size={12} />
      {timeLeft}
    </div>
  );
}