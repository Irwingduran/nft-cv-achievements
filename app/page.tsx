'use client'

import { useState } from 'react'
import { ConnectWallet } from '@/components/connect-wallet'
import { AchievementForm } from '@/components/achievement-form'
import { Dashboard } from '@/components/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trophy, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">AchieveChain</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your achievements into verifiable NFTs with AI-powered professional descriptions
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          <ConnectWallet onConnectionChange={setIsConnected} />
          
          {!isConnected ? (
            <div className="mt-12">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <Trophy className="h-8 w-8 text-indigo-600 mb-2" />
                    <CardTitle>Record Achievements</CardTitle>
                    <CardDescription>
                      Document your hackathons, courses, projects, and professional milestones
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Zap className="h-8 w-8 text-indigo-600 mb-2" />
                    <CardTitle>AI-Powered Descriptions</CardTitle>
                    <CardDescription>
                      Generate professional, resume-ready descriptions using advanced AI
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Shield className="h-8 w-8 text-indigo-600 mb-2" />
                    <CardTitle>Blockchain Verification</CardTitle>
                    <CardDescription>
                      Mint your achievements as NFTs for permanent, verifiable proof
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
              
              <Card className="text-center p-8">
                <CardContent>
                  <h3 className="text-2xl font-semibold mb-4">Get Started</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your wallet to begin creating and minting your achievement NFTs
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Tabs defaultValue="create" className="mt-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Achievement</TabsTrigger>
                <TabsTrigger value="dashboard">My Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="create">
                <AchievementForm />
              </TabsContent>
              
              <TabsContent value="dashboard">
                <Dashboard />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}
