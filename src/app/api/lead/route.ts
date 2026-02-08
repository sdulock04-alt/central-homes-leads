import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      full_name,
      phone,
      email,
      address,
      city,
      county,
      zip,
      service,
      timeline,
      notes
    } = body

    const { error } = await supabase
      .from('leads')
      .insert([
        {
          full_name,
          phone,
          email,
          address,
          city,
          county,
          zip,
          service,
          timeline,
          notes,
          homeowner: true
        }
      ])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
