import type { QRConfig } from '@/types/qr'

export function buildQROptions(config: QRConfig) {
  return {
    width:  config.size,
    height: config.size,
    data:   config.url || 'https://example.com',
    qrOptions: {
      errorCorrectionLevel: config.errorCorrectionLevel,
    },
    dotsOptions: {
      type:  config.dotStyle,
      color: config.foregroundColor,
    },
    cornersSquareOptions: {
      type:  config.cornerStyle,
      color: config.foregroundColor,
    },
    backgroundOptions: {
      color: config.backgroundColor,
    },
    ...(config.logoEnabled && config.logoUrl
      ? {
          imageOptions: {
            src:         config.logoUrl,
            imageSize:   config.logoSize / 100,
            margin:      4,
            crossOrigin: 'anonymous',
          },
        }
      : {}),
  }
}
