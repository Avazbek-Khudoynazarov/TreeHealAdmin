import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { corsHeaders } from '@/lib/cors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// GET - Fetch experts mapped to a specific device
export async function GET(
  request: NextRequest,
  { params }: { params: { deviceId: string } }
) {
  try {
    const { deviceId } = params;

    // Validate deviceId is a number
    const deviceIdNum = parseInt(deviceId);
    if (isNaN(deviceIdNum)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 기기 ID입니다' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Query experts mapped to this device
    const experts = await query(
      `SELECT
        e.expert_id,
        e.expert_name,
        e.contact_number,
        e.specialization,
        e.qualifications,
        e.profile_image,
        dem.display_order,
        e.is_fixed,
        e.status
       FROM device_expert_mapping dem
       JOIN experts e ON dem.expert_id = e.expert_id
       WHERE dem.device_id = ? AND e.status = 'active'
       ORDER BY dem.display_order ASC`,
      [deviceIdNum]
    ) as RowDataPacket[];

    return NextResponse.json({
      success: true,
      data: experts
    }, { status: 200, headers: corsHeaders() });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
