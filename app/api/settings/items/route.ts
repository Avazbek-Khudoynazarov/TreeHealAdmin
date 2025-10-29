import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all detail items
export async function GET() {
  try {
    const items = await query(
      'SELECT * FROM detail_items ORDER BY display_order ASC'
    );
    return NextResponse.json(items);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch detail items' },
      { status: 500 }
    );
  }
}

// PUT - Update all detail items
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      );
    }

    // Update each item
    for (const item of items) {
      await query(
        'UPDATE detail_items SET title = ?, icon = ? WHERE id = ?',
        [item.title, item.icon, item.id]
      );
    }

    return NextResponse.json({ message: 'Detail items updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update detail items' },
      { status: 500 }
    );
  }
}
