"use client"

import { useState } from "react"
import { useConnection } from "wagmi"
import { useRouter } from "next/navigation"
import { BookOpen, Award, Gift, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"

export default function HomePage() {
  const [userRole, setUserRole] = useState<"student" | "teacher" | "donor">("student")
  const router = useRouter()
  const { isConnected } = useConnection()

  if (isConnected) {
    router.push("/dashboard")    
  }

  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Learning",
      description: "Engaging quizzes and lessons adapted to your learning pace."
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Gamified Progress",
      description: "Unlock tiers, earn badges, and compete on leaderboards."
    },
    {
      icon: <Gift className="w-8 h-8 text-blue-600" />,
      title: "Real Rewards",
      description: "Earn education credits redeemable for books, fees, and supplies."
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-600" />,
      title: "Transparent Impact",
      description: "Donors see exactly how their contributions help students."
    }
  ]

  const stats = [
    { value: "50+", label: "Students Learning" },
    { value: "300+", label: "Quizzes Completed" },
    { value: "10+", label: "Blockchain Credits" }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Header userRole={userRole} setUserRole={setUserRole} />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-50 to-cyan-50 grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Learn, <span className="text-blue-600">Earn</span> and Transform
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                D-Imara connects African students with quality education and transparent funding through gamified learning and blockchain rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-lg">
                  Start Learning
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 py-6 px-8 text-lg">
                  View Dashboard
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-blue-100 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-24 h-32 bg-blue-${i}00 rounded-lg`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-4xl font-bold mb-2">{stat.value}</span>
                <span className="text-blue-200">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
