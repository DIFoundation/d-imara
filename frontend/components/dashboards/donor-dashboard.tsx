"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Heart, TrendingUp, Users, Zap } from "lucide-react"

export default function DonorDashboard() {
  const impactData = [
    { month: "Week 1", students: 10, credits: 5000 },
    { month: "Week 2", students: 25, credits: 12000 },
    { month: "Week 3", students: 40, credits: 20000 },
    { month: "Week 4", students: 50, credits: 30000 },
  ]

  const transactionHistory = [
    { id: 1, student: "John Doe", amount: "₦1,000", date: "Nov 20", type: "Silver Tier" },
    { id: 2, student: "Jane Smith", amount: "₦1,000", date: "Nov 19", type: "Silver Tier" },
    { id: 3, student: "Bob Wilson", amount: "₦2,000", date: "Nov 18", type: "Gold Tier" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-linear-to-r from-[#0076B5] to-[#00B3D7] text-white border-0">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Heart className="w-8 h-8" />
            Impact Dashboard
          </CardTitle>
          <CardDescription className="text-blue-100">
            See how your donations are transforming education
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#03045E]">
              <Users className="w-4 h-4 text-[#0076B5]" />
              Students Helped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0076B5]">50</div>
            <p className="text-xs text-gray-500 mt-2">+10 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#03045E]">Total Donated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00B3D7]">₦30,000</div>
            <p className="text-xs text-gray-500 mt-2">Test tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#03045E]">
              <Zap className="w-4 h-4 text-[#0076B5]" />
              Credits Released
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#8FDFEE]">₦30,000</div>
            <p className="text-xs text-gray-500 mt-2">To verified students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#03045E]">
              <TrendingUp className="w-4 h-4 text-[#0076B5]" />
              Avg Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00B3D7]">+20%</div>
            <p className="text-xs text-gray-500 mt-2">Student scores</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="impact" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students Helped Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education Credits Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="credits" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Blockchain Transactions</CardTitle>
              <CardDescription>All transactions on Camp Network Testnet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactionHistory.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{tx.student}</p>
                      <p className="text-sm text-gray-600">
                        {tx.type} reward - {tx.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{tx.amount}</p>
                      <Button size="sm" variant="link" className="text-xs">
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donate to Fund Pool</CardTitle>
              <CardDescription>Your donation will be distributed to verified students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (Test Tokens)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border rounded-lg"
                  defaultValue="5000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">School</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>School A (Rural Lagos)</option>
                  <option>School B (Rural Ibadan)</option>
                  <option>School C (Rural Abuja)</option>
                </select>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Heart className="w-4 h-4 mr-2" />
                Make Donation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
