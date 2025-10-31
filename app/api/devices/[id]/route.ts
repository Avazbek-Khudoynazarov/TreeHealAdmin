import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { corsHeaders } from '@/lib/cors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// GET - Fetch device information by ID or SSAID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if id is a number (device_id) or string (ssaid)
    const isNumeric = /^\d+$/.test(id);

    let devices: RowDataPacket[];

    if (isNumeric) {
      devices = await query(
        'SELECT * FROM devices WHERE device_id = ?',
        [parseInt(id)]
      ) as RowDataPacket[];
    } else {
      devices = await query(
        'SELECT * FROM devices WHERE ssaid = ?',
        [id]
      ) as RowDataPacket[];
    }

    if (devices.length === 0) {
      return NextResponse.json(
        { success: false, message: '기기를 찾을 수 없습니다' },
        { status: 404, headers: corsHeaders() }
      );
    }

    const device = devices[0];

    return NextResponse.json({
      success: true,
      data: {
        device_id: device.device_id,
        device_name: device.device_name,
        ssaid: device.ssaid,
        device_type: device.device_type,
        status: device.status,
        registered_at: device.registered_at,
        updated_at: device.updated_at
      }
    }, { status: 200, headers: corsHeaders() });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PUT - Update a device
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { ssaid, device_name, device_type, status, experts } = body;
    const deviceId = params.id;

    // Validate required fields
    if (!ssaid || !device_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update device
    const updateQuery = `
      UPDATE devices
      SET ssaid = ?, device_name = ?, device_type = ?, status = ?
      WHERE device_id = ?
    `;

    await query(updateQuery, [ssaid, device_name, device_type || null, status || 'active', deviceId]);

    // Update device-expert mappings if experts are provided
    if (experts && Array.isArray(experts)) {
      // Delete existing mappings
      await query(
        'DELETE FROM device_expert_mapping WHERE device_id = ?',
        [deviceId]
      );

      // Insert new mappings
      if (experts.length > 0) {
        for (let i = 0; i < experts.length; i++) {
          const expert = experts[i];
          await query(
            `INSERT INTO device_expert_mapping (device_id, expert_id, display_type, display_order)
             VALUES (?, ?, ?, ?)`,
            [deviceId, expert.expert_id, expert.display_type || 'random', i + 1]
          );
        }
      }
    }

    return NextResponse.json({ message: 'Device updated successfully' });
  } catch (error: any) {
    console.error('Database error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'SSAID already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update device' }, { status: 500 });
  }
}

// DELETE - Delete a device
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deviceId = params.id;

    // Delete device
    const deleteQuery = 'DELETE FROM devices WHERE device_id = ?';
    await query(deleteQuery, [deviceId]);

    return NextResponse.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete device' }, { status: 500 });
  }
}
