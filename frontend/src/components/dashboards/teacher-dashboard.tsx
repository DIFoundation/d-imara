"use client"

import { useState } from "react"
import { useConnection } from "wagmi"
// import { useOnChainStorage } from "@/lib/use-on-chain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function TeacherDashboard() {
  const { address } = useConnection()
  // const { client } = useOnChainStorage()
  const [quizzes] = useState([{ id: 1, title: "Math Basics", reward: 10, attempts: 5, creator: address }])
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "", reward: 10 })
  const [submitting, setSubmitting] = useState(false)

  const handleCreateQuiz = async () => {
    if (!newQuiz.title.trim() || !address) return

    setSubmitting(true)
    try {
      // const result = await client.createQuiz(address, newQuiz.title, newQuiz.reward)
      // if (result.success) {
      //   setQuizzes([
      //     ...quizzes,
      //     {
      //       id: Date.now(),
      //       title: newQuiz.title,
      //       reward: newQuiz.reward,
      //       attempts: 0,
      //       creator: address,
      //     },
      //   ])
      //   setNewQuiz({ title: "", description: "", reward: 10 })
      // }
    } finally {
      setSubmitting(false)
    }
  }

  const totalStudents = quizzes.reduce((sum, q) => sum + q.attempts, 0)

  return (
    <div className="space-y-6">
      {/* Teacher Stats */}
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
            <CardTitle className="text-sm text-slate-600">Quizzes Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{quizzes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Student Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-600">Avg Reward</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + q.reward, 0) / quizzes.length) : 0} DMR
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Quiz Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Quiz Title</label>
            <Input
              placeholder="Enter quiz title"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter quiz description"
              value={newQuiz.description}
              onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Reward (DMR Tokens)</label>
            <Input
              type="number"
              value={newQuiz.reward}
              onChange={(e) => setNewQuiz({ ...newQuiz, reward: Number.parseInt(e.target.value) })}
              disabled={submitting}
            />
          </div>
          <Button
            onClick={handleCreateQuiz}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? "Creating on-chain..." : "Create Quiz"}
          </Button>
        </CardContent>
      </Card>

      {/* Quizzes List */}
      {quizzes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Quizzes</h2>
          <div className="space-y-3">
            {/* eslint-disable-next-line */}
            {quizzes.map((quiz: any) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{quiz.title}</h3>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="secondary">
                          {quiz.attempts} {quiz.attempts === 1 ? "attempt" : "attempts"}
                        </Badge>
                        <Badge className="bg-blue-600">{quiz.reward} DMR</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
