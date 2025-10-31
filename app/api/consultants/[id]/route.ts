import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultants = await query(
      `SELECT expert_id as id, expert_name as name, contact_number as phone,
              specialization as career, qualifications as qualification,
              profile_image as image, created_at, updated_at
       FROM experts WHERE expert_id = ?`,
      [params.id]
    );

    if (!Array.isArray(consultants) || consultants.length === 0) {
      return NextResponse.json(
        { error: 'Consultant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(consultants[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultant' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, phone, career, qualification, image } = body;

    await query(
      'UPDATE experts SET expert_name = ?, contact_number = ?, specialization = ?, qualifications = ?, profile_image = ? WHERE expert_id = ?',
      [name, phone, career, qualification, image, params.id]
    );

    return NextResponse.json({ message: 'Consultant updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update consultant' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM experts WHERE expert_id = ?', [params.id]);
    return NextResponse.json({ message: 'Consultant deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete consultant' },
      { status: 500 }
    );
  }
}
