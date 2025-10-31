import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { corsHeaders } from '@/lib/cors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// GET - Fetch expert details by expertId
export async function GET(
  request: NextRequest,
  { params }: { params: { expertId: string } }
) {
  try {
    const { expertId } = params;

    // Validate expertId is a number
    const expertIdNum = parseInt(expertId);
    if (isNaN(expertIdNum)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 전문가 ID입니다' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Query expert by expertId
    const experts = await query(
      `SELECT expert_id, expert_name, contact_number, specialization,
              qualifications, profile_image, display_order, is_fixed,
              status, created_at, updated_at
       FROM experts
       WHERE expert_id = ?`,
      [expertIdNum]
    ) as RowDataPacket[];

    if (experts.length === 0) {
      return NextResponse.json(
        { success: false, message: '전문가를 찾을 수 없습니다' },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json({
      success: true,
      data: experts[0]
    }, { status: 200, headers: corsHeaders() });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
