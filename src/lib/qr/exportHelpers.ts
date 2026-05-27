import type QRCodeStyling from 'qr-code-styling'

export function urlToSlug(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    const raw = `${hostname}${pathname}`
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
    return raw.slice(0, 40) || 'qr'
  } catch {
    return 'qr'
  }
}

export function buildFileName(url: string, ext: 'png' | 'svg' | 'pdf'): string {
  const slug      = urlToSlug(url)
  const timestamp = Date.now()
  return `qrcraft-${slug}-${timestamp}.${ext}`
}

export function triggerDownload(data: string | Blob, fileName: string): void {
  const url  = typeof data === 'string' ? data : URL.createObjectURL(data)
  const link = document.createElement('a')
  link.href     = url
  link.download = fileName
  link.click()

  if (typeof data !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}

function toBlob(data: Blob | Buffer, mimeType: string): Blob {
  if (data instanceof Blob) return data
  // Uint8Array copy ensures buffer is a plain ArrayBuffer (not SharedArrayBuffer)
  return new Blob([new Uint8Array(data)], { type: mimeType })
}

export async function exportPNG(
  qrInstance: InstanceType<typeof QRCodeStyling>,
  url:        string
): Promise<void> {
  const fileName = buildFileName(url, 'png')
  const raw = await qrInstance.getRawData('png')
  if (!raw) throw new Error('Failed to generate PNG blob')
  triggerDownload(toBlob(raw, 'image/png'), fileName)
}

export async function exportSVG(
  qrInstance: InstanceType<typeof QRCodeStyling>,
  url:        string
): Promise<void> {
  const fileName = buildFileName(url, 'svg')
  const raw      = await qrInstance.getRawData('svg')
  if (!raw) throw new Error('Failed to generate SVG blob')
  triggerDownload(toBlob(raw, 'image/svg+xml'), fileName)
}

export async function exportPDF(
  containerEl: HTMLElement,
  url:         string,
  size:        number
): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] =
    await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ])

  const fileName = buildFileName(url, 'pdf')

  const canvas = await html2canvas(containerEl, {
    backgroundColor: null,
    scale:           2,
    useCORS:         true,
    logging:         false,
  })

  const imgData = canvas.toDataURL('image/png')

  const pdf    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW  = pdf.internal.pageSize.getWidth()
  const pageH  = pdf.internal.pageSize.getHeight()

  const maxDim   = 120
  const qrDimMM  = Math.min(maxDim, (size / 96) * 25.4)
  const xOffset  = (pageW - qrDimMM) / 2
  const yOffset  = 40

  pdf.setFontSize(22)
  pdf.setFont('helvetica', 'bold')
  pdf.text('QRCraft', pageW / 2, 20, { align: 'center' })

  pdf.addImage(imgData, 'PNG', xOffset, yOffset, qrDimMM, qrDimMM)

  const metaY = yOffset + qrDimMM + 12
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(100)

  const displayUrl = url.length > 60 ? `${url.slice(0, 57)}...` : url
  pdf.text(`URL: ${displayUrl}`, pageW / 2, metaY, { align: 'center' })
  pdf.text(
    `Generated: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day:   'numeric',
    })}`,
    pageW / 2,
    metaY + 6,
    { align: 'center' }
  )
  pdf.text(`Size: ${size}×${size}px`, pageW / 2, metaY + 12, { align: 'center' })

  pdf.setFontSize(8)
  pdf.setTextColor(160)
  pdf.text('Generated with QRCraft', pageW / 2, pageH - 10, { align: 'center' })

  pdf.save(fileName)
}
