import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Generate unique request number (format: REQ-YYYYMMDD-XXXXX)
function generateRequestNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `REQ-${year}${month}${day}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      device_ssaid,
      category_id,
      applicant_name,
      contact_number,
      birth_date,
      gender,
      residence_region,
      residence_detail,
      selected_expert_id,
      detail_items,
      privacy_consents
    } = body;

    // Validate required fields
    if (!device_ssaid || !category_id || !applicant_name || !contact_number) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find device by ssaid
    const deviceResult = await query(
      'SELECT device_id FROM devices WHERE ssaid = ? AND status = ?',
      [device_ssaid, 'active']
    ) as RowDataPacket[];

    let device_id = null;
    if (deviceResult.length > 0) {
      device_id = deviceResult[0].device_id;
    }

    // Get expert contact number if expert is selected
    let expert_contact = null;
    if (selected_expert_id) {
      const expertResult = await query(
        'SELECT contact_number FROM experts WHERE expert_id = ? AND status = ?',
        [selected_expert_id, 'active']
      ) as RowDataPacket[];

      if (expertResult.length > 0) {
        expert_contact = expertResult[0].contact_number;
      }
    }

    // Generate unique request number
    let request_number = generateRequestNumber();
    let isUnique = false;
    let attempts = 0;

    // Ensure request number is unique (max 10 attempts)
    while (!isUnique && attempts < 10) {
      const existingRequest = await query(
        'SELECT request_id FROM consultation_requests WHERE request_number = ?',
        [request_number]
      ) as RowDataPacket[];

      if (existingRequest.length === 0) {
        isUnique = true;
      } else {
        request_number = generateRequestNumber();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique request number' },
        { status: 500 }
      );
    }

    // Convert detail_items array to JSON string
    const detail_items_json = JSON.stringify(detail_items);

    // Insert consultation request
    const insertResult = await query(
      `INSERT INTO consultation_requests (
        request_number,
        device_id,
        category_id,
        applicant_name,
        contact_number,
        birth_date,
        gender,
        assigned_expert_id,
        detail_items,
        expert_contact,
        request_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request_number,
        device_id,
        category_id,
        applicant_name,
        contact_number,
        birth_date || null,
        gender || null,
        selected_expert_id || null,
        detail_items_json,
        expert_contact,
        'pending'
      ]
    ) as ResultSetHeader;

    const request_id = insertResult.insertId;

    // Insert privacy consents
    if (privacy_consents && Array.isArray(privacy_consents)) {
      for (const consent of privacy_consents) {
        await query(
          `INSERT INTO request_privacy_consents (
            request_id,
            consent_item_id,
            is_agreed
          ) VALUES (?, ?, ?)`,
          [request_id, consent.consent_item_id, consent.is_agreed]
        );
      }
    }

    // If assigned expert and survey consent is agreed, we could schedule survey here
    // (This would be done via a separate service in production)

    return NextResponse.json(
      {
        success: true,
        message: 'Consultation request created successfully',
        data: {
          request_id,
          request_number,
          applicant_name,
          expert_contact,
          request_status: 'pending'
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create consultation request',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// GET endpoint for fetching consultation requests (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const searchQuery = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let queryParams: any[] = [];

    if (searchQuery) {
      whereClause += ' AND (cr.applicant_name LIKE ? OR cr.contact_number LIKE ? OR cr.request_number LIKE ?)';
      const searchPattern = `%${searchQuery}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (status) {
      whereClause += ' AND cr.request_status = ?';
      queryParams.push(status);
    }

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total
       FROM consultation_requests cr
       ${whereClause}`,
      queryParams
    ) as any[];
    const total = countResult[0].total;

    // Get paginated data with joined information
    const requests = await query(
      `SELECT
        cr.*,
        cc.category_name,
        e.expert_name,
        e.contact_number as expert_contact_number,
        d.device_name,
        d.ssaid
       FROM consultation_requests cr
       LEFT JOIN consultation_categories cc ON cr.category_id = cc.category_id
       LEFT JOIN experts e ON cr.assigned_expert_id = e.expert_id
       LEFT JOIN devices d ON cr.device_id = d.device_id
       ${whereClause}
       ORDER BY cr.requested_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    ) as RowDataPacket[];

    // Parse detail_items JSON for each request
    const formattedRequests = requests.map(req => ({
      ...req,
      detail_items: req.detail_items ? JSON.parse(req.detail_items) : []
    }));

    return NextResponse.json({
      success: true,
      data: formattedRequests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch consultation requests',
        details: error.message
      },
      { status: 500 }
    );
  }
}
