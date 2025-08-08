// Simple local storage database for demo purposes
export interface StoredAchievement {
  tokenId: string
  name: string
  description: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  transactionHash: string
  mintedAt: string
  owner: string
  ipfsHash: string
}

export class DatabaseService {
  private static STORAGE_KEY = 'achievements_db'

  static getAllAchievements(): StoredAchievement[] {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static getUserAchievements(address: string): StoredAchievement[] {
    return this.getAllAchievements().filter(
      achievement => achievement.owner.toLowerCase() === address.toLowerCase()
    )
  }

  static saveAchievement(achievement: StoredAchievement): void {
    if (typeof window === 'undefined') return

    const achievements = this.getAllAchievements()
    achievements.push(achievement)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(achievements))
  }

  static getAchievement(tokenId: string): StoredAchievement | null {
    const achievements = this.getAllAchievements()
    return achievements.find(a => a.tokenId === tokenId) || null
  }
}
