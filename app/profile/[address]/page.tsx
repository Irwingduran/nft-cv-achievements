import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DatabaseService } from '@/lib/database'

interface ProfilePageProps {
  params: {
    address: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { address } = params
  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  
  // Fetch real data from the database
  const achievements = typeof window !== 'undefined' ? DatabaseService.getUserAchievements(address) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <Trophy className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Achievement Portfolio
            </h1>
            <p className="text-gray-600">
              Wallet: <code className="bg-gray-100 px-2 py-1 rounded">{formatAddress(address)}</code>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {achievements.length} Achievement{achievements.length !== 1 ? 's' : ''} Verified
            </p>
          </header>

          {achievements.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
                <p className="text-gray-600">
                  This wallet hasn't minted any achievement NFTs yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {achievements.map((achievement) => (
                <Card key={achievement.tokenId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <Badge variant="secondary">Verified NFT</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700">
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
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://mumbai.polygonscan.com/tx/${achievement.transactionHash}`, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Verify on Blockchain
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
