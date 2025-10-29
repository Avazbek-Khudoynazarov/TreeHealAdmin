import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch survey settings
export async function GET() {
  try {
    const result = await query('SELECT * FROM survey_settings LIMIT 1') as any[];
    return NextResponse.json(result[0] || { google_form_url: '' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey settings' },
      { status: 500 }
    );
  }
}

// PUT - Update survey settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { google_form_url } = body;

    // Check if record exists
    const existing = await query('SELECT id FROM survey_settings LIMIT 1') as any[];

    if (existing.length > 0) {
      // Update existing record
      await query(
        'UPDATE survey_settings SET google_form_url = ? WHERE id = ?',
        [google_form_url, existing[0].id]
      );
    } else {
      // Insert new record
      await query(
        'INSERT INTO survey_settings (google_form_url) VALUES (?)',
        [google_form_url]
      );
    }

    return NextResponse.json({ message: 'Survey settings updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update survey settings' },
      { status: 500 }
    );
  }
}
