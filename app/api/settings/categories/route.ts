import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Force dynamic rendering to support PUT method
export const dynamic = 'force-dynamic';

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await query(
      `SELECT category_id as id, category_name as title, category_icon as icon,
              completion_message as description, display_order, created_at, updated_at
       FROM consultation_categories ORDER BY display_order ASC`
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
        'UPDATE consultation_categories SET category_name = ?, category_icon = ?, completion_message = ? WHERE category_id = ?',
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
