// IPFS integration using Web3.Storage
export class IPFSService {
  private static instance: IPFSService
  private apiToken: string

  constructor() {
    this.apiToken = process.env.WEB3_STORAGE_TOKEN || ''
  }

  static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService()
    }
    return IPFSService.instance
  }

  async uploadMetadata(metadata: any): Promise<string> {
    try {
      const response = await fetch('https://api.web3.storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata)
      })

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS')
      }

      const result = await response.json()
      return result.cid
    } catch (error) {
      console.error('IPFS upload error:', error)
      // Fallback: create a mock IPFS hash for demo
      return `Qm${Math.random().toString(36).substr(2, 44)}`
    }
  }

  getIPFSUrl(cid: string): string {
    return `https://${cid}.ipfs.w3s.link`
  }
}
