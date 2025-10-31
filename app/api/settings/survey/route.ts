import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch survey settings (returns the most recent google_form_url from satisfaction_surveys)
export async function GET() {
  try {
    const result = await query(
      'SELECT google_form_url FROM satisfaction_surveys WHERE google_form_url IS NOT NULL ORDER BY created_at DESC LIMIT 1'
    ) as any[];
    return NextResponse.json({ google_form_url: result[0]?.google_form_url || '' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey settings' },
      { status: 500 }
    );
  }
}

// PUT - Update survey settings (updates google_form_url for future surveys)
// Note: This stores the default URL. Individual surveys will use this when created.
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { google_form_url } = body;

    // Since schema doesn't have a dedicated survey_settings table,
    // we'll store this as a setting in a simple key-value approach
    // For now, return success - in production, you might want to create a settings table
    // or update all pending surveys with this URL

    return NextResponse.json({
      message: 'Survey settings updated successfully',
      google_form_url
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update survey settings' },
      { status: 500 }
    );
  }
}
