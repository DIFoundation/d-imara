import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const schoolId = request.nextUrl.searchParams.get("schoolId")

    console.log(schoolId)

    // In production, fetch from database
    // const students = await supabase.from('students').select('*').eq('school_id', schoolId)

    // Mock data
    const mockStudents = [
      {
        id: "1",
        name: "John Doe",
        schoolId: "SCHOOL001",
        learningPoints: 85,
        tier: "Silver",
        quizzesCompleted: 5,
        avgScore: 78,
      },
      {
        id: "2",
        name: "Jane Smith",
        schoolId: "SCHOOL001",
        learningPoints: 45,
        tier: "Bronze",
        quizzesCompleted: 3,
        avgScore: 72,
      },
    ]

    return NextResponse.json(mockStudents)
  } catch {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
