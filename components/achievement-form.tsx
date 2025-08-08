'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Wand2, RefreshCw, Coins } from 'lucide-react'
import { toast } from 'sonner'

interface AchievementData {
  title: string
  description: string
  type: string
  date: string
  role: string
  technologies: string[]
  proofLink: string
  participantName: string
  imageUrl: string
  walletAddress: string
  comment: string
}

const achievementTypes = [
  'Hackathon',
  'Workshop',
  'Course',
  'Project',
  'Certification',
  'Competition',
  'Conference',
  'Internship'
]

const descriptionStyles = [
  { value: 'professional', label: 'Professional' },
  { value: 'technical', label: 'Technical' },
  { value: 'junior', label: 'Junior-Friendly' },
  { value: 'creative', label: 'Creative' }
]

// Mock AI responses for different styles
const mockAIResponses = {
  professional: "Successfully led a cross-functional team of 4 developers to secure first place in a competitive Web3 hackathon, demonstrating exceptional project management and technical leadership skills. Developed and deployed a comprehensive decentralized application using React and Solidity, showcasing proficiency in modern blockchain technologies and frontend development frameworks.",
  technical: "Architected and implemented a full-stack decentralized application utilizing React.js for the frontend interface, Solidity for smart contract development, and Web3.js for blockchain integration. Employed advanced smart contract patterns including proxy upgradability and gas optimization techniques, resulting in a 40% reduction in transaction costs compared to baseline implementations.",
  junior: "Participated in my first Web3 hackathon and successfully contributed to a winning team project, gaining hands-on experience with blockchain development and modern web technologies. Learned to work with React for building user interfaces and Solidity for creating smart contracts, while developing valuable teamwork and problem-solving skills in a fast-paced environment.",
  creative: "Embarked on an exhilarating 48-hour coding adventure that transformed innovative ideas into a prize-winning decentralized application. Collaborated with talented developers to weave together React's dynamic frontend capabilities with Solidity's blockchain magic, creating a solution that impressed judges and demonstrated the power of creative problem-solving in the Web3 space."
}

export function AchievementForm() {
  const [formData, setFormData] = useState<AchievementData>({
    title: '',
    description: '',
    type: '',
    date: '',
    role: '',
    technologies: [],
    proofLink: '',
    participantName: '',
    imageUrl: '',
    walletAddress: '',
    comment: ''
  })
  
  const [techInput, setTechInput] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [step, setStep] = useState<'form' | 'description'>('form')

  const addTechnology = (e: React.KeyboardEvent<HTMLInputElement> | null = null) => {
    if (e && e.key !== 'Enter' && e.key !== ',') return
    
    const techToAdd = techInput.trim()
    if (techToAdd && !formData.technologies.includes(techToAdd)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techToAdd]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const generateDescription = async () => {
    if (!formData.title || !formData.type || !formData.role) {
      toast.error('Please fill in the required fields')
      return
    }

    setIsGenerating(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const description = mockAIResponses[selectedStyle as keyof typeof mockAIResponses]
      setGeneratedDescription(description)
      setStep('description')
      setIsGenerating(false)
      toast.success('Description generated successfully!')
    }, 2000)
  }

  const regenerateDescription = async () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      const description = mockAIResponses[selectedStyle as keyof typeof mockAIResponses]
      setGeneratedDescription(description)
      setIsGenerating(false)
      toast.success('Description regenerated!')
    }, 1500)
  }

  const mintNFT = async () => {
    // Validate required fields
    if (!formData.walletAddress || !formData.walletAddress.startsWith('0x')) {
      toast.error('Please enter a valid wallet address')
      return
    }
    
    if (!formData.participantName) {
      toast.error('Please enter participant name')
      return
    }
    
    setIsMinting(true)
    
    // Simulate minting process
    setTimeout(() => {
      const tokenId = Math.floor(Math.random() * 10000).toString()
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      // Save to localStorage
      const achievement = {
        tokenId,
        name: formData.title,
        description: formData.description || generatedDescription,
        image: formData.imageUrl,
        external_url: formData.proofLink,
        attributes: [
          { trait_type: "Type", value: formData.type },
          { trait_type: "Role", value: formData.role },
          { trait_type: "Participant", value: formData.participantName },
          { trait_type: "Technologies", value: formData.technologies.join(", ") },
          { trait_type: "Date", value: new Date(formData.date).toLocaleDateString('es-MX', { 
            year: 'numeric', 
            month: 'long',
            day: 'numeric'
          }) }
        ],
        transactionHash: txHash,
        mintedAt: new Date().toISOString(),
        recipient: formData.walletAddress
      }
      
      const existing = JSON.parse(localStorage.getItem('achievements') || '[]')
      existing.push(achievement)
      localStorage.setItem('achievements', JSON.stringify(existing))
      
      toast.success(`NFT minted successfully! Token ID: ${tokenId}`)
      
      // Reset form
      setFormData({
        title: '',
        type: '',
        date: '',
        technologies: [],
        role: '',
        comment: ''
      })
      setGeneratedDescription('')
      setStep('form')
      setIsMinting(false)
    }, 3000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }))
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (step === 'form') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Record Your Achievement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título del logro *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ej. Participación en Hackathon BlockchainMX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participantName">Nombre del participante *</Label>
            <Input
              id="participantName"
              value={formData.participantName}
              onChange={(e) => setFormData(prev => ({ ...prev, participantName: e.target.value }))}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción breve *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Máx. 300 caracteres explicando el contexto del logro"
              maxLength={300}
              rows={3}
              required
            />
            <p className="text-sm text-muted-foreground text-right">
              {formData.description.length}/300 caracteres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de logro *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {achievementTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha del logro *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rol desempeñado *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="Ej. Desarrollador Frontend, Diseñador UX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Technologies Used</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology"
                onKeyDown={(e) => e.key === 'Enter' && addTechnology()}
              />
              <Button onClick={addTechnology} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.technologies.map(tech => (
                <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
                  {tech} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proofLink">Enlace comprobatorio</Label>
            <Input
              id="proofLink"
              type="url"
              value={formData.proofLink}
              onChange={(e) => setFormData(prev => ({ ...prev, proofLink: e.target.value }))}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Foto o logo (opcional)</Label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer border rounded-md p-2 hover:bg-accent transition-colors">
                <span className="text-sm">Subir imagen</span>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {imagePreview && (
                <div className="w-16 h-16 rounded-md overflow-hidden border">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Tamaño máximo: 2MB</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet address para recibir el NFT *</Label>
            <Input
              id="walletAddress"
              value={formData.walletAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
              placeholder="0x..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Esta es la dirección donde recibirás tu NFT de logro
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Personal Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Any additional details or personal reflections..."
              rows={3}
            />
          </div>

          <Button onClick={generateDescription} disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Description...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate AI Description
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === 'description') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Review Generated Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Description Style</Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {descriptionStyles.map(style => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Generated Description</Label>
            <Textarea
              value={generatedDescription}
              onChange={(e) => setGeneratedDescription(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={regenerateDescription} disabled={isGenerating} variant="outline" className="flex-1">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </>
              )}
            </Button>
            
            <Button onClick={mintNFT} disabled={isMinting} className="flex-1">
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting NFT...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Mint NFT
                </>
              )}
            </Button>
          </div>

          <Button onClick={() => setStep('form')} variant="ghost" className="w-full">
            Back to Form
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
