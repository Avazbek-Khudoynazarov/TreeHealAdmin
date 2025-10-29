import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all devices with pagination and search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchQuery = searchParams.get('q') || '';
    const offset = (page - 1) * limit;

    // Build the WHERE clause for search
    let whereClause = '';
    const params: any[] = [];

    if (searchQuery) {
      whereClause = 'WHERE account LIKE ? OR ssaid LIKE ? OR device_name LIKE ?';
      const searchPattern = `%${searchQuery}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM devices ${whereClause}`;
    const countResult: any = await query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    const dataQuery = `
      SELECT id, account, ssaid, device_name, experts, created_at
      FROM devices
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;
    const devices: any = await query(dataQuery, [...params, limit, offset]);

    // Parse JSON experts field
    const parsedDevices = devices.map((device: any) => ({
      ...device,
      experts: typeof device.experts === 'string' ? JSON.parse(device.experts) : device.experts
    }));

    return NextResponse.json({
      data: parsedDevices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 });
  }
}

// POST - Create a new device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { account, ssaid, device_name, experts } = body;

    // Validate required fields
    if (!account || !ssaid || !device_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert new device
    const insertQuery = `
      INSERT INTO devices (account, ssaid, device_name, experts)
      VALUES (?, ?, ?, ?)
    `;
    const expertsJson = JSON.stringify(experts || []);

    await query(insertQuery, [account, ssaid, device_name, expertsJson]);

    return NextResponse.json({ message: 'Device created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Database error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'SSAID already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create device' }, { status: 500 });
  }
}
