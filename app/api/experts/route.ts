import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { corsHeaders } from '@/lib/cors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// GET - Fetch active experts (optionally filtered by device_id or ssaid)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deviceId = searchParams.get('device_id');
    const ssaid = searchParams.get('ssaid');

    let experts: RowDataPacket[];

    if (ssaid) {
      // Get device by ssaid first, then get mapped experts
      const devices = await query(
        'SELECT device_id FROM devices WHERE ssaid = ? AND status = ?',
        [ssaid, 'active']
      ) as RowDataPacket[];

      if (devices.length === 0) {
        // Device not found, return empty array
        return NextResponse.json({
          success: true,
          data: []
        }, { status: 200, headers: corsHeaders() });
      }

      const foundDeviceId = devices[0].device_id;

      // Get experts mapped to this device
      experts = await query(
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
        [foundDeviceId]
      ) as RowDataPacket[];
    } else if (deviceId) {
      // Get experts mapped to specific device by device_id
      experts = await query(
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
        [parseInt(deviceId)]
      ) as RowDataPacket[];
    } else {
      // Get all active experts
      experts = await query(
        `SELECT expert_id, expert_name, contact_number, specialization,
                qualifications, profile_image, display_order, is_fixed, status
         FROM experts
         WHERE status = 'active'
         ORDER BY display_order ASC, expert_id ASC`,
        []
      ) as RowDataPacket[];
    }

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
