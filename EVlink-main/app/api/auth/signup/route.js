import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// In a real app, you would import your database models here
// and hash the password before saving to the database

export async function POST(request) {
  try {
    const { email, password, userType, name } = await request.json();

    // Validate request body
    if (!email || !password || !userType || !name) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Check if user with this email already exists
    // 2. Hash the password
    // 3. Save the new user to the database

    // For demo purposes, we'll create a mock user
    const newUser = {
      id: Date.now(),
      email,
      name,
      userType,
      createdAt: new Date().toISOString()
    };

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, userType: newUser.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
