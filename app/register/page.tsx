"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState(""); // <--- New State
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, secretCode }), // <--- Send Code
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/login");
    } else {
      setError(data.message || "Registration Failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96 space-y-4">
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <Lock />
          <h1 className="text-2xl font-bold">Private Access</h1>
        </div>
        
        {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <Input 
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <Input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        
        {/* SECRET CODE INPUT */}
        <Input 
          type="password" 
          placeholder="Enter Secret Registration Code" 
          onChange={(e) => setSecretCode(e.target.value)} 
          className="border-orange-300 focus:border-orange-500"
          required
        />

        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
          Secure Sign Up
        </Button>
      </form>
    </div>
  );
}