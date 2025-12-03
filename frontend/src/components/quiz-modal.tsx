"use client"

import { useState } from "react"
// import { useOnChainStorage } from "@/lib/use-on-chain"
import { getQuizById, calculateScore } from "@/lib/quiz-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface QuizModalProps {
  quizId: number
  onClose: () => void
  onComplete: (points: number) => void
}

export default function QuizModal({ quizId, onClose, onComplete }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [finished, setFinished] = useState(false)
  // eslint-disable-next-line
  const [result, setResult] = useState<any>(null)
  // const { recordScore } = useOnChainStorage()

  const quiz = getQuizById(quizId)
  if (!quiz) return null

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + (finished ? 1 : 0)) / quiz.questions.length) * 100

  const handleAnswer = (selectedIndex: number) => {
    const newAnswers = [...answers, selectedIndex]
    setAnswers(newAnswers)

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz complete - calculate score and submit
      submitQuiz(newAnswers)
    }
  }

  const submitQuiz = async (finalAnswers: number[]) => {
    setSubmitting(true)
    try {
      const { score, percentage, reward } = calculateScore(quiz, finalAnswers)

      // Record on-chain
      // const recordResult = await recordScore(quizId, score)

      setResult({
        score,
        percentage,
        reward,
        // txHash: recordResult.txHash,
        // success: recordResult.success,
      })
      setFinished(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = () => {
    if (result?.success) {
      onComplete(result.reward)
    } else {
      onClose()
    }
  }

  if (finished && result) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz Complete!</DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-5xl font-bold text-blue-600">{result.percentage.toFixed(0)}%</p>
                <p className="text-slate-600">
                  {result.score} out of {quiz.questions.length} correct
                </p>
              </div>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-600 mb-2">Reward Earned</p>
                  <p className="text-3xl font-bold text-green-600">+{result.reward} DMR</p>
                </CardContent>
              </Card>

              {result.success && (
                <div className="text-xs text-slate-500">
                  <p>Recorded on-chain</p>
                  <p className="font-mono truncate">{result.txHash}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Claim Reward
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={!finished} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{quiz.title}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
                <span className="text-slate-600">{progress.toFixed(0)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg font-medium leading-relaxed">{question.q}</p>

            <div className="space-y-2">
              {question.options.map((option: string, idx: number) => (
                <Button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={submitting}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-blue-50 border-slate-200"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-300 mr-3 text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </Button>
              ))}
            </div>

            {submitting && <div className="text-center text-sm text-slate-600">Recording score on-chain...</div>}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
