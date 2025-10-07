import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// This is just a mock user - in a real app, you would query your database
const mockUser = {
  id: 1,
  email: 'user@example.com',  // In a real app, you would validate credentials against a database
  name: 'Test User',
  userType: 'ev-owner',
  password: 'password123' // In a real app, never store plain text passwords
};

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // In a real app, you would:
    // 1. Validate the request body
    // 2. Check if the user exists in the database
    // 3. Verify the password (using bcrypt or similar)
    if (email !== mockUser.email || password !== mockUser.password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: mockUser.id, email: mockUser.email, userType: mockUser.userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return the token and user data (without password)
    const { password: _, ...userWithoutPassword } = mockUser;
    
    return NextResponse.json({
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
