<!-- src/views/EmailView.vue -->
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-success text-white py-3">
            <h1 class="h5 mb-0">📧 Send Official Circular Report via Cloud Email</h1>
          </div>
          <div class="card-body p-4">
            <p class="text-muted small">
              This feature fulfills <strong>BR (D.2) Email with Attachment</strong> executed via
              <strong>BR (E.1) Serverless Cloud Functions</strong>.
            </p>

            <div v-if="successMsg" class="alert alert-success">
              <p class="mb-1 fw-bold">{{ successMsg }}</p>
              <a v-if="emailPreviewUrl" :href="emailPreviewUrl" target="_blank" class="btn btn-sm btn-outline-success mt-2">
                🔗 View Live Sent Email & Attachment (Ethereal Preview)
              </a>
            </div>

            <div v-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>

            <form @submit.prevent="handleSendEmail">
              <div class="mb-3">
                <label for="toEmail" class="form-label fw-semibold">Recipient Email *</label>
                <input
                  id="toEmail"
                  v-model.trim="emailForm.recipientEmail"
                  type="email"
                  class="form-control"
                  placeholder="volunteer@ecoloop.org"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="emailSubject" class="form-label fw-semibold">Subject *</label>
                <input
                  id="emailSubject"
                  v-model.trim="emailForm.subject"
                  type="text"
                  class="form-control"
                  placeholder="Eco Loop Melbourne - Monthly Circular Directory"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="emailBody" class="form-label fw-semibold">Message Body</label>
                <textarea
                  id="emailBody"
                  v-model.trim="emailForm.messageText"
                  rows="4"
                  class="form-control"
                  placeholder="Attached is the current list of verified drop-off points..."
                ></textarea>
              </div>

              <!-- Attachment Selector -->
              <div class="mb-4">
                <label for="fileAttachment" class="form-label fw-semibold">Attachment (PDF, CSV, or Text) *</label>
                <input
                  id="fileAttachment"
                  type="file"
                  class="form-control"
                  accept=".pdf,.csv,.txt"
                  @change="handleFileUpload"
                  required
                />
                <small class="text-muted d-block mt-1">
                  Tip: Upload the <code>EcoLoop_Melbourne_Directory.pdf</code> you just downloaded.
                </small>
              </div>

              <button
                type="submit"
                class="btn btn-success fw-bold px-4 py-2"
                :disabled="isSending"
              >
                <span v-if="isSending" class="spinner-border spinner-border-sm me-2"></span>
                {{ isSending ? 'Transmitting via Cloud Function...' : '🚀 Send Email with Attachment' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emailForm = ref({
  recipientEmail: '',
  subject: 'Eco Loop Melbourne - Verified Recycling Directory',
  messageText: 'Hello,\n\nPlease find attached the verified community drop-off directory report.\n\nRegards,\nEco Loop Melbourne Team'
})

const attachmentData = ref({
  filename: '',
  base64: ''
})

const isSending = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const emailPreviewUrl = ref('')

// Read uploaded file as Base64 to safely transmit across JSON API
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  attachmentData.value.filename = file.name
  const reader = new FileReader()
  reader.onload = () => {
    attachmentData.value.base64 = reader.result
  }
  reader.readAsDataURL(file)
}

const handleSendEmail = async () => {
  if (!attachmentData.value.base64) {
    errorMsg.value = 'Please choose a file attachment.'
    return
  }

  isSending.value = true
  successMsg.value = ''
  errorMsg.value = ''
  emailPreviewUrl.value = ''

  try {
    // Cloud Function endpoint (local emulator)
    const endpoint = 'http://localhost:5001/api/send-email'

    const payload = {
      recipientEmail: emailForm.value.recipientEmail,
      subject: emailForm.value.subject,
      messageText: emailForm.value.messageText,
      attachmentBase64: attachmentData.value.base64,
      filename: attachmentData.value.filename
    }

    const response = await axios.post(endpoint, payload)

    if (response.data.status === 'Success') {
      successMsg.value = 'Email sent successfully via Cloud Function!'
      emailPreviewUrl.value = response.data.previewUrl
    }
  } catch (err) {
    console.error(err)
    errorMsg.value = err.response?.data?.error || 'Failed to dispatch email. Ensure Cloud Functions server/emulator is running.'
  } finally {
    isSending.value = false
  }
}
</script>
