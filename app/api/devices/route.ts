import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

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
      whereClause = 'WHERE ssaid LIKE ? OR device_name LIKE ?';
      const searchPattern = `%${searchQuery}%`;
      params.push(searchPattern, searchPattern);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM devices ${whereClause}`;
    const countResult: any = await query(countQuery, params);
    const total = countResult[0].total;

    // Get paginated data
    const dataQuery = `
      SELECT
        d.device_id as id,
        d.device_name,
        d.ssaid,
        d.device_type,
        d.registered_at as created_at,
        d.status
      FROM devices d
      ${whereClause}
      ORDER BY d.device_id DESC
      LIMIT ? OFFSET ?
    `;
    const devices: any = await query(dataQuery, [...params, limit, offset]);

    // Fetch expert names for each device from device_expert_mapping
    const parsedDevices = await Promise.all(devices.map(async (device: any) => {
      const expertQuery = `
        SELECT e.expert_name
        FROM device_expert_mapping dem
        JOIN experts e ON dem.expert_id = e.expert_id
        WHERE dem.device_id = ?
        ORDER BY dem.display_order
      `;
      const expertsResult: any = await query(expertQuery, [device.id]);
      const expertNames = expertsResult.map((e: any) => e.expert_name);

      return {
        ...device,
        experts: expertNames
      };
    }));

    return NextResponse.json({
      data: parsedDevices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }, { headers: corsHeaders() });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500, headers: corsHeaders() });
  }
}

// POST - Create a new device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ssaid, device_name, device_type, experts } = body;

    // Validate required fields
    if (!ssaid || !device_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Insert new device
    const insertQuery = `
      INSERT INTO devices (ssaid, device_name, device_type, status)
      VALUES (?, ?, ?, 'active')
    `;

    const result: any = await query(insertQuery, [ssaid, device_name, device_type || null]);
    const deviceId = result.insertId;

    // Insert device-expert mappings if experts are provided
    if (experts && Array.isArray(experts) && experts.length > 0) {
      for (let i = 0; i < experts.length; i++) {
        const expert = experts[i];
        await query(
          `INSERT INTO device_expert_mapping (device_id, expert_id, display_type, display_order)
           VALUES (?, ?, ?, ?)`,
          [deviceId, expert.expert_id, expert.display_type || 'random', i + 1]
        );
      }
    }

    return NextResponse.json({ message: 'Device created successfully', device_id: deviceId }, { status: 201, headers: corsHeaders() });
  } catch (error: any) {
    console.error('Database error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'SSAID already exists' }, { status: 409, headers: corsHeaders() });
    }
    return NextResponse.json({ error: 'Failed to create device' }, { status: 500, headers: corsHeaders() });
  }
}
