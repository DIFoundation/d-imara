"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import StudentDashboard from "@/components/dashboards/student-dashboard"
import TeacherDashboard from "@/components/dashboards/teacher-dashboard"
import DonorDashboard from "@/components/dashboards/donor-dashboard"

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<"student" | "teacher" | "donor">("student")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">D-Imara</h1>
            <div className="flex gap-2">
              <Button
                variant={userRole === "student" ? "default" : "ghost"}
                onClick={() => setUserRole("student")}
                className={userRole === "student" ? "bg-green-600" : ""}
              >
                Student
              </Button>
              <Button
                variant={userRole === "teacher" ? "default" : "ghost"}
                onClick={() => setUserRole("teacher")}
                className={userRole === "teacher" ? "bg-green-600" : ""}
              >
                Teacher
              </Button>
              <Button
                variant={userRole === "donor" ? "default" : "ghost"}
                onClick={() => setUserRole("donor")}
                className={userRole === "donor" ? "bg-green-600" : ""}
              >
                Donor
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === "student" && <StudentDashboard />}
        {userRole === "teacher" && <TeacherDashboard />}
        {userRole === "donor" && <DonorDashboard />}
      </div>
    </div>
  )
}
