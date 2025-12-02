import { type NextRequest, NextResponse } from "next/server"

// Mock quiz data
const mockQuizzes = [
  {
    id: "1",
    title: "Math Fundamentals",
    subject: "Mathematics",
    course: "Course 1",
    description: "Basic math operations and problem solving",
    questions: [
      { id: 1, text: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
      { id: 2, text: "What is 10 - 3?", options: ["5", "6", "7", "8"], correct: 2 },
    ],
    passingScore: 60,
  },
  {
    id: "2",
    title: "English Grammar",
    subject: "English",
    course: "Course 2",
    description: "Basic English grammar and sentence structure",
    questions: [
      {
        id: 1,
        text: "Choose the correct sentence:",
        options: ["He go to school", "He goes to school", "He going to school"],
        correct: 1,
      },
    ],
    passingScore: 60,
  },
]

export async function GET(request: NextRequest) {
  try {
    const subject = request.nextUrl.searchParams.get("subject")

    if (subject) {
      const filtered = mockQuizzes.filter((q) => q.subject.toLowerCase() === subject.toLowerCase())
      return NextResponse.json(filtered)
    }

    return NextResponse.json(mockQuizzes)
  } catch {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const quizData = await request.json()

    // Validate quiz data
    if (!quizData.title || !quizData.questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newQuiz = {
      id: Math.random().toString(36).substr(2, 9),
      ...quizData,
    }

    // In production, save to database
    // await supabase.from('quizzes').insert([newQuiz])

    return NextResponse.json(newQuiz, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
