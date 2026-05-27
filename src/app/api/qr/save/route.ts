import { NextRequest, NextResponse } from 'next/server'
import { createClient }  from '@/lib/supabase/server'
import type { QRConfig } from '@/types/qr'

interface SaveQRBody {
  config:     QRConfig
  previewB64: string
  label?:     string
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } =
      await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SaveQRBody = await req.json()
    const { config, previewB64, label } = body

    if (!config?.url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let previewUrl: string | null = null

    if (previewB64) {
      const base64Data = previewB64.replace(/^data:image\/\w+;base64,/, '')
      const buffer     = Buffer.from(base64Data, 'base64')
      const fileName   = `${user.id}/${Date.now()}.png`

      const { data: storageData, error: storageError } =
        await supabase.storage
          .from('qr-previews')
          .upload(fileName, buffer, {
            contentType: 'image/png',
            upsert:      false,
          })

      if (!storageError && storageData) {
        const { data: urlData } = supabase.storage
          .from('qr-previews')
          .getPublicUrl(storageData.path)
        previewUrl = urlData.publicUrl
      }
    }

    const { data, error: insertError } = await supabase
      .from('qr_codes')
      .insert({
        user_id:     user.id,
        url:         config.url,
        config_json: config,
        preview_url: previewUrl,
        label:       label ?? null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save QR code' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })

  } catch (err) {
    console.error('Save QR error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
