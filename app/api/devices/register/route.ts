import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { corsHeaders } from '@/lib/cors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// POST - Register a new device or return existing device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ssaid, device_name, device_type } = body;

    // Validate required fields
    if (!ssaid) {
      return NextResponse.json(
        { success: false, message: 'SSAID는 필수 항목입니다' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Check if device already exists
    const existingDevice = await query(
      'SELECT * FROM devices WHERE ssaid = ?',
      [ssaid]
    ) as RowDataPacket[];

    if (existingDevice.length > 0) {
      // Device already registered - return existing data
      const device = existingDevice[0];

      // Update last access time
      await query(
        'UPDATE devices SET updated_at = CURRENT_TIMESTAMP WHERE device_id = ?',
        [device.device_id]
      );

      return NextResponse.json({
        success: true,
        device_id: device.device_id,
        message: '이미 등록된 기기입니다',
        data: {
          device_id: device.device_id,
          device_name: device.device_name,
          ssaid: device.ssaid,
          device_type: device.device_type,
          status: device.status,
          registered_at: device.registered_at,
          updated_at: new Date().toISOString()
        }
      }, { status: 200, headers: corsHeaders() });
    }

    // Register new device
    const insertResult = await query(
      `INSERT INTO devices (ssaid, device_name, device_type, status)
       VALUES (?, ?, ?, 'active')`,
      [ssaid, device_name || null, device_type || null]
    ) as ResultSetHeader;

    const device_id = insertResult.insertId;

    // Fetch the newly created device
    const newDevice = await query(
      'SELECT * FROM devices WHERE device_id = ?',
      [device_id]
    ) as RowDataPacket[];

    return NextResponse.json({
      success: true,
      device_id: device_id,
      message: '기기가 성공적으로 등록되었습니다',
      data: {
        device_id: newDevice[0].device_id,
        device_name: newDevice[0].device_name,
        ssaid: newDevice[0].ssaid,
        device_type: newDevice[0].device_type,
        status: newDevice[0].status,
        registered_at: newDevice[0].registered_at
      }
    }, { status: 201, headers: corsHeaders() });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
