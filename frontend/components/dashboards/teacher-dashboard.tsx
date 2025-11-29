"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle } from "lucide-react"

export default function TeacherDashboard() {
  const [pendingVerifications] = useState([
    { id: 1, name: "Alice Johnson", schoolId: "S001", guardianPhone: "0801234567", status: "pending" },
    { id: 2, name: "Bob Smith", schoolId: "S002", guardianPhone: "0802345678", status: "pending" },
  ])

  const [activeStudents] = useState([
    { id: 1, name: "John Doe", tier: "Silver", points: 85, quizzes: 5, avgScore: 78 },
    { id: 2, name: "Jane Smith", tier: "Bronze", points: 45, quizzes: 3, avgScore: 72 },
    { id: 3, name: "Bob Wilson", tier: "Gold", points: 150, quizzes: 8, avgScore: 88 },
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl">Teacher Admin Panel</CardTitle>
          <CardDescription className="text-blue-100">Manage student enrollments and verify performance</CardDescription>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activeStudents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingVerifications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Credits Released</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₦5,000</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="verifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
          <TabsTrigger value="students">Active Students</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Enrollments</CardTitle>
              <CardDescription>Review and approve student enrollments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingVerifications.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-600">ID: {student.schoolId}</p>
                    <p className="text-sm text-gray-600">Guardian: {student.guardianPhone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>View verified students and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Tier</th>
                      <th className="text-left p-3 font-medium">Points</th>
                      <th className="text-left p-3 font-medium">Quizzes</th>
                      <th className="text-left p-3 font-medium">Avg Score</th>
                      <th className="text-left p-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {activeStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="p-3">{student.name}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              student.tier === "Gold"
                                ? "bg-yellow-100 text-yellow-800"
                                : student.tier === "Silver"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {student.tier}
                          </span>
                        </td>
                        <td className="p-3">{student.points}</td>
                        <td className="p-3">{student.quizzes}</td>
                        <td className="p-3">{student.avgScore}%</td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Approve Tier Bonus */}
          <Card>
            <CardHeader>
              <CardTitle>Approve Tier Bonuses</CardTitle>
              <CardDescription>Release education credits for students who reached tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeStudents
                .filter((s) => ["Silver", "Gold"].includes(s.tier))
                .map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {student.name} reached {student.tier} Tier
                      </p>
                      <p className="text-sm text-gray-600">
                        Release ₦{student.tier === "Gold" ? "2000" : "1000"} in education credits
                      </p>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Approve Release
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
