"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Users, TrendingUp, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">D-Imara</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Learn, Earn, Transform</h1>
          <p className="text-xl text-gray-600 mb-8">
            D-Imara connects African students with quality education and transparent funding through gamified learning
            and blockchain rewards.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up?role=student">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Learning
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <BookOpen className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">AI-Powered Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Engaging quizzes and lessons adapted to your learning pace</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-yellow-500 mb-2" />
              <CardTitle className="text-lg">Gamified Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Unlock tiers, earn badges, and compete on leaderboards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Real Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Earn education credits redeemable for books, fees, and supplies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Transparent Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Donors see exactly how their contributions help students</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-600 text-white py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <p>Students Learning</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">300+</div>
              <p>Quizzes Completed</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <p>Blockchain Credits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
