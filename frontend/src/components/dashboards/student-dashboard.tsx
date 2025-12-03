"use client"

import { useState } from "react"
import { useConnection } from "wagmi"
import { useBalance } from "wagmi"
// import { useOnChainStorage } from "@/lib/use-on-chain"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import QuizModal from "@/components/quiz-modal"

export default function StudentDashboard() {
  const { address } = useConnection()
  const { data: balanceData } = useBalance({ address: address })
  // const { balance } = useOnChainStorage()
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null)
  const [completed, setCompleted] = useState(0)
  const [stats, setStats] = useState({ rank: 0, totalPoints: 0, streak: 0 })

  const quizzes = [
    { id: 1, title: "Math Basics", reward: 10, difficulty: "Easy", category: "Math" },
    { id: 2, title: "Science 101", reward: 15, difficulty: "Medium", category: "Science" },
    { id: 3, title: "History", reward: 20, difficulty: "Hard", category: "History" },
    { id: 4, title: "English Grammar", reward: 12, difficulty: "Medium", category: "English" },
  ]

  return (
    <div className="space-y-6">
      {/* Student Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xs truncate">
              {address?.slice(0, 10)}...{address?.slice(-8)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{balanceData?.value} DMR</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">#{stats.rank}</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Quiz Completion</span>
              <span className="text-sm text-slate-600">
                {completed} / {quizzes.length}
              </span>
            </div>
            <Progress value={(completed / quizzes.length) * 100} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Total Points</span>
              <span className="text-sm text-slate-600">{stats.totalPoints}</span>
            </div>
            <Progress value={Math.min((stats.totalPoints / 100) * 100, 100)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Available Quizzes */}
      <div>
        <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <Badge className="bg-blue-600">{quiz.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-slate-600">
                    {quiz.difficulty}
                  </Badge>
                  <span className="font-bold text-blue-600">+{quiz.reward} DMR</span>
                </div>
                <Button
                  onClick={() => setSelectedQuiz(quiz.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Take Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quiz Modal */}
      {selectedQuiz && (
        <QuizModal
          quizId={selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onComplete={(points) => {
            setCompleted(completed + 1)
            setStats({
              ...stats,
              totalPoints: stats.totalPoints + points,
            })
            setSelectedQuiz(null)
          }}
        />
      )}
    </div>
  )
}
