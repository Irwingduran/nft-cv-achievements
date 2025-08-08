'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Download, Share2, Trophy } from 'lucide-react'
import { toast } from 'sonner'

interface Achievement {
  tokenId: string
  name: string
  description: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  transactionHash: string
  mintedAt: string
}

export function Dashboard() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load achievements from localStorage
    const stored = localStorage.getItem('achievements')
    if (stored) {
      setAchievements(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/0x1234567890abcdef`
    await navigator.clipboard.writeText(profileUrl)
    toast.success('Profile link copied to clipboard!')
  }

  const downloadPDF = async (tokenId: string) => {
    const achievement = achievements.find(a => a.tokenId === tokenId)
    if (!achievement) return

    // Create a simple HTML certificate
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Achievement Certificate</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
            .certificate { border: 3px solid #4f46e5; padding: 40px; border-radius: 10px; }
            .title { font-size: 24px; font-weight: bold; color: #4f46e5; margin-bottom: 20px; }
            .description { margin: 20px 0; line-height: 1.6; }
            .attributes { margin: 20px 0; }
            .attribute { display: inline-block; margin: 5px; padding: 5px 10px; background: #f3f4f6; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="title">🏆 Achievement Certificate</div>
            <h2>${achievement.name}</h2>
            <div class="description">${achievement.description}</div>
            <div class="attributes">
              ${achievement.attributes.map(attr => `<span class="attribute">${attr.trait_type}: ${attr.value}</span>`).join('')}
            </div>
            <p><strong>Token ID:</strong> #${achievement.tokenId}</p>
            <p><strong>Verified on Blockchain</strong></p>
          </div>
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `achievement-${tokenId}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Certificate downloaded!')
  }

  const openBlockExplorer = (hash: string) => {
    window.open(`https://mumbai.polygonscan.com/tx/${hash}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    )
  }

  if (achievements.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first achievement NFT!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Achievements ({achievements.length})</h2>
        <Button onClick={shareProfile} variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {achievements.map((achievement) => (
          <Card key={achievement.tokenId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{achievement.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Token ID: #{achievement.tokenId}</p>
                </div>
                <Badge variant="secondary">NFT</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 line-clamp-3">
                {achievement.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {achievement.attributes.map((attr, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {attr.trait_type}: {attr.value}
                  </Badge>
                ))}
              </div>
              
              <div className="text-xs text-gray-500">
                Minted: {new Date(achievement.mintedAt).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openBlockExplorer(achievement.transactionHash)}
                  className="flex-1"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  View on Explorer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadPDF(achievement.tokenId)}
                  className="flex-1"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
