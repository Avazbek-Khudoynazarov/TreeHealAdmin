import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultants = await query(
      'SELECT * FROM consultants WHERE id = ?',
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
      'UPDATE consultants SET name = ?, phone = ?, career = ?, qualification = ?, image = ? WHERE id = ?',
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
    await query('DELETE FROM consultants WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Consultant deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete consultant' },
      { status: 500 }
    );
  }
}
