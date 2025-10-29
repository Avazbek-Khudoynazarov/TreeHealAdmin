import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch terms settings
export async function GET(request: NextRequest) {
  try {
    const termsQuery = 'SELECT * FROM terms_settings LIMIT 1';
    const result: any = await query(termsQuery);

    if (result.length === 0) {
      // If no data exists, return empty terms
      return NextResponse.json({
        privacy_consent: '',
        service_terms: '',
        consultation_consent: '',
        marketing_consent: ''
      });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch terms settings' }, { status: 500 });
  }
}

// PUT - Update terms settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { privacy_consent, service_terms, consultation_consent, marketing_consent } = body;

    // Check if a record exists
    const checkQuery = 'SELECT id FROM terms_settings LIMIT 1';
    const existingData: any = await query(checkQuery);

    if (existingData.length === 0) {
      // Insert new record
      const insertQuery = `
        INSERT INTO terms_settings (privacy_consent, service_terms, consultation_consent, marketing_consent)
        VALUES (?, ?, ?, ?)
      `;
      await query(insertQuery, [privacy_consent, service_terms, consultation_consent, marketing_consent]);
    } else {
      // Update existing record
      const updateQuery = `
        UPDATE terms_settings
        SET privacy_consent = ?, service_terms = ?, consultation_consent = ?, marketing_consent = ?
        WHERE id = ?
      `;
      await query(updateQuery, [privacy_consent, service_terms, consultation_consent, marketing_consent, existingData[0].id]);
    }

    return NextResponse.json({ message: 'Terms settings updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update terms settings' }, { status: 500 });
  }
}
