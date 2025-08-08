'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, LogOut, Copy, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
      selectedAddress: string | null
      chainId: string | null
    }
  }
}

interface Chain {
  chainId: string
  name: string
}

const SUPPORTED_CHAINS: Record<string, Chain> = {
  '0x1': { chainId: '0x1', name: 'Ethereum Mainnet' },
  '0x5': { chainId: '0x5', name: 'Goerli Testnet' },
  '0xaa36a7': { chainId: '0xaa36a7', name: 'Sepolia Testnet' },
}

interface ConnectWalletProps {
  onConnectionChange: (connected: boolean) => void
  onAccountChange?: (account: string) => void
  onChainChange?: (chainId: string) => void
}

export function ConnectWallet({ 
  onConnectionChange, 
  onAccountChange,
  onChainChange 
}: ConnectWalletProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [chainId, setChainId] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  // Check if MetaMask is installed on component mount
  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
        setIsMetaMaskInstalled(true)
        
        // Set up event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)
        
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
          setAddress(accounts[0])
          setChainId(currentChainId)
          setIsConnected(true)
          onConnectionChange(true)
          onAccountChange?.(accounts[0])
          onChainChange?.(currentChainId)
        }
      }
      
      return () => {
        // Clean up event listeners
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
    
    checkMetaMask()
  }, [onAccountChange, onChainChange, onConnectionChange])

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      handleDisconnect()
    } else if (accounts[0] !== address) {
      setAddress(accounts[0])
      onAccountChange?.(accounts[0])
      toast.info('Account changed')
    }
  }

  const handleChainChanged = (newChainId: string) => {
    setChainId(newChainId)
    onChainChange?.(newChainId)
    window.location.reload() // Recommended by MetaMask docs
  }

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download.html', '_blank')
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum?.request({ 
        method: 'eth_requestAccounts' 
      }) as string[]
      
      if (accounts && accounts.length > 0) {
        const currentChainId = await window.ethereum?.request({ method: 'eth_chainId' }) as string
        setAddress(accounts[0])
        setChainId(currentChainId)
        setIsConnected(true)
        onConnectionChange(true)
        onAccountChange?.(accounts[0])
        onChainChange?.(currentChainId)
        toast.success('Wallet connected successfully!')
      }
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error)
      toast.error(error.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress('')
    setChainId('')
    onConnectionChange(false)
    onAccountChange?.('')
    onChainChange?.('')
    toast.success('Wallet disconnected')
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Wallet className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <CardTitle>Connect Your Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleConnect} 
            className="w-full" 
            size="lg"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
          {!isMetaMaskInstalled && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>MetaMask extension not detected</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Network:</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {SUPPORTED_CHAINS[chainId]?.name || `Chain ID: ${chainId}`}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Address:</span>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {formatAddress(address)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-8 w-8 p-0"
              title="Copy address"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Network:</span>
          <Badge variant="secondary">
            Polygon Mumbai
          </Badge>
        </div>
        
        <Button
          onClick={handleDisconnect}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </CardContent>
    </Card>
  )
}
