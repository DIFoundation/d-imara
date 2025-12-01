"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In production, authenticate with backend
      // For MVP, redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-2xl font-bold text-[#0076B5] mb-2">D-Imara</div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login to your account and continue learning</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#03045E]">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[#8FDFEE] focus:border-[#0076B5] focus:ring-[#0076B5]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#03045E]">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#8FDFEE] focus:border-[#0076B5] focus:ring-[#0076B5]"
              />
            </div>

            <Button type="submit" className="w-full bg-[#0076B5] hover:bg-[#00B3D7] text-white" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-[#03045E]">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-[#0076B5] hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
