"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.ok) router.push("/");
    else alert("Invalid login");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full">Sign In</Button>
        <p className="text-center text-sm">Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
      </form>
    </div>
  );
}