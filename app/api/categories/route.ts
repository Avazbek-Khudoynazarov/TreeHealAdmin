import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// GET - Fetch active categories for app
export async function GET() {
  try {
    const categories = await query(
      `SELECT
        category_id,
        category_name,
        category_icon,
        display_order,
        is_active
       FROM consultation_categories
       WHERE is_active = TRUE
       ORDER BY display_order ASC`
    );

    return NextResponse.json({
      success: true,
      data: categories
    }, { headers: corsHeaders() });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
