"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "../components/Notification";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      showNotification(result.error, "error");
    } else {
      showNotification("Login successful!", "success");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black text-white p-8 rounded-xl shadow-md border-2">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="password"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Sign In
          </button>

          <p className="text-center text-sm mt-4 text-blue-100">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className=" hover:underline text-blue-600 cursor-pointer"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
