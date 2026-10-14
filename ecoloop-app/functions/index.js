// functions/index.js
const { onRequest } = require('firebase-functions/v2/https')
const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')

const app = express()

// Enable CORS and parse JSON payloads with attachments
app.use(cors({ origin: true }))
app.use(express.json({ limit: '10mb' }))

// BR (D.2) & BR (E.1): Serverless email endpoint with attachment support
app.post('/send-email', async (req, res) => {
  const { recipientEmail, subject, messageText, attachmentBase64, filename } = req.body

  if (!recipientEmail || !subject) {
    return res.status(400).json({ error: 'Recipient email and subject are required.' })
  }

  try {
    // Generates a mock disposable test account on Ethereal automatically
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

    return res.status(200).json({
      status: 'Success',
      messageId: info.messageId,
      previewUrl: previewUrl || null
    })
  } catch (error) {
    console.error('Email error:', error)
    return res.status(500).json({ error: error.message })
  }
})

// Expose as Cloud Function 'api'
exports.api = onRequest({ cors: true }, app)
