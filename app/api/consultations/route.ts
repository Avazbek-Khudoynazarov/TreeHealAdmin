import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { corsHeaders } from '@/lib/cors';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// Generate unique request number (format: REQ-YYYYMMDD-XXXXX)
function generateRequestNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `REQ-${year}${month}${day}-${random}`;
}

// Validate phone number format (010-XXXX-XXXX)
function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  return phoneRegex.test(phone);
}

// Map category string to category_id
function getCategoryId(category: string | number): number | null {
  // If already a number, return it
  if (typeof category === 'number') {
    return category;
  }

  // Map string to ID
  const categoryMap: { [key: string]: number } = {
    'claim': 1,        // 보험보상상담
    'consultation': 2  // 보험무료상담
  };

  return categoryMap[category.toLowerCase()] || null;
}

// POST - Create consultation request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ssaid,
      category_id: category_input,
      applicant_name,
      contact_number,
      birth_date,
      gender,
      assigned_expert_id,
      consultation_type,
      detail_items,
      region,
      detailed_region
    } = body;

    // Convert category_id from string to number if needed
    const category_id = getCategoryId(category_input);

    // Validate required fields
    if (!ssaid) {
      return NextResponse.json(
        { success: false, message: '필수 항목이 누락되었습니다: ssaid' },
        { status: 400, headers: corsHeaders() }
      );
    }
    if (!category_id) {
      return NextResponse.json(
        { success: false, message: '필수 항목이 누락되었습니다: category_id (유효한 값: 1, 2, "claim", "consultation")' },
        { status: 400, headers: corsHeaders() }
      );
    }
    if (!applicant_name) {
      return NextResponse.json(
        { success: false, message: '필수 항목이 누락되었습니다: applicant_name' },
        { status: 400, headers: corsHeaders() }
      );
    }
    if (!contact_number) {
      return NextResponse.json(
        { success: false, message: '필수 항목이 누락되었습니다: contact_number' },
        { status: 400, headers: corsHeaders() }
      );
    }
    if (!birth_date) {
      return NextResponse.json(
        { success: false, message: '필수 항목이 누락되었습니다: birth_date' },
        { status: 400, headers: corsHeaders() }
      );
    }
    if (!gender) {
      return NextResponse.json(
        { success: false, message: '필수 항목이 누락되었습니다: gender' },
        { status: 400, headers: corsHeaders() }
      );
    }
    if (!consultation_type) {
      return NextResponse.json(
        { success: false, message: '필수 항목이 누락되었습니다: consultation_type' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate phone number format
    if (!validatePhoneNumber(contact_number)) {
      return NextResponse.json(
        { success: false, message: '전화번호 형식이 올바르지 않습니다' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Validate gender
    if (gender !== 'M' && gender !== 'F') {
      return NextResponse.json(
        { success: false, message: '성별은 M 또는 F여야 합니다' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Find device by ssaid
    const devices = await query(
      'SELECT device_id FROM devices WHERE ssaid = ? AND status = ?',
      [ssaid, 'active']
    ) as RowDataPacket[];

    let device_id = null;
    if (devices.length > 0) {
      device_id = devices[0].device_id;
    }

    // Validate expert if assigned
    let expert_contact = null;
    if (assigned_expert_id) {
      const experts = await query(
        'SELECT contact_number FROM experts WHERE expert_id = ? AND status = ?',
        [assigned_expert_id, 'active']
      ) as RowDataPacket[];

      if (experts.length === 0) {
        return NextResponse.json(
          { success: false, message: '지정된 전문가를 찾을 수 없습니다' },
          { status: 404, headers: corsHeaders() }
        );
      }

      expert_contact = experts[0].contact_number;
    }

    // Generate unique request number
    let request_number = generateRequestNumber();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const existing = await query(
        'SELECT request_id FROM consultation_requests WHERE request_number = ?',
        [request_number]
      ) as RowDataPacket[];

      if (existing.length === 0) {
        isUnique = true;
      } else {
        request_number = generateRequestNumber();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { success: false, message: '상담 신청 번호 생성에 실패했습니다' },
        { status: 500, headers: corsHeaders() }
      );
    }

    // Convert detail_items to JSON string
    const detail_items_json = JSON.stringify(detail_items || []);

    // Insert consultation request
    const result = await query(
      `INSERT INTO consultation_requests (
        request_number,
        device_id,
        category_id,
        applicant_name,
        contact_number,
        birth_date,
        gender,
        assigned_expert_id,
        consultation_type,
        detail_items,
        expert_contact,
        request_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request_number,
        device_id,
        category_id,
        applicant_name,
        contact_number,
        birth_date,
        gender,
        assigned_expert_id || null,
        consultation_type,
        detail_items_json,
        expert_contact,
        'pending'
      ]
    ) as ResultSetHeader;

    const request_id = result.insertId;

    return NextResponse.json({
      success: true,
      request_id: request_id,
      request_number: request_number,
      message: '상담 신청이 완료되었습니다'
    }, { status: 201, headers: corsHeaders() });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, message: '상담 신청 중 오류가 발생했습니다' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
