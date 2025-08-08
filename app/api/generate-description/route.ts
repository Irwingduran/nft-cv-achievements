import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, type, date, technologies, role, comment, style } = await request.json()

    const stylePrompts = {
      professional: "Write in a professional, corporate tone suitable for LinkedIn or a formal resume.",
      technical: "Focus on technical details, methodologies, and specific technologies used.",
      junior: "Write in an accessible way that highlights learning and growth, suitable for entry-level positions.",
      creative: "Use engaging, creative language that tells a story about the achievement."
    }

    // Mock AI responses for different styles based on the input
    const mockResponses = {
      professional: `Successfully ${role.toLowerCase() === 'team lead' ? 'led a cross-functional team' : 'contributed as ' + role} in ${title.toLowerCase()}, demonstrating exceptional ${type.toLowerCase() === 'hackathon' ? 'project management and technical leadership' : 'technical and collaborative'} skills. Developed and deployed comprehensive solutions using ${technologies.slice(0, 2).join(' and ')}, showcasing proficiency in modern ${type.toLowerCase() === 'hackathon' ? 'blockchain technologies and frontend development frameworks' : 'development technologies and best practices'}.`,
      
      technical: `Architected and implemented ${title.toLowerCase()} utilizing ${technologies.slice(0, 3).join(', ')} for comprehensive development. Employed advanced ${type.toLowerCase() === 'hackathon' ? 'smart contract patterns and gas optimization techniques' : 'development patterns and optimization strategies'}, resulting in ${type.toLowerCase() === 'hackathon' ? '40% reduction in transaction costs' : 'improved performance and maintainability'} compared to baseline implementations.`,
      
      junior: `Participated in ${title.toLowerCase()} and successfully contributed as ${role}, gaining hands-on experience with ${technologies.slice(0, 2).join(' and ')}. Learned to work with modern development technologies while developing valuable teamwork and problem-solving skills in a ${type.toLowerCase() === 'hackathon' ? 'fast-paced competitive' : 'collaborative learning'} environment.`,
      
      creative: `Embarked on an ${type.toLowerCase() === 'hackathon' ? 'exhilarating coding adventure' : 'inspiring learning journey'} with ${title}, transforming innovative ideas into ${type.toLowerCase() === 'hackathon' ? 'a prize-winning solution' : 'practical knowledge and skills'}. Collaborated with talented individuals to weave together ${technologies.slice(0, 2).join(' and ')}, creating ${type.toLowerCase() === 'hackathon' ? 'a solution that impressed judges' : 'valuable learning experiences'} and demonstrated the power of creative problem-solving.`
    }

    const selectedResponse = mockResponses[style as keyof typeof mockResponses] || mockResponses.professional

    return NextResponse.json({ description: selectedResponse })
  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    )
  }
}
