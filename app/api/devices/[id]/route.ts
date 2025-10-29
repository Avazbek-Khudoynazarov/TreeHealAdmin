import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PUT - Update a device
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { account, ssaid, device_name, experts } = body;
    const deviceId = params.id;

    // Validate required fields
    if (!account || !ssaid || !device_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update device
    const updateQuery = `
      UPDATE devices
      SET account = ?, ssaid = ?, device_name = ?, experts = ?
      WHERE id = ?
    `;
    const expertsJson = JSON.stringify(experts || []);

    await query(updateQuery, [account, ssaid, device_name, expertsJson, deviceId]);

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
    const deleteQuery = 'DELETE FROM devices WHERE id = ?';
    await query(deleteQuery, [deviceId]);

    return NextResponse.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete device' }, { status: 500 });
  }
}
