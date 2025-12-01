"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    schoolId: "",
    guardianPhone: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-2xl font-bold text-[#0076B5] mb-2">D-Imara</div>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join our learning community and start earning rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#03045E]">Full Name</label>
              <Input name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label className="text-sm font-medium text-[#03045E]">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#03045E]">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#03045E]">Role</label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher/Admin</SelectItem>
                  <SelectItem value="donor">Donor/NGO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "student" && (
              <>
                <div>
                  <label className="text-sm font-medium text-[#03045E]">School ID</label>
                  <Input
                    name="schoolId"
                    placeholder="e.g., SCHOOL001"
                    value={formData.schoolId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#03045E]">Guardian Phone Number</label>
                  <Input
                    name="guardianPhone"
                    placeholder="e.g., 08012345678"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-[#0076B5] hover:bg-[#00B3D7] text-white" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-[#03045E]">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0076B5] hover:underline font-medium">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
