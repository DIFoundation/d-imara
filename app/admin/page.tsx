"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BlockchainTestPanel from "@/components/test-utilities/blockchain-test-panel"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel (Dev Only)</h1>
          <p className="text-gray-600">Testing and debugging utilities</p>
        </div>

        <BlockchainTestPanel />

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Supabase Connected:</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex justify-between">
              <span>Blockchain RPC:</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex justify-between">
              <span>Contracts Deployed:</span>
              <span className="text-yellow-600">Check .env</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="https://explorer.camp.io"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              Camp Network Explorer
            </a>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              Supabase Dashboard
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline"
            >
              Vercel Dashboard
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
