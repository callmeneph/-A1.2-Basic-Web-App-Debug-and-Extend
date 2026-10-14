<!-- src/views/ExportView.vue -->
<template>
  <div class="container my-5">
    <div class="mb-4">
      <h1 class="h3 fw-bold text-success">📥 Community Data Export Center</h1>
      <p class="text-muted">
        Export real-time Eco Loop Melbourne operational datasets into standard CSV spreadsheets and downloadable PDF documents.
      </p>
    </div>

    <!-- Export Action Cards -->
    <div class="row g-4 mb-5">
      <!-- Card 1: CSV Export -->
      <div class="col-12 col-md-6">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-header bg-success text-white py-3">
            <h2 class="h5 mb-0">📄 Export to CSV (Spreadsheet)</h2>
          </div>
          <div class="card-body d-flex flex-column justify-content-between p-4">
            <div>
              <p class="card-text text-muted">
                Generates comma-separated values compatible with Microsoft Excel, Google Sheets, and data analysis software.
              </p>
              <ul class="small text-secondary mb-4">
                <li>Complete drop-off locations dataset</li>
                <li>UTF-8 standard encoding with column headers</li>
                <li>Instant client-side generation</li>
              </ul>
            </div>
            <button class="btn btn-success fw-bold py-2" @click="exportToCSV">
              ⬇️ Download Drop-Off Directory (.CSV)
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: PDF Export -->
      <div class="col-12 col-md-6">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-header bg-primary text-white py-3">
            <h2 class="h5 mb-0">📑 Export to PDF (Document)</h2>
          </div>
          <div class="card-body d-flex flex-column justify-content-between p-4">
            <div>
              <p class="card-text text-muted">
                Compiles a formatted official report document ready for printing, offline community distribution, and auditing.
              </p>
              <ul class="small text-secondary mb-4">
                <li>Formatted summary of active collection hubs</li>
                <li>Includes official timestamp and NFP credentials</li>
                <li>Generated using jsPDF client-side engine</li>
              </ul>
            </div>
            <button class="btn btn-primary fw-bold py-2" @click="exportToPDF">
              ⬇️ Download Official Directory Report (.PDF)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Preview Table of Exportable Data -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
        <h3 class="h6 mb-0">Dataset Preview: Active Melbourne Recycling Centers</h3>
        <span class="badge bg-secondary">{{ exportData.length }} Records Ready</span>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0 align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Hub Name</th>
                <th>Suburb</th>
                <th>Accepted Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in exportData" :key="item.id">
                <td>{{ item.id }}</td>
                <td class="fw-semibold">{{ item.name }}</td>
                <td>{{ item.suburb }}</td>
                <td><span class="badge bg-secondary">{{ item.category }}</span></td>
                <td><span class="badge bg-success">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import rawData from '../assets/json/tableData.json'

const exportData = ref(rawData.hubs || [])

// 1. CSV EXPORT IMPLEMENTATION
const exportToCSV = () => {
  const headers = ['Hub ID', 'Hub Name', 'Suburb', 'Category', 'Capacity (kg)', 'Status']
  const rows = exportData.value.map(h => [
    h.id,
    `"${h.name}"`,
    `"${h.suburb}"`,
    `"${h.category}"`,
    h.capacityKg,
    h.status
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `EcoLoop_Melbourne_Directory_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 2. PDF EXPORT IMPLEMENTATION
const exportToPDF = () => {
  const doc = new jsPDF()
  const currentDate = new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Title & Header Branding
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(25, 135, 84) // EcoLoop Green
  doc.text('Eco Loop Melbourne - Drop-Off Directory', 14, 20)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Official Community Circular Economy Report | Generated on: ${currentDate}`, 14, 28)
  doc.line(14, 32, 196, 32)

  // Document Content Rows
  let startY = 42
  doc.setFontSize(11)
  doc.setTextColor(33)

  exportData.value.forEach((hub, idx) => {
    if (startY > 270) {
      doc.addPage()
      startY = 20
    }
    doc.setFont('helvetica', 'bold')
    doc.text(`${idx + 1}. ${hub.name}`, 14, startY)
    doc.setFont('helvetica', 'normal')
    doc.text(`Suburb: ${hub.suburb}  |  Category: ${hub.category}  |  Capacity: ${hub.capacityKg} kg`, 18, startY + 6)
    startY += 14
  })

  // Footer Note
  doc.setFontSize(9)
  doc.setTextColor(150)
  doc.text('Eco Loop Melbourne - Diverting waste and building sustainable communities.', 14, 288)

  doc.save(`EcoLoop_Melbourne_Directory_${new Date().toISOString().slice(0, 10)}.pdf`)
}
</script>
