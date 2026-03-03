export interface Material {
  name: string;
  url: string;
  size: string;
  type: 'pdf' | 'docx' | 'zip' | 'mp3' | 'game' | 'external';
}

export interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'game';
  teachingMode?: 'online' | 'stationary' | 'hybrid';
  duration?: string;
  content?: string;
  is_completed?: boolean;
  materials?: Material[];
  unlockAfterDays?: number;
  quizId?: string;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  excerpt: string;
  price: number;
  sale_price?: number;
  slug: string;
  image_url: string;
  category: 'pdf' | 'course' | 'audio' | 'game';
  teachingMode?: 'online' | 'stationary' | 'hybrid';
  modules?: Module[];
  progress?: number;
  enrolledAt?: string;
  source?: {
    url: string;
    importedAt: string;
    aiEnhanced: boolean;
    embedHtml?: string;
  };
}

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: "Mega Pack: Lesson Plans A1-A2 (PDF)",
    excerpt: "Complete school year. 50 ready-to-use lesson scenarios, worksheets, and additional materials in PDF format.",
    price: 199.00,
    sale_price: 149.00,
    slug: "lesson-plans-a1-a2",
    image_url: "https://placehold.co/600x400/2a2a2a/ffffff/png?text=Mega+Pack+PDF",
    category: 'pdf',
    teachingMode: 'stationary',
    progress: 15,
    enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    modules: [
      {
        id: 101,
        title: "Download Materials",
        lessons: [
          {
            id: 1,
            title: "Main Pack (PDF)",
            type: 'text',
            duration: "PDF",
            is_completed: false,
            unlockAfterDays: 0,
            materials: [
              { name: "Lesson_Plans_A1_A2_Full.pdf", url: "/materials/lesson_plans_full.pdf", size: "15.5 MB", type: "pdf" },
              { name: "Student_Worksheets.pdf", url: "/materials/worksheets.pdf", size: "8.2 MB", type: "pdf" }
            ]
          },
          {
            id: 2,
            title: "Add-ons and Bonuses",
            type: 'text',
            is_completed: false,
            unlockAfterDays: 0,
            materials: [
              { name: "Printable_Flashcards.pdf", url: "/materials/flashcards.pdf", size: "4.5 MB", type: "pdf" },
              { name: "Board_Games.pdf", url: "/materials/boardgames.pdf", size: "2.1 MB", type: "pdf" },
              { name: "Teacher_Checklist.pdf", url: "/materials/checklist.pdf", size: "0.5 MB", type: "pdf" }
            ]
          }
        ]
      },
      {
        id: 102,
        title: "Audio & Recordings (MP3)",
        lessons: [
          {
            id: 3,
            title: "Recordings for Lessons 1-25",
            type: 'video',
            duration: "45 min",
            unlockAfterDays: 0,
            materials: [
              { name: "Audio_Pack_Part1.zip", url: "/materials/audio1.zip", size: "45 MB", type: "zip" }
            ]
          },
          {
            id: 4,
            title: "Recordings for Lessons 26-50",
            type: 'video',
            duration: "50 min",
            unlockAfterDays: 0,
            materials: [
              { name: "Audio_Pack_Part2.zip", url: "/materials/audio2.zip", size: "52 MB", type: "zip" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Grammar Masterclass E-Book",
    excerpt: "Methodological e-book for teachers. How to explain grammar in a simple way.",
    price: 129.00,
    slug: "grammar-masterclass",
    image_url: "https://placehold.co/600x400/1e3a8a/ffffff/png?text=Grammar+Guide",
    category: 'pdf',
    teachingMode: 'online',
    progress: 0,
    modules: [
      {
        id: 201,
        title: "Module 1: Present Tenses",
        lessons: [
          {
            id: 21,
            title: "E-book: Present Tenses Guide",
            type: 'text',
            duration: "PDF",
            materials: [
              { name: "Grammar_Masterclass_Ebook.pdf", url: "/materials/ebook.pdf", size: "12.5 MB", type: "pdf" }
            ]
          },
          {
            id: 22,
            title: "Printable Exercises",
            type: 'text',
            materials: [
              { name: "Exercises_Pack.pdf", url: "/materials/exercises.pdf", size: "5.1 MB", type: "pdf" }
            ]
          }
        ]
      },
      {
        id: 202,
        title: "Module 2: Past Tenses",
        lessons: [
          {
            id: 23,
            title: "Past Simple vs Past Continuous",
            type: 'video',
            duration: "20:00",
            materials: [
              { name: "Past_tenses_guide.pdf", url: "/materials/past.pdf", size: "1.3 MB", type: "pdf" }
            ]
          },
          {
            id: 24,
            title: "Past Perfect - when to use?",
            type: 'video',
            duration: "18:00",
            materials: [
              { name: "Past_perfect_exercises.pdf", url: "/materials/perfect.pdf", size: "0.9 MB", type: "pdf" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Business English Worksheets Pack",
    excerpt: "Set of 100+ pages of photocopiable materials (PDF) for Business English classes.",
    price: 249.00,
    sale_price: 199.00,
    slug: "business-english-pack",
    image_url: "https://placehold.co/600x400/065f46/ffffff/png?text=Biz+English",
    category: 'pdf',
    teachingMode: 'hybrid',
    progress: 0,
    modules: [
      {
        id: 301,
        title: "Module 1: Meetings & Presentations",
        lessons: [
          {
            id: 31,
            title: "Running meetings in English",
            type: 'video',
            duration: "30:00",
            materials: [
              { name: "Meeting_phrases.pdf", url: "/materials/meeting.pdf", size: "1.8 MB", type: "pdf" },
              { name: "Role_play_cards.pdf", url: "/materials/roleplay.pdf", size: "0.6 MB", type: "pdf" }
            ]
          },
          {
            id: 32,
            title: "Business Presentations",
            type: 'video',
            duration: "25:00",
            materials: [
              { name: "Presentation_template.docx", url: "/materials/template.docx", size: "2.2 MB", type: "docx" }
            ]
          }
        ]
      }
    ]
  }
];

export function isLessonUnlocked(lesson: Lesson, enrolledAt?: string): boolean {
  if (!lesson.unlockAfterDays || lesson.unlockAfterDays === 0) return true;
  if (!enrolledAt) return true;
  const enrollDate = new Date(enrolledAt);
  const now = new Date();
  const daysSinceEnrollment = Math.floor((now.getTime() - enrollDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceEnrollment >= lesson.unlockAfterDays;
}

export function getDaysUntilUnlock(lesson: Lesson, enrolledAt?: string): number {
  if (!lesson.unlockAfterDays || lesson.unlockAfterDays === 0) return 0;
  if (!enrolledAt) return 0;
  const enrollDate = new Date(enrolledAt);
  const now = new Date();
  const daysSinceEnrollment = Math.floor((now.getTime() - enrollDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, lesson.unlockAfterDays - daysSinceEnrollment);
}
