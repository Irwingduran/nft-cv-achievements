import { ethers } from 'ethers'

const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e' // Replace with your deployed contract
const CONTRACT_ABI = [
  "function mintAchievement(address to, string memory tokenURI, string memory title, string memory achievementType, string memory role, string memory technologies) public returns (uint256)",
  "function getUserAchievements(address user) public view returns (uint256[] memory)",
  "function getAchievement(uint256 tokenId) public view returns (tuple(string title, string achievementType, string role, string technologies, uint256 timestamp, address minter))",
  "function totalSupply() public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "event AchievementMinted(uint256 indexed tokenId, address indexed minter, string title, string achievementType)"
]

export class ContractService {
  private contract: ethers.Contract | null = null
  private signer: ethers.Signer | null = null

  async initialize(provider: any) {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider)
      this.signer = await ethersProvider.getSigner()
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer)
      return true
    } catch (error) {
      console.error('Failed to initialize contract:', error)
      return false
    }
  }

  async mintAchievement(
    to: string,
    tokenURI: string,
    title: string,
    achievementType: string,
    role: string,
    technologies: string
  ): Promise<{ transactionHash: string; tokenId: string }> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const tx = await this.contract.mintAchievement(
        to,
        tokenURI,
        title,
        achievementType,
        role,
        technologies
      )

      const receipt = await tx.wait()
      
      // Extract token ID from events
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log)
          return parsed?.name === 'AchievementMinted'
        } catch {
          return false
        }
      })

      let tokenId = '0'
      if (event) {
        const parsed = this.contract.interface.parseLog(event)
        tokenId = parsed?.args?.tokenId?.toString() || '0'
      }

      return {
        transactionHash: receipt.hash,
        tokenId
      }
    } catch (error) {
      console.error('Minting failed:', error)
      throw error
    }
  }

  async getUserAchievements(address: string): Promise<string[]> {
    if (!this.contract) return []

    try {
      const tokenIds = await this.contract.getUserAchievements(address)
      return tokenIds.map((id: any) => id.toString())
    } catch (error) {
      console.error('Failed to get user achievements:', error)
      return []
    }
  }
}
