import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch terms settings from privacy_consent_items
export async function GET() {
  try {
    // Fetch all consent items
    const termsQuery = 'SELECT consent_item_id, item_title, item_content FROM privacy_consent_items WHERE consent_item_id BETWEEN 1 AND 4 ORDER BY consent_item_id';
    const result: any = await query(termsQuery);

    // Map the rows to the expected format
    const terms = {
      privacy_consent: '',
      service_terms: '',
      consultation_consent: '',
      marketing_consent: ''
    };

    result.forEach((row: any) => {
      switch (row.consent_item_id) {
        case 1:
          terms.privacy_consent = row.item_content || '';
          break;
        case 2:
          terms.service_terms = row.item_content || '';
          break;
        case 3:
          terms.consultation_consent = row.item_content || '';
          break;
        case 4:
          terms.marketing_consent = row.item_content || '';
          break;
      }
    });

    return NextResponse.json(terms);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch terms settings' }, { status: 500 });
  }
}

// PUT - Update terms settings using privacy_consent_items
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { privacy_consent, service_terms, consultation_consent, marketing_consent } = body;

    // Map terms to their consent_item_ids
    const termsMap = [
      { id: 1, content: privacy_consent, title: 'Privacy Consent' },
      { id: 2, content: service_terms, title: 'Service Terms' },
      { id: 3, content: consultation_consent, title: 'Consultation Consent' },
      { id: 4, content: marketing_consent, title: 'Marketing Consent' }
    ];

    // Update or insert each term
    for (const term of termsMap) {
      // Check if record exists
      const checkQuery = 'SELECT consent_item_id FROM privacy_consent_items WHERE consent_item_id = ?';
      const existingData: any = await query(checkQuery, [term.id]);

      if (existingData.length === 0) {
        // Insert new record
        const insertQuery = `
          INSERT INTO privacy_consent_items (consent_item_id, item_title, item_content, is_required, display_order, is_active)
          VALUES (?, ?, ?, 1, ?, 1)
        `;
        await query(insertQuery, [term.id, term.title, term.content, term.id]);
      } else {
        // Update existing record
        const updateQuery = `
          UPDATE privacy_consent_items
          SET item_content = ?
          WHERE consent_item_id = ?
        `;
        await query(updateQuery, [term.content, term.id]);
      }
    }

    return NextResponse.json({ message: 'Terms settings updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update terms settings' }, { status: 500 });
  }
}
