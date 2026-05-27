"use client"

import { useState, useCallback } from 'react'
import { QRConfig, DEFAULT_QR_CONFIG } from '@/types/qr'

export function useQRGenerator() {
  const [config, setConfig] = useState<QRConfig>(DEFAULT_QR_CONFIG)
  const [isGenerating, setIsGenerating] = useState(false)

  const updateConfig = useCallback(
    (partial: Partial<QRConfig>) => {
      setConfig(prev => ({ ...prev, ...partial }))
    },
    []
  )

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_QR_CONFIG)
  }, [])

  const isValidUrl = useCallback((url: string): boolean => {
    if (!url.trim()) return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }, [])

  return {
    config,
    updateConfig,
    resetConfig,
    isGenerating,
    setIsGenerating,
    isValidUrl,
    hasValidUrl: isValidUrl(config.url),
  }
}
