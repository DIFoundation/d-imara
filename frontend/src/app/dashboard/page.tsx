"use client"

import { useState } from "react"
import StudentDashboard from "@/components/dashboards/student-dashboard"
import TeacherDashboard from "@/components/dashboards/teacher-dashboard"
import DonorDashboard from "@/components/dashboards/donor-dashboard"
import Header from "@/components/Header"
import { useRouter } from "next/navigation"
import { useConnection } from "wagmi"

export default function HomePage() {
  const [userRole, setUserRole] = useState<"student" | "teacher" | "donor">("student")
  const router = useRouter()
  const { isConnected } = useConnection()

  if (!isConnected) {
    router.push("/")    
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50">
      {/* Navigation */}
     <Header userRole={userRole} setUserRole={setUserRole} />

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === "student" && <StudentDashboard />}
        {userRole === "teacher" && <TeacherDashboard />}
        {userRole === "donor" && <DonorDashboard />}
      </div>
    </div>
  )
}
