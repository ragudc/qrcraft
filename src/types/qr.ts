export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
export type QRSize = 128 | 256 | 512
export type DotStyle =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'extra-rounded'
  | 'classy'
  | 'classy-rounded'
export type CornerStyle = 'square' | 'extra-rounded' | 'dot'

export interface QRConfig {
  url: string
  size: QRSize
  errorCorrectionLevel: ErrorCorrectionLevel
  foregroundColor: string
  backgroundColor: string
  dotStyle: DotStyle
  cornerStyle: CornerStyle
  logoEnabled: boolean
  logoUrl: string | null
  logoSize: number
}

export interface QRRecord {
  id: string
  user_id: string
  url: string
  config_json: QRConfig
  preview_url: string | null
  label: string | null
  created_at: string
  updated_at: string
}

export const DEFAULT_QR_CONFIG: QRConfig = {
  url: '',
  size: 256,
  errorCorrectionLevel: 'M',
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  dotStyle: 'square',
  cornerStyle: 'square',
  logoEnabled: false,
  logoUrl: null,
  logoSize: 20,
}
