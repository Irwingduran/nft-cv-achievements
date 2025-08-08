export class PDFGenerator {
  static async generateAchievementPDF(achievement: any): Promise<Blob> {
    // Create HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Achievement Certificate</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .certificate {
              background: white;
              padding: 60px;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              text-align: center;
            }
            .header {
              border-bottom: 3px solid #667eea;
              padding-bottom: 30px;
              margin-bottom: 40px;
            }
            .title {
              font-size: 36px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 18px;
              color: #666;
              margin-bottom: 30px;
            }
            .achievement-name {
              font-size: 28px;
              font-weight: bold;
              color: #667eea;
              margin: 30px 0;
              padding: 20px;
              border: 2px solid #667eea;
              border-radius: 10px;
            }
            .description {
              font-size: 16px;
              line-height: 1.6;
              color: #444;
              margin: 30px 0;
              text-align: left;
            }
            .attributes {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 30px 0;
            }
            .attribute {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              text-align: left;
            }
            .attribute-label {
              font-weight: bold;
              color: #333;
              margin-bottom: 5px;
            }
            .attribute-value {
              color: #666;
            }
            .verification {
              margin-top: 40px;
              padding-top: 30px;
              border-top: 2px solid #eee;
              font-size: 14px;
              color: #666;
            }
            .token-id {
              font-family: monospace;
              background: #f0f0f0;
              padding: 5px 10px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="title">🏆 Achievement Certificate</div>
              <div class="subtitle">Blockchain-Verified Professional Achievement</div>
            </div>
            
            <div class="achievement-name">${achievement.name}</div>
            
            <div class="description">${achievement.description}</div>
            
            <div class="attributes">
              ${achievement.attributes.map((attr: any) => `
                <div class="attribute">
                  <div class="attribute-label">${attr.trait_type}</div>
                  <div class="attribute-value">${attr.value}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="verification">
              <p><strong>Blockchain Verification:</strong></p>
              <p>Token ID: <span class="token-id">#${achievement.tokenId}</span></p>
              <p>Transaction: <span class="token-id">${achievement.transactionHash}</span></p>
              <p>Minted: ${new Date(achievement.mintedAt).toLocaleDateString()}</p>
              <p><em>This certificate is permanently stored on the blockchain and can be verified at any time.</em></p>
            </div>
          </div>
        </body>
      </html>
    `

    // Convert HTML to PDF using browser's print functionality
    const printWindow = window.open('', '_blank')
    if (!printWindow) throw new Error('Could not open print window')

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Trigger print dialog
    printWindow.print()
    printWindow.close()

    // Return a placeholder blob for now
    return new Blob([htmlContent], { type: 'text/html' })
  }
}
