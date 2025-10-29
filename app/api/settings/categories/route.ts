import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await query(
      'SELECT * FROM categories ORDER BY display_order ASC'
    );
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// PUT - Update all categories
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { categories } = body;

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Categories must be an array' },
        { status: 400 }
      );
    }

    // Update each category
    for (const category of categories) {
      await query(
        'UPDATE categories SET title = ?, icon = ?, description = ? WHERE id = ?',
        [category.title, category.icon, category.description, category.id]
      );
    }

    return NextResponse.json({ message: 'Categories updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update categories' },
      { status: 500 }
    );
  }
}
