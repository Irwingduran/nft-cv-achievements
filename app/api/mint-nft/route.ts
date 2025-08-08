import { NextRequest, NextResponse } from 'next/server'
import { IPFSService } from '@/lib/ipfs'
import { DatabaseService } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { title, type, date, technologies, role, description, userAddress } = await request.json()

    // Create NFT metadata
    const metadata = {
      name: title,
      description: description,
      attributes: [
        { trait_type: "Type", value: type },
        { trait_type: "Role", value: role },
        { trait_type: "Technologies", value: technologies.join(", ") },
        { trait_type: "Date", value: new Date(date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }) }
      ]
    }

    // Upload metadata to IPFS
    const ipfsService = IPFSService.getInstance()
    const ipfsHash = await ipfsService.uploadMetadata(metadata)
    const tokenURI = ipfsService.getIPFSUrl(ipfsHash)

    // For demo purposes, simulate blockchain interaction
    // In production, this would interact with the smart contract
    const simulatedResponse = {
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      tokenId: Math.floor(Math.random() * 10000).toString(),
      ipfsHash,
      tokenURI,
      metadata
    }

    // Store in local database
    const achievement = {
      tokenId: simulatedResponse.tokenId,
      name: title,
      description,
      attributes: metadata.attributes,
      transactionHash: simulatedResponse.transactionHash,
      mintedAt: new Date().toISOString(),
      owner: userAddress,
      ipfsHash
    }

    DatabaseService.saveAchievement(achievement)
    
    return NextResponse.json(simulatedResponse)
  } catch (error) {
    console.error('Error minting NFT:', error)
    return NextResponse.json(
      { error: 'Failed to mint NFT' },
      { status: 500 }
    )
  }
}
