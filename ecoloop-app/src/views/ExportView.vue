<!-- src/views/ExportView.vue -->
<template>
  <div class="container-xxl">
    <header class="page-head">
      <span class="eyebrow">Data export</span>
      <h1>Download the directory</h1>
      <p>Export the Eco Loop Melbourne drop-off dataset as a CSV spreadsheet or a formatted PDF report.</p>
    </header>

    <!-- Export Action Cards -->
    <div class="row g-4 mb-4">
      <!-- Card 1: CSV Export -->
      <div class="col-12 col-md-6">
        <div class="card h-100">
          <div class="card-header d-flex align-items-center gap-3">
            <span class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>
            </span>
            <div>
              <h2 class="h5 mb-0">CSV spreadsheet</h2>
              <span class="small text-muted">Excel, Google Sheets, analysis tools</span>
            </div>
          </div>
          <div class="card-body d-flex flex-column justify-content-between p-4">
            <div>
              <p class="card-text text-muted">
                Generates comma-separated values compatible with Microsoft Excel, Google Sheets, and data analysis software.
              </p>
              <ul class="feature-list mb-4">
                <li>Complete drop-off locations dataset</li>
                <li>UTF-8 standard encoding with column headers</li>
                <li>Instant client-side generation</li>
              </ul>
            </div>
            <button class="btn btn-success" @click="exportToCSV">
              Download directory (.csv)
            </button>
          </div>
        </div>
      </div>

      <!-- Card 2: PDF Export -->
      <div class="col-12 col-md-6">
        <div class="card h-100">
          <div class="card-header d-flex align-items-center gap-3">
            <span class="icon-chip" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>
            </span>
            <div>
              <h2 class="h5 mb-0">PDF report</h2>
              <span class="small text-muted">Print-ready for distribution and audits</span>
            </div>
          </div>
          <div class="card-body d-flex flex-column justify-content-between p-4">
            <div>
              <p class="card-text text-muted">
                Compiles a formatted official report document ready for printing, offline community distribution, and auditing.
              </p>
              <ul class="feature-list mb-4">
                <li>Formatted summary of active collection hubs</li>
                <li>Includes official timestamp and NFP credentials</li>
                <li>Generated using jsPDF client-side engine</li>
              </ul>
            </div>
            <button class="btn btn-success" @click="exportToPDF">
              Download report (.pdf)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Preview Table of Exportable Data -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="h6 mb-0">Dataset preview</h3>
        <span class="badge bg-secondary">{{ exportData.length }} records ready</span>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive border-0 rounded-0">
          <table class="table table-hover mb-0 align-middle">
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

<style scoped>
.feature-list { list-style: none; padding: 0; font-size: 0.9rem; color: var(--eco-ink-2); display: grid; gap: 0.45rem; }
.feature-list li { display: flex; gap: 0.55rem; align-items: flex-start; }
.feature-list li::before {
  content: '';
  flex-shrink: 0;
  width: 16px; height: 16px; margin-top: 2px;
  border-radius: 50%;
  background: var(--eco-green-soft) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2315803d' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5L19 7'/%3E%3C/svg%3E") no-repeat center / 10px;
}
</style>
