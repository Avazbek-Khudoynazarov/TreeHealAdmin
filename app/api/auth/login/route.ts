import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, password } = body;

    // Hardcoded credentials for now
    const ADMIN_EMAIL = 'admin@gmail.com';
    const ADMIN_PASSWORD = '321321';

    if (id === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Login successful
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: ADMIN_EMAIL,
          role: 'admin'
        }
      });
    } else {
      // Invalid credentials
      return NextResponse.json(
        {
          success: false,
          message: '아이디 혹은 비밀번호가 잘못되어 있습니다.'
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}
