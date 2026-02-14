"use client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function Countdown({ deadlineStr }: { deadlineStr: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      // Parse "28 Feb 2026 11:59:00 PM"
      const targetDate = new Date(deadlineStr);
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
    const timer = setInterval(calculateTime, 60000); // Update every minute
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