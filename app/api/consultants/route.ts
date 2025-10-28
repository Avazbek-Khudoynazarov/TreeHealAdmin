import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
      whereClause = 'WHERE name LIKE ? OR phone LIKE ? OR career LIKE ?';
      const searchPattern = `%${searchQuery}%`;
      queryParams = [searchPattern, searchPattern, searchPattern];
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM consultants ${whereClause}`,
      queryParams
    ) as any[];
    const total = countResult[0].total;

    // Get paginated data
    const consultants = await query(
      `SELECT * FROM consultants ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return NextResponse.json({
      data: consultants,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, career, qualification, image } = body;

    const result = await query(
      'INSERT INTO consultants (name, phone, career, qualification, image) VALUES (?, ?, ?, ?, ?)',
      [name, phone, career, qualification, image]
    );

    return NextResponse.json(
      { message: 'Consultant created successfully', result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create consultant' },
      { status: 500 }
    );
  }
}
