// server.js (Standalone Serverless Backend API)
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
const port = 5001

app.use(cors({ origin: true }))
app.use(express.json({ limit: '15mb' }))

// BR (D.2) & BR (E.1): Serverless Email with Attachment Endpoint
app.post('/api/send-email', async (req, res) => {
  const { recipientEmail, subject, messageText, attachmentBase64, filename } = req.body

  if (!recipientEmail || !subject) {
    return res.status(400).json({ error: 'Recipient email and subject are required.' })
  }

  try {
    // Generate a free disposable Ethereal test inbox
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })

    const mailOptions = {
      from: '"Eco Loop Melbourne" <no-reply@ecoloop.org.au>',
      to: recipientEmail,
      subject: subject,
      text: messageText || 'Please find attached the requested report.',
      attachments: []
    }

    if (attachmentBase64 && filename) {
      mailOptions.attachments.push({
        filename: filename,
        content: attachmentBase64.split('base64,')[1] || attachmentBase64,
        encoding: 'base64'
      })
    }

    const info = await transporter.sendMail(mailOptions)
    const previewUrl = nodemailer.getTestMessageUrl(info)

    console.log(`[Email Service] Dispatched to ${recipientEmail}. Preview: ${previewUrl}`)

    return res.status(200).json({
      status: 'Success',
      messageId: info.messageId,
      previewUrl: previewUrl || null
    })
  } catch (error) {
    console.error('[Email Service Error]', error)
    return res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`🚀 EcoLoop Serverless Backend running at http://localhost:${port}`)
})
