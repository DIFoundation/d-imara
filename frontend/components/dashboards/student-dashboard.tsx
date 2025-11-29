"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Award, Wallet, BookOpen, TrendingUp } from "lucide-react"

export default function StudentDashboard() {
  const [studentData] = useState({
    name: "John Doe",
    learningPoints: 85,
    tier: "Silver",
    totalQuizzes: 5,
    avgScore: 78,
    balance: 1000,
  })

  const tierThresholds = {
    Bronze: { min: 0, max: 50, color: "bg-gray-400" },
    Silver: { min: 51, max: 100, color: "bg-gray-300" },
    Gold: { min: 101, max: 200, color: "bg-yellow-400" },
  }

  const currentTier = tierThresholds[studentData.tier as keyof typeof tierThresholds]
  const progressPercent = ((studentData.learningPoints - currentTier.min) / (currentTier.max - currentTier.min)) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, {studentData.name}!</CardTitle>
          <CardDescription className="text-green-100">Keep learning and earning rewards</CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Learning Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{studentData.learningPoints}</div>
            <p className="text-xs text-gray-500 mt-2">Points earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Award className="w-4 h-4" />
              Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{studentData.tier}</div>
            <p className="text-xs text-gray-500 mt-2">Achievement level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Quizzes Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{studentData.totalQuizzes}</div>
            <p className="text-xs text-gray-500 mt-2">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Wallet className="w-4 h-4" />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₦{studentData.balance}</div>
            <p className="text-xs text-gray-500 mt-2">Credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Progress</CardTitle>
          <CardDescription>
            {studentData.learningPoints} / {currentTier.max} points to next tier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">🥉</div>
                <p className="text-xs text-gray-600">Bronze</p>
                <p className="text-xs">0-50</p>
              </div>
              <div className={`text-center ${studentData.tier === "Silver" ? "opacity-100" : "opacity-50"}`}>
                <div className="text-2xl font-bold">🥈</div>
                <p className="text-xs text-gray-600">Silver</p>
                <p className="text-xs">51-100</p>
              </div>
              <div className={`text-center ${studentData.tier === "Gold" ? "opacity-100" : "opacity-50"}`}>
                <div className="text-2xl font-bold">🏆</div>
                <p className="text-xs text-gray-600">Gold</p>
                <p className="text-xs">101-200</p>
              </div>
            </div>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quizzes">
            <BookOpen className="w-4 h-4 mr-2" />
            Quizzes
          </TabsTrigger>
          <TabsTrigger value="progress">
            <TrendingUp className="w-4 h-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="wallet">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Quizzes</CardTitle>
              <CardDescription>Take quizzes to earn points and unlock rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Math Fundamentals", "English Grammar", "Science Basics"].map((quiz, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{quiz}</p>
                    <p className="text-sm text-gray-600">Earn 10 points</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Start
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Average Score</p>
                  <Progress value={studentData.avgScore} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">{studentData.avgScore}%</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Recent Activity</p>
                  <div className="space-y-2 text-sm">
                    <p>✓ Completed Math Fundamentals (Score: 85%)</p>
                    <p>✓ Earned Silver Tier Badge</p>
                    <p>✓ Received 1000 ₦ in education credits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Education Wallet</CardTitle>
              <CardDescription>View and manage your education credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
                <p className="text-sm opacity-80">Available Balance</p>
                <p className="text-4xl font-bold">₦{studentData.balance}</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Approved Uses</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span>📚 School Books</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span>💰 School Fees</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span>✏️ School Supplies</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
