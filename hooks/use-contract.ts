'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { ContractService } from '@/lib/contract'

export function useContract() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [contractService, setContractService] = useState<ContractService | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initContract = async () => {
      if (isConnected && walletClient && address) {
        const service = new ContractService()
        const initialized = await service.initialize(walletClient)
        
        if (initialized) {
          setContractService(service)
          setIsInitialized(true)
        }
      } else {
        setContractService(null)
        setIsInitialized(false)
      }
    }

    initContract()
  }, [isConnected, walletClient, address])

  return {
    contractService,
    isInitialized,
    address
  }
}
