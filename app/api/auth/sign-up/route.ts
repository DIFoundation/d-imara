import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, schoolId, guardianPhone } = await request.json()

    // Validate inputs
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In production, use Supabase Auth or similar
    // For MVP, we'll create user in database
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      schoolId,
      guardianPhone,
      verified: false,
      createdAt: new Date().toISOString(),
    }

    // Store in database
    // await supabase.from('users').insert([user])

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { ...user, password: undefined },
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
