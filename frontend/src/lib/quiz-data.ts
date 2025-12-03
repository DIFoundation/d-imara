export const quizzesData = [
  {
    id: 1,
    title: "Math Basics",
    category: "Math",
    difficulty: "Easy",
    reward: 10,
    description: "Test your basic math skills",
    questions: [
      {
        id: 1,
        q: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: 1,
      },
      {
        id: 2,
        q: "What is 10 - 3?",
        options: ["5", "6", "7", "8"],
        correct: 2,
      },
      {
        id: 3,
        q: "What is 5 × 4?",
        options: ["15", "18", "20", "25"],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: "Science 101",
    category: "Science",
    difficulty: "Medium",
    reward: 15,
    description: "Explore fundamental science concepts",
    questions: [
      {
        id: 1,
        q: "What is H2O?",
        options: ["Oxygen", "Water", "Salt", "Carbon"],
        correct: 1,
      },
      {
        id: 2,
        q: "What is the speed of light?",
        options: ["150,000 km/s", "300,000 km/s", "450,000 km/s", "600,000 km/s"],
        correct: 1,
      },
      {
        id: 3,
        q: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2,
      },
    ],
  },
  {
    id: 3,
    title: "History",
    category: "History",
    difficulty: "Hard",
    reward: 20,
    description: "Journey through historical events",
    questions: [
      {
        id: 1,
        q: "When was the internet publicly released?",
        options: ["1969", "1989", "1999", "1995"],
        correct: 1,
      },
      {
        id: 2,
        q: "Who was the first President of the USA?",
        options: ["Thomas Jefferson", "George Washington", "John Adams", "Benjamin Franklin"],
        correct: 1,
      },
      {
        id: 3,
        q: "What year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2,
      },
    ],
  },
]

export function getQuizById(id: number) {
  return quizzesData.find((q) => q.id === id)
}

export function calculateScore(
  quiz: (typeof quizzesData)[0],
  answers: number[],
): { score: number; percentage: number; reward: number } {
  const correct = answers.filter((answer, idx) => answer === quiz.questions[idx].correct).length
  const score = correct
  const percentage = (score / quiz.questions.length) * 100
  const reward = Math.round((percentage / 100) * quiz.reward)
  return { score, percentage, reward }
}
