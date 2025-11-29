"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function BlockchainTestPanel() {
  const [studentAddress, setStudentAddress] = useState("")
  const [points, setPoints] = useState("10")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testAwardCredits = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/blockchain/award-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentAddress,
          points: Number.parseInt(points),
        }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const testPoolStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/blockchain/pool-stats")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  if (process.env.NODE_ENV !== "development") return null

  return (
    <Card className="border-yellow-400 bg-yellow-50">
      <CardHeader>
        <CardTitle>Blockchain Test Panel (Dev Only)</CardTitle>
        <CardDescription>Test blockchain integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Student Address</label>
          <Input placeholder="0x..." value={studentAddress} onChange={(e) => setStudentAddress(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Points</label>
          <Input type="number" value={points} onChange={(e) => setPoints(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <Button onClick={testAwardCredits} disabled={isLoading || !studentAddress} className="bg-green-600">
            Test Award Credits
          </Button>
          <Button onClick={testPoolStats} disabled={isLoading} variant="outline">
            Get Pool Stats
          </Button>
        </div>

        {result && (
          <div className="mt-4 p-3 bg-white border rounded">
            <pre className="text-xs overflow-auto max-h-48">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
