import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchQuery = searchParams.get('q') || '';
    const offset = (page - 1) * limit;

    let whereClause = '';
    let queryParams: any[] = [];

    if (searchQuery) {
      whereClause = 'WHERE expert_name LIKE ? OR contact_number LIKE ? OR specialization LIKE ?';
      const searchPattern = `%${searchQuery}%`;
      queryParams = [searchPattern, searchPattern, searchPattern];
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM experts ${whereClause}`,
      queryParams
    ) as any[];
    const total = countResult[0].total;

    // Get paginated data - map expert columns to consultant format
    const consultants = await query(
      `SELECT expert_id as id, expert_name as name, contact_number as phone,
              specialization as career, qualifications as qualification,
              profile_image as image, created_at, updated_at
       FROM experts ${whereClause} ORDER BY expert_id DESC LIMIT ${limit} OFFSET ${offset}`,
      queryParams
    );

    return NextResponse.json({
      data: consultants,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }, { headers: corsHeaders() });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultants' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, career, qualification, image } = body;

    const result = await query(
      'INSERT INTO experts (expert_name, contact_number, specialization, qualifications, profile_image) VALUES (?, ?, ?, ?, ?)',
      [name, phone, career, qualification, image]
    );

    return NextResponse.json(
      { message: 'Consultant created successfully', result },
      { status: 201, headers: corsHeaders() }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create consultant' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
